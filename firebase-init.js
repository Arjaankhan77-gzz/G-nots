/* =====================================================================
   FIREBASE + EMAILJS SETUP REQUIRED — full steps are in README.md
   1. Firebase project: Auth (Email/Password + Google) + Firestore
   2. EmailJS account: used to send the 6-digit signup code by email
   ===================================================================== */
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOT9IRFRDgaMOXlB30IgcYBM3UGxGhnj0",
  authDomain: "g-note-c02d9.firebaseapp.com",
  projectId: "g-note-c02d9",
  storageBucket: "g-note-c02d9.firebasestorage.app",
  messagingSenderId: "514150256929",
  appId: "1:514150256929:web:bb0606d31ed17ddafe6e60",
  measurementId: "G-KYPHE8TC6T"
};
const emailjsConfig = {
  publicKey: "YOUR_EMAILJS_PUBLIC_KEY",
  serviceId: "YOUR_EMAILJS_SERVICE_ID",
  otpTemplateId: "YOUR_EMAILJS_OTP_TEMPLATE_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
if(window.emailjs) emailjs.init(emailjsConfig.publicKey);
