const admin = require('firebase-admin');

let adminInitialized = false;

// Initialize Firebase Admin SDK
try {
  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountVar) {
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountVar);
    } catch (e) {
      serviceAccount = require(serviceAccountVar);
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully via service account.');
    adminInitialized = true;
  } else {
    // Fallback: Initialize with project ID if no service account key is supplied.
    // If the developer has logged in via Google Cloud CLI, application default credentials might be found.
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'growth-gear-ai'
    });
    console.log('Firebase Admin SDK initialized with project ID fallback.');
    adminInitialized = true;
  }
} catch (err) {
  console.warn('Firebase Admin SDK initialization skipped/failed: %s. Relying on Google identity lookup API.', err.message);
}

/**
 * Verify Firebase ID Token
 * @param {string} idToken 
 * @returns {Promise<{uid: string, email: string, name?: string, avatar?: string}>}
 */
async function verifyFirebaseIdToken(idToken) {
  // If firebase-admin is initialized and might have credentials, try standard verification
  if (adminInitialized) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
        avatar: decodedToken.picture
      };
    } catch (err) {
      console.warn('Firebase Admin verifyIdToken check failed, attempting HTTP lookup API fallback: %s', err.message);
    }
  }

  // Fallback: Verify token using Google Identity Toolkit accounts:lookup API.
  // This verifies signature, audience, and expiration dynamically via Google Auth servers.
  const apiKey = process.env.FIREBASE_API_KEY || 'AIzaSyBBu09sNsMOpBAjacrbyTjZsMbgpC8pcZI';
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ idToken })
  });

  const data = await response.json();

  if (!response.ok || !data.users || data.users.length === 0) {
    const errorMsg = data.error?.message || 'Invalid Firebase ID token';
    throw new Error(errorMsg);
  }

  const user = data.users[0];
  return {
    uid: user.localId,
    email: user.email,
    name: user.displayName,
    avatar: user.photoUrl
  };
}

module.exports = {
  verifyFirebaseIdToken
};
