# Deployment Guide — WriteSpace

## Deploying to Vercel

### 1. Connect Your Git Repository

1. Sign in to [Vercel](https://vercel.com) with your GitHub, GitLab, or Bitbucket account.
2. Click **"Add New Project"** from the Vercel dashboard.
3. Select the **writespace** repository from the list.
4. Click **Import**.

### 2. Configure Build Settings

Vercel should auto-detect Vite, but verify the following settings before deploying:

| Setting            | Value              |
| ------------------ | ------------------ |
| **Framework Preset** | Vite             |
| **Build Command**    | `npm run build`  |
| **Output Directory** | `dist`           |
| **Install Command**  | `npm install`    |
| **Node.js Version**  | 18.x or 20.x    |

If Vercel does not auto-detect the framework, select **Vite** from the framework preset dropdown manually.

### 3. Environment Variables

WriteSpace does not require any environment variables for deployment. There are no API keys, backend URLs, or secrets to configure.

If you extend the app in the future and need environment variables, add them in the Vercel dashboard under **Settings → Environment Variables**. Remember that Vite only exposes variables prefixed with `VITE_` to the client bundle (accessed via `import.meta.env.VITE_*`).

### 4. Deploy

Click **Deploy**. Vercel will:

1. Clone your repository
2. Run `npm install`
3. Run `npm run build`
4. Serve the contents of the `dist` directory

Your app will be live at `https://your-project-name.vercel.app` within a few minutes.

---

## SPA Rewrites — `vercel.json`

WriteSpace is a single-page application (SPA) using client-side routing via React Router. When a user navigates directly to a URL like `/editor` or refreshes the page on a non-root route, the server needs to return `index.html` instead of a 404 error.

The `vercel.json` file at the project root handles this:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

**How it works:**

- The `rewrites` rule tells Vercel to serve `index.html` for **every** request that doesn't match a static file in the `dist` directory.
- Static assets (JS bundles, CSS, images in `dist/assets/`) are served normally because Vercel checks for static files before applying rewrites.
- Once `index.html` loads, React Router takes over and renders the correct component based on the URL.

> **Without this configuration**, any direct URL access or page refresh on a non-root route would result in a **404 Not Found** error from Vercel.

---

## Troubleshooting

### Direct URL Access Returns 404

**Symptom:** Navigating directly to a route like `https://your-app.vercel.app/editor` shows a Vercel 404 page.

**Cause:** The `vercel.json` rewrite rule is missing or misconfigured.

**Fix:**
1. Ensure `vercel.json` exists in the project root (not inside `src/`).
2. Verify it contains the rewrite rule shown above.
3. Redeploy after making changes.

### Build Fails on Vercel

**Symptom:** Deployment fails during the build step.

**Fix:**
1. Run `npm run build` locally to reproduce the error.
2. Check for missing dependencies — ensure all imports reference packages listed in `package.json`.
3. Verify there are no TypeScript or ESLint errors blocking the build.
4. Check the Vercel build logs for the specific error message.

### Blank Page After Deployment

**Symptom:** The app deploys successfully but shows a blank white page.

**Fix:**
1. Open the browser developer console and check for errors.
2. Verify the `base` option in `vite.config.js` is not set to a subdirectory (it should be `'/'` or omitted for root deployment).
3. Ensure `index.html` references the entry point correctly.

### Assets Not Loading (404 for JS/CSS)

**Symptom:** The HTML loads but JavaScript and CSS files return 404.

**Fix:**
1. Confirm the **Output Directory** in Vercel is set to `dist`.
2. Check that `npm run build` produces files in the `dist` directory locally.
3. Ensure no `.vercelignore` or `.gitignore` rule is excluding the build output.

---

## Local Preview

Before deploying, you can preview the production build locally:

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

This starts a local static server (default: `http://localhost:4173`) serving the `dist` directory. It closely mirrors how the app will behave in production on Vercel.

> **Note:** `npm run preview` serves the built output — it does not support hot module replacement. Use `npm run dev` for development with HMR.

---

## Automatic Deployments

Once connected to Vercel, every push to your default branch (e.g., `main`) triggers an automatic **production deployment**. Pushes to other branches create **preview deployments** with unique URLs, which is useful for reviewing pull requests before merging.

To disable automatic deployments, go to **Settings → Git** in your Vercel project dashboard.