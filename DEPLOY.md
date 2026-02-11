# Deploy to Vercel

## core-steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   Run the deploy command from the project root:
   ```bash
   vercel
   ```
   - Follow the prompts (Select scope, Link to existing project: No, etc.)
   - For "Build Command", keep default (`vite build`).
   - For "Output Directory", keep default (`dist`).
   - For "Development Command", keep default.

4. **Environment Variables**:
   **CRITICAL**: You MUST add the following Environment Variables in the Vercel Dashboard for your project (Settings -> Environment Variables):

   | Variable | Description |
   |Keys|Values|
   |---|---|
   | `VITE_DATABASE_URL` | Your Neon Postgres connection string (e.g., `postgresql://user:pass@ep-xyz.aws.neon.tech/neondb?sslmode=require`) |
   | `VITE_GROQ_API_KEY` | Your Groq API Key for AI generation |
   | `VITE_FIREBASE_API_KEY` | Firebase API Key |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
   | `VITE_FIREBASE_PROJECT_ID` | Firebase Project ID |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
   | `VITE_FIREBASE_APP_ID` | Firebase App ID |
   | `VITE_FIREBASE_MEASUREMENT_ID` | Firebase Measurement ID |

   *Note: You can copy these values from your local `.env` file.*

5. **Redeploy**:
   After adding the environment variables, you may need to redeploy for them to take effect:
   ```bash
   vercel --prod
   ```

## Troubleshooting

- **Database Connection**: If the app loads but data doesn't save, double-check `VITE_DATABASE_URL` in Vercel.
- **AI Generation Fails**: Check `VITE_GROQ_API_KEY`.
- **404 on Refresh**: Vercel handles SPA routing automatically, but if issues persist, ensure `vercel.json` is present (it is part of the repo).
