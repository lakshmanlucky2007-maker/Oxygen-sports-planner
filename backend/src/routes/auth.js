const express = require('express');
const router = express.Router();
const prisma = require('../services/prisma');
const db = require('../services/db');
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

function normalizeUserRecord(userRecord) {
  if (!userRecord) {
    return null;
  }

  return {
    id: userRecord.id,
    email: userRecord.email,
    name: userRecord.name,
    avatar: userRecord.avatar,
    role: userRecord.role || 'Parent',
    provider: userRecord.provider || 'EMAIL'
  };
}

async function findUserById(id) {
  const result = await db.query(
    `SELECT id, email, name, avatar, role, provider FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return normalizeUserRecord(result.rows[0]);
}

async function findUserByEmail(email) {
  const result = await db.query(
    `SELECT id, email, name, avatar, role, provider FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  return normalizeUserRecord(result.rows[0]);
}

async function updateUserRecord(id, data) {
  const fields = [];
  const params = [];
  let index = 1;

  for (const [key, value] of Object.entries(data)) {
    const column = key === 'createdAt' ? 'created_at' : key;
    fields.push(`${column} = $${index++}`);
    params.push(value);
  }

  params.push(id);

  await db.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${index}`,
    params
  );

  return findUserById(id);
}

async function createUserRecord(data) {
  try {
    const existingById = await findUserById(data.id);
    if (existingById) {
      return existingById;
    }

    const existingByEmail = await findUserByEmail(data.email);
    if (existingByEmail) {
      return updateUserRecord(existingByEmail.id, {
        name: data.name || existingByEmail.name,
        avatar: data.avatar || existingByEmail.avatar,
        role: existingByEmail.role || data.role || 'Parent',
        provider: data.provider || 'GOOGLE'
      });
    }

    await db.query(
      `INSERT INTO users (id, email, name, avatar, role, provider)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [data.id, data.email, data.name, data.avatar, data.role, data.provider]
    );

    return findUserById(data.id);
  } catch (err) {
    console.warn('[auth] createUserRecord raw DB path failed:', err.message);
    throw err;
  }
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
    userRecord = await findUserById(uid);

    if (!userRecord) {
      // Prevent duplicate accounts for the same email by checking by email first
      try {
        userRecord = await findUserByEmail(email);
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
          userRecord = await updateUserRecord(userRecord.id, {
            name: name || userRecord.name,
            ...(!isCustomAvatar && avatar ? { avatar } : {}),
            provider: 'GOOGLE'
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
          userRecord = await createUserRecord({
            id: uid,
            email: email,
            name: name || '',
            avatar: avatar,
            role: role,
            provider: 'GOOGLE'
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
        userRecord = await updateUserRecord(uid, {
          name: name || userRecord.name,
          ...(!isCustomAvatar && avatar ? { avatar } : {}),
          provider: 'GOOGLE'
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
    const updatedUser = await updateUserRecord(userId, { avatar });

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
    const updatedUser = await updateUserRecord(userId, { role: targetMode });

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
