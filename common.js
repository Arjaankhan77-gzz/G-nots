function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

function genOtp(){
  return String(Math.floor(100000 + Math.random()*900000));
}

/* Store a fresh OTP for this email + purpose, and email it via EmailJS.
   purpose: 'signup' */
async function requestOtp(email, purpose){
  const code = genOtp();
  const expiresAt = Date.now() + 10*60*1000; // 10 minutes
  await db.collection('otps').doc(email.toLowerCase()).set({
    code, purpose, expiresAt, attempts: 0, verified: false
  });
  await emailjs.send(emailjsConfig.serviceId, emailjsConfig.otpTemplateId, {
    to_email: email,
    otp_code: code
  });
  return true;
}

/* Returns {ok:true} or {ok:false, reason:'expired'|'wrong'|'too_many'|'none'} */
async function checkOtp(email, purpose, entered){
  const ref = db.collection('otps').doc(email.toLowerCase());
  const snap = await ref.get();
  if(!snap.exists) return {ok:false, reason:'none'};
  const data = snap.data();
  if(data.purpose !== purpose) return {ok:false, reason:'none'};
  if(data.attempts >= 5) return {ok:false, reason:'too_many'};
  if(Date.now() > data.expiresAt) return {ok:false, reason:'expired'};
  if(data.code !== String(entered).trim()) {
    await ref.update({attempts: firebase.firestore.FieldValue.increment(1)});
    return {ok:false, reason:'wrong'};
  }
  await ref.update({verified:true});
  return {ok:true};
}

/* Returns true if the exact username string is free to take. */
async function isUsernameAvailable(username){
  const doc = await db.collection('usernames').doc(username).get();
  return !doc.exists;
}

/* Reserve the username for uid (fails if taken — enforced by Firestore rules too). */
async function reserveUsername(username, uid, email){
  await db.collection('usernames').doc(username).set({uid, email});
}
