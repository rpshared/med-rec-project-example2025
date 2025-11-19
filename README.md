# Voice-driven Medication List

This project is a minimal deployable web application that lets you speak medication instructions and instantly see a structured list containing the medication name, dosage, instructions, and notes.

## Features
- Click-to-talk interface powered by the browser's built-in Web Speech API.
- Live transcript of what the browser heard.
- Simple heuristic parser that turns spoken comma-separated phrases into medication entries.
- Lightweight Node.js server that can be deployed to any platform supporting `node`.

## Getting started
1. **Install dependencies** – there are none beyond Node.js itself.
2. **Run the server**
   ```bash
   npm start
   ```
3. Open your browser to `http://localhost:3000` and click the **🎙️ Click to talk** button.
4. Grant microphone permission when prompted and speak your medication list, for example:
   > "Metformin, 500 milligrams, two tablets by mouth twice a day. Lisinopril, 10 milligrams, once by mouth each day."

## Deployment
Because the application is a simple Node.js static server, you can deploy it on platforms such as Render, Railway, Heroku, Fly.io, or any container-based service. Make sure the platform sets the `PORT` environment variable – the server automatically respects it.

## Notes
- The Web Speech API currently works best in Chromium-based browsers (Chrome, Edge). Safari desktop supports it with prefixes; Firefox does not yet support it.
- The parser expects you to separate each medication entry with a pause or the word "and", and to use commas within each entry to separate name, dosage, instructions, and optional notes.
