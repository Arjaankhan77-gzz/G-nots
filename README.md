# InsideBox — sign-up-with-OTP notes site, hosted on GitHub Pages

A multi-page site: sign up with email + password, verify a 6-digit code
sent to your email, pick a unique username, then land on a notes
dashboard where each note can be **Public** (anyone can read it) or
**Private** (only the emails you pick can read it).

GitHub Pages only serves static files — it can't run a login system,
send email, or check a database by itself. So this uses two free
services under the hood:

- **Firebase** — accounts, the notes database, and username uniqueness
- **EmailJS** — sends the 6-digit signup code to a person's inbox

Both have generous free tiers and need no credit card.

## Pages in this folder

| File | What it is |
|---|---|
| `index.html` | Sign in ("Welcome back") — email or username + password |
| `signup.html` | 3-step sign up: email+password → email code → name/username |
| `forgot-password.html` | Request a password reset link |
| `reset-password.html` | Where the emailed reset link lands, sets new password |
| `complete-profile.html` | First-time Google sign-in — pick a username |
| `dashboard.html` | The notes app itself (from before) |
| `styles.css`, `firebase-init.js`, `common.js` | Shared code every page uses |

## 1. Create your Firebase project

1. https://console.firebase.google.com → **Add project**.
2. **Build → Authentication → Get started.**
   - Enable the **Email/Password** provider.
   - Also enable **Google** as a provider (for the "Sign in with Google" button) — just toggle it on and save, no extra config needed for a basic setup.
3. **Build → Firestore Database → Create database** → start in **production mode**.
4. ⚙ **Project settings** → scroll to "Your apps" → click **</>** to register a web app → copy the `firebaseConfig` object it shows you.
5. Paste those values into `firebase-init.js`, replacing the `YOUR_...` placeholders.

## 2. Publish the security rules

**Firestore Database → Rules** → paste in the contents of `firestore.rules`
→ **Publish**. This is what actually enforces: only note owners can
edit/delete their notes, private notes are only readable by people on
the share list, and — importantly — that **no two accounts can claim the
same username** (a username is only reserved if that exact document
doesn't already exist).

## 3. Set up EmailJS (for the signup code)

1. https://www.emailjs.com → sign up free.
2. **Email Services** → connect an email account (Gmail works fine) →
   note the **Service ID**.
3. **Email Templates** → create a template. Use `{{to_email}}` and
   `{{otp_code}}` as variables somewhere in it, e.g.:
   > Subject: Your InsideBox verification code
   > Body: Your code is **{{otp_code}}**. It expires in 10 minutes.
   Note the **Template ID**.
4. **Account → General** → copy your **Public Key**.
5. Paste all three into `firebase-init.js`'s `emailjsConfig`.

## 4. Turn on password-reset emails

Firebase already sends these automatically once Email/Password auth is
enabled — no extra setup needed. Optional: **Authentication → Templates
→ Password reset → edit** if you want to customize the wording, and set
the action link to point at your own `reset-password.html` instead of
Firebase's default page (under "Customize action URL").

## 5. Put it on GitHub Pages

1. Create a repo on GitHub, upload every file in this folder to it.
2. **Settings → Pages → Source** → pick your branch, folder `/ (root)` → **Save**.
3. Your site goes live at `https://yourusername.github.io/reponame/`.

## How the flows work

**Sign up** (`signup.html`)
1. Person enters email + password.
2. A 6-digit code is generated, saved in Firestore with a 10-minute
   expiry, and emailed via EmailJS.
3. Once they type the correct code, the real account is created in
   Firebase Auth (this is when the email is confirmed as theirs).
4. They then enter first name, last name, and a username, and confirm
   their password. Availability is checked live as they type. Submitting
   reserves the username and saves their profile.

**Username uniqueness** — enforced two ways: the site checks live while
typing, and Firestore's own rules physically block two accounts from
owning the same username document, even in a race between two people
signing up at the same instant. `Axyz.22`, `Bxyz.22`, `Axyz22`, and
`Axyz.44` are all different strings, so all are available independently.

**Sign in** (`index.html`) — accepts either an email or a username. If
it's not an email-shaped value, the site looks up which account owns
that username first, then signs in with the matching email.

**Forgot password** — for security, this can't be a typed code the way
signup verification is: changing an *existing* password without some
server involved isn't something a purely static site can safely do.
So instead it uses the same approach Google and most major sites use —
a one-time link emailed to you, which lands on `reset-password.html` to
set a new password.

## A note on the OTP security tradeoff

The signup code is stored and checked entirely through Firestore rather
than a server, since this project has no backend. That's fine for a
personal or small-audience site — the code is random, expires in 10
minutes, and locks after 5 wrong tries — but it's not the airtight setup
a bank or large product would use (that would run the same checks inside
a Cloud Function instead of the browser). Worth knowing, not something
that needs fixing right now.
