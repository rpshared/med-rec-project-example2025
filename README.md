# Voice-driven Medication List

This project is a minimal static web application that lets you speak medication instructions and instantly see a structured list containing the medication name, dosage, instructions, and notes. It is designed so it can be dropped directly into GitHub Pages or any other static host—no custom server is required.

## Features
- Click-to-talk interface powered by the browser's built-in Web Speech API.
- Live transcript of what the browser heard.
- Simple heuristic parser that turns spoken comma-separated phrases into medication entries.
- 100% static assets so it runs anywhere (including GitHub Pages) without a backend.

## Getting started locally
1. Clone or download the repository.
2. Open `index.html` in any modern Chromium-based browser (double-clicking the file works), or serve the folder with any static file server such as:
   ```bash
   npx serve .
   ```
3. Click the **🎙️ Click to talk** button, allow microphone access, and speak your medication list, for example:
   > "Metformin, 500 milligrams, two tablets by mouth twice a day. Lisinopril, 10 milligrams, once by mouth each day."

## Quick test run
If you just want to verify the build works end-to-end:

1. Ensure you are using a Chromium-based browser (Chrome/Edge) with microphone access allowed.
2. From the project root, serve the directory with any static file server so the browser can access microphone APIs, e.g.:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
3. Visit the reported localhost URL (typically `http://localhost:3000` or `http://localhost:8000`), click **🎙️ Click to talk**,
   and read a medication list aloud. Each comma-separated entry will appear under **Medication list** as name, dosage, instructions,
   and optional notes.

## Deploying to GitHub Pages
1. Commit the repository to GitHub.
2. In the repository settings, enable **Pages** and choose the `main` branch (root) as the source.
3. After GitHub finishes building, visit `https://<your-username>.github.io/<repo-name>/` to use the voice-driven medication list.

Any other static hosting solution (Netlify Drop, Cloudflare Pages, S3/CloudFront, etc.) will also work because the site is just `index.html`, `style.css`, and `app.js`.

## Notes
- The Web Speech API currently works best in Chromium-based browsers (Chrome, Edge). Safari desktop supports it with prefixes; Firefox does not yet support it.
- The parser expects you to separate each medication entry with a pause or the word "and", and to use commas within each entry to separate name, dosage, instructions, and optional notes.
