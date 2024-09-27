const admin = require("firebase-admin");

const serviceAccount = require(""); // path to firebase-adminsdk.json

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const adminAuth = admin.auth();

module.exports = adminAuth;
