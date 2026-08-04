/* =====================================================================
   FIREBASE + EMAILJS SETUP REQUIRED — full steps are in README.md
   1. Firebase project: Auth (Email/Password + Google) + Firestore
   2. EmailJS account: used to send the 6-digit signup code by email
   ===================================================================== */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
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
