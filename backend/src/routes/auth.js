const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const jwt = require('jsonwebtoken');
const { verifyFirebaseIdToken } = require('../services/firebase');
const authMiddleware = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_oxygen_sports';

/**
 * Generate initials-based circular SVG avatar as a data URI (backend fallback)
 */
function generateDefaultInitialsAvatar(name) {
  const cleanName = (name || 'User').trim();
  const initials = cleanName
    .split(/\s+/)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#14B8A6', '#F97316', '#6366F1'
  ];

  // Hash name to select color consistently
  let hash = 0;
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = colors[Math.abs(hash) % colors.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100" height="100" rx="24" fill="${color}"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="36" font-weight="bold">${initials}</text></svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// POST /api/auth/login - Register or update user details upon Google Sign-In
router.post('/login', async (req, res, next) => {
  const { idToken, role = 'Parent' } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION',
      message: 'Google/Firebase ID Token is required'
    });
  }

  try {
    // Verify Firebase ID Token
    let userData;
    try {
      userData = await verifyFirebaseIdToken(idToken);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'INVALID_TOKEN',
        message: err.message || 'Invalid Firebase ID token'
      });
    }

    const uid = userData.uid;
    const email = userData.email;
    const name = userData.name || email.split('@')[0];
    // If google avatar is missing, generate initials avatar fallback
    const avatar = userData.avatar || generateDefaultInitialsAvatar(name);

    let userRecord = null;

    // Check if user exists by ID (Google UID) using Prisma
    userRecord = await prisma.user.findUnique({
      where: { id: uid }
    });

    if (!userRecord) {
      // Prevent duplicate accounts for the same email by checking by email first
      try {
        userRecord = await prisma.user.findUnique({
          where: { email: email }
        });
      } catch (err) {
        console.error("Prisma failed to check user by email:", err);
        return res.status(500).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Error checking existing email registrations.'
        });
      }

      if (userRecord) {
        // Link Google provider info to existing account
        // If current avatar is a custom SVG data URI, preserve it. Otherwise update with Google avatar.
        const isCustomAvatar = userRecord.avatar && userRecord.avatar.startsWith('data:');
        
        try {
          userRecord = await prisma.user.update({
            where: { id: userRecord.id },
            data: {
              name: name || userRecord.name,
              ...(!isCustomAvatar && avatar ? { avatar } : {}),
              provider: 'GOOGLE'
            }
          });
        } catch (err) {
          console.error("Prisma failed to update existing user record:", err);
          return res.status(500).json({
            success: false,
            error: 'DATABASE_ERROR',
            message: 'Failed to update user profile information.'
          });
        }
      } else {
        // Create new user using Prisma
        try {
          userRecord = await prisma.user.create({
            data: {
              id: uid,
              email: email,
              name: name || '',
              avatar: avatar,
              role: role,
              provider: 'GOOGLE'
            }
          });
        } catch (err) {
          console.error("Prisma failed to create user record:", err);
          return res.status(500).json({
            success: false,
            error: 'DATABASE_ERROR',
            message: 'Failed to register your Google Account user record.'
          });
        }
      }
    } else {
      // User exists by ID. Update details but preserve custom chosen avatars.
      const isCustomAvatar = userRecord.avatar && userRecord.avatar.startsWith('data:');
      
      try {
        userRecord = await prisma.user.update({
          where: { id: uid },
          data: {
            name: name || userRecord.name,
            ...(!isCustomAvatar && avatar ? { avatar } : {}),
            provider: 'GOOGLE'
          }
        });
      } catch (err) {
        console.error("Prisma failed to update existing Google user record:", err);
        return res.status(500).json({
          success: false,
          error: 'DATABASE_ERROR',
          message: 'Failed to synchronize your Google Account user record.'
        });
      }
    }

    // Generate local JWT access token
    const jwtPayload = {
      uid: userRecord.id,
      email: userRecord.email,
      name: userRecord.name,
      avatar: userRecord.avatar
    };

    const accessToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      success: true,
      message: 'User session synced successfully',
      token: accessToken,
      user: {
        uid: userRecord.id,
        email: userRecord.email,
        name: userRecord.name,
        avatar: userRecord.avatar,
        role: userRecord.role
      }
    });

  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/update-avatar - Edit selected avatar
router.put('/update-avatar', authMiddleware, async (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user.uid;

  if (!avatar) {
    return res.status(400).json({
      success: false,
      message: 'Avatar is required'
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar }
    });

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      avatar: updatedUser.avatar
    });
  } catch (err) {
    next(err);
  }
});

// PUT/POST /api/auth/update-role & /api/auth/update-planner-mode - Update Planner Mode
const handleUpdateRole = async (req, res, next) => {
  const { role, plannerMode } = req.body;
  const userId = req.user.uid;
  const targetMode = role || plannerMode;

  if (targetMode !== 'Parent' && targetMode !== 'Coach') {
    console.error(`[update-role] Invalid planner mode payload value: "${targetMode}"`);
    return res.status(400).json({
      success: false,
      message: 'Invalid Planner Mode value. Allowed values are Parent and Coach.'
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: targetMode }
    });

    console.log(`[update-role] Updated user ${userId} planner mode to ${targetMode}`);

    res.json({
      success: true,
      message: 'Planner Mode updated successfully',
      plannerMode: updatedUser.role,
      role: updatedUser.role
    });
  } catch (err) {
    console.error(`[update-role] Database error updating user ${userId} planner mode:`, err.message);
    next(err);
  }
};

router.put('/update-role', authMiddleware, handleUpdateRole);
router.post('/update-role', authMiddleware, handleUpdateRole);
router.put('/update-planner-mode', authMiddleware, handleUpdateRole);
router.post('/update-planner-mode', authMiddleware, handleUpdateRole);

module.exports = router;
