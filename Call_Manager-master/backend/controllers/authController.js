// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
// const { getAnalytics } = require("firebase/analytics");
const { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
    GoogleAuthProvider,
    signInWithCredential
} = require('firebase/auth');
const { firebaseConfig } = require('./fire');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

console.log("Firebase initialized with config:", JSON.stringify({
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
}));

async function signIn(req, res) {
    try {
        console.log("Sign in attempt:", req.body.email);
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User signed in successfully:", user.email);
            res.status(200).json(user);
        } catch (authError) {
            console.error("Sign in error:", authError.code, authError.message);
            res.status(400).json({ 
                error: true, 
                code: authError.code, 
                message: authError.message 
            });
        }
    } catch (error) {
        console.error("Server error during sign in:", error);
        res.status(500).json({ error: "Server error during sign in" });
    }
}

async function signUp(req, res) {
    try {
        console.log("Sign up attempt:", req.body.email);
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User created successfully:", user.email);
            res.status(200).json(user);
        } catch (authError) {
            console.error("Sign up error:", authError.code, authError.message);
            res.status(400).json({ 
                error: true, 
                code: authError.code, 
                message: authError.message 
            });
        }
    } catch (error) {
        console.error("Server error during sign up:", error);
        res.status(500).json({ error: "Server error during sign up" });
    }
}

async function googleSignIn(req, res) {
    try {
        console.log("Google sign in attempt");
        const idToken = req.body.idToken;
        
        if (!idToken) {
            return res.status(400).json({ error: "Google ID token is required" });
        }

        try {
            // Create a Google credential with the token
            const credential = GoogleAuthProvider.credential(idToken);
            
            // Sign in with credential
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;
            
            console.log("User signed in with Google successfully:", user.email);
            res.status(200).json(user);
        } catch (authError) {
            console.error("Google sign in error:", authError.code, authError.message);
            res.status(400).json({ 
                error: true, 
                code: authError.code, 
                message: authError.message 
            });
        }
    } catch (error) {
        console.error("Server error during Google sign in:", error);
        res.status(500).json({ error: "Server error during Google sign in" });
    }
}

async function signOutFunction(req, res) {
    try {
        await signOut(auth);
        console.log('User logged out successfully');
        res.status(200).json({ 'logout': true });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ error: "Error logging out" });
    }
}

async function getCurrentUser(req, res) {
    try {
        const user = auth.currentUser;
        res.status(200).json(user || null);
    } catch (error) {
        console.error("Error getting current user:", error);
        res.status(500).json({ error: "Error getting current user" });
    }
}

module.exports = { signIn, signOutFunction, signUp, getCurrentUser, googleSignIn };

