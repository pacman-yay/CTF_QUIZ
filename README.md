# CYBER X HUNT: CTF Quiz Arena

A highly secure, production-ready full-stack Capture The Flag (CTF) quiz platform built with **React** (Vite) and **Google Apps Script + Google Sheets** as a serverless database.

##  Features & Enhancements

### User Interface (Cyber Theme)
- **Deep Cyber Aesthetic:** Sharp 90-degree corners, monospace fonts (`IBM Plex Mono`), and deep blue overlays (`var(--bg-layer-1)`).
- **Retro Terminal Effects:** Includes CRT scanline overlays, chromatic text glitching, and hover flicker animations.
- **Responsive Matrix Grid:** Questions are laid out in a terminal-style matrix that gracefully wraps on smaller screens to eliminate horizontal scrolling.

### Data & Logic
- **50 Built-In CTF Questions:** Ready-to-go cybersecurity questions ranging from Easy to Hard.
- **Dynamic Scrambling:** Uses a Fisher-Yates shuffle algorithm on the client to completely randomize question order for every new session, preventing screen-peeking.
- **Session Persistence:** If a user accidentally refreshes, their answers and remaining time are preserved via `localStorage`.

### Iron-Clad Security (Anti-Cheating)
- **Zero-Knowledge Frontend:** The correct answers are *never* transmitted to the browser.
- **Anti-Spoofing Architecture:** The frontend must securely pass the team's password alongside every API request (`startQuiz`, `submitQuiz`). The backend verifies this password before allowing any database writes.
- **Anti-Time Freeze Validation:** While the browser displays a 30-minute countdown timer, the backend records the exact unalterable `Start Time`. If a team tampers with their system clock and takes more than 31 minutes to submit, the backend instantly flags their submission.
- **Strict Boundary Enforcement (Tab Locking):**
  - **Tab Switching:** If a participant minimizes the window or switches tabs to Google an answer, the app detects `document.hidden = true` and instantly lock downs the quiz, finalizing their current score.
  - **Tab Closing:** If they attempt to close the tab, the app triggers a native browser warning. If forced closed, it utilizes `navigator.sendBeacon()` to silently transmit their final answers during the termination sequence.

---

## Architecture Setup

### 1. The Database (Google Sheets)
1. Create a new Google Sheet and ensure the bottom tab is named `Sheet1`.
2. Add the following headers exactly into Row 1 (A1 - H1):
   `Team ID` | `Team Name` | `Access Code` | `Quiz Started` | `Start Time` | `Submitted` | `Final Score` | `Submitted Answers`
3. Add your team credentials into the first three columns starting on Row 2. Leave the remaining columns blank!

### 2. The Backend (Google Apps Script)
1. In your Google Sheet, click on **Extensions > Apps Script**.
2. Paste the provided `Code.gs` into the editor.
3. Replace the `SPREADSHEET_ID` variable at the top with your actual Google Sheet ID.
4. Copy the array of 50 questions from `src/services/api.js` and paste them into the `QUESTIONS_DB` array.
5. Click **Deploy > New deployment**. Select **Web app**, set Execute as to **Me**, and Who has access to **Anyone**.
6. Copy the **Web app URL**. *(Note: Whenever you change the code, you must deploy a "New Version".)*

### 3. The Frontend (React)
1. Clone the repository and run `npm install`.
2. Create a `.env` file in the root folder and add your Web App URL:
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
3. Start the dev server with `npm run dev`.

---

## 📦 Production Deployment
Push this repository to GitHub and connect it to a free host like **Vercel** or **Netlify**. Ensure you add the `VITE_APPS_SCRIPT_URL` variable to your host's environment settings before deploying!
