# Firebase Setup Required

## Error: CONFIGURATION_NOT_FOUND

You need to enable authentication methods in Firebase Console.

## Steps to Fix:

1. Go to: https://console.firebase.google.com/project/ai-career-coach-agent/authentication/providers

2. Click on **"Email/Password"** → Enable it → Save

3. Click on **"Google"** → Enable it → Add your email as support email → Save

4. Done! Refresh your app and try again.

## Alternative: Use Only Email/Password (Simpler)

If you don't want Google sign-in, just enable Email/Password and remove Google button.

### Remove Google Sign-In Button:

Edit `src/pages/Auth.tsx` - Remove these lines:
- Line with `signInWithGoogle`
- The "Or" divider section
- The "Sign in with Google" button

That's it!
