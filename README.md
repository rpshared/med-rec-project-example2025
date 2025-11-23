# Voice-driven Medication List

This project is a minimal static web application that lets you speak medication instructions and instantly see a structured list containing the medication name, dosage, instructions, and notes. It is designed so it can be dropped directly into GitHub Pages or any other static host—no custom server is required.

## Features
- Click-to-talk interface powered by the browser's built-in Web Speech API.
- Live transcript of what the browser heard.
- Simple heuristic parser that turns spoken comma-separated phrases into medication entries.
- 100% static assets so it runs anywhere (including GitHub Pages) without a backend.

## Getting started locally
You do **not** need Node, npm, or any backend. There are two easy ways to run the app:

### Option A: Open the file directly (fastest)
1. Clone or download the repository.
2. Double-click `index.html` to open it in a Chromium-based browser (Chrome/Edge/Brave/Vivaldi).
3. Click **🎙️ Click to talk**, allow microphone access, and speak your medication list, for example:
   > "Metformin, 500 milligrams, two tablets by mouth twice a day. Lisinopril, 10 milligrams, once by mouth each day."

### Option B: Serve the folder (closest to production)
1. From the project root, run one of these one-liners:
   ```bash
   # npm-friendly option (uses the built-in Node static server)
   npm start

   # If you prefer other tools
   npx serve .
   python -m http.server 8000
   ```
2. Visit the reported localhost URL (default `http://localhost:3000` when using `npm start`).
3. Click **🎙️ Click to talk**, allow microphone access, and speak your medication list.

### Option C: Test inside an online IDE (Codespaces/Replit/Codex)
If you're using a cloud editor, open `index.html` with its built-in preview (or enable a simple static server as above). The
app is 100% static, so any IDE that lets you preview HTML will run it without extra setup.

## Quick test run
If you just want to verify the build works end-to-end:

1. Ensure you are using a Chromium-based browser (Chrome/Edge) with microphone access allowed.
2. Launch the app with Option A, B, or C above.
3. For a fast smoke-test, click **Load sample meds** to populate the card. Then click **🎙️ Start talking** and read your own
   list to confirm the voice flow. Each entry appears under **Medication list** as name, dosage, directions, and optional notes.

## Deploying to GitHub Pages
1. Commit the repository to GitHub.
2. In the repository settings, enable **Pages** and choose the `main` branch (root) as the source.
3. After GitHub finishes building, visit `https://<your-username>.github.io/<repo-name>/` to use the voice-driven medication list.

Any other static hosting solution (Netlify Drop, Cloudflare Pages, S3/CloudFront, etc.) will also work because the site is just `index.html`, `style.css`, and `app.js`.

## Notes
- The Web Speech API currently works best in Chromium-based browsers (Chrome, Edge). Safari desktop supports it with prefixes; Firefox does not yet support it.
- The parser expects you to separate each medication entry with a pause or the word "and", and to use commas within each entry to separate name, dosage, instructions, and optional notes.
