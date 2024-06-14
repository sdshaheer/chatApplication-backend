const { getFirestore } = require('firebase-admin/firestore');
const admin = require('firebase-admin');

const checkUserExistsInFireBase = async (uid) => {
    try {
        const userRecord = await admin.auth().getUser(uid);
        console.log(`User ${uid} exists:`, userRecord.toJSON());
        return true;
    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.log(`User ${uid} does not exist.`);
            return false;
        } else {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }
}

module.exports = {
    checkUserExistsInFireBase
}