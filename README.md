# Quiz Arena

A production-ready full-stack quiz website built with **React** (Vite) and **Google Apps Script + Google Sheets** as the backend/database.

## Features

- **Dark, Professional UI:** Modern, minimal, and focused quiz interface.
- **Server-Authoritative Timer:** Timer is started and checked against the Google Apps Script backend to prevent client-side time manipulation.
- **Auto-Submission:** Automatically submits answers when the 30-minute timer expires.
- **Session Recovery:** Users can accidentally refresh without losing their session state.
- **No Database Setup Needed:** Uses Google Sheets for easy administration and data viewing.

## Architecture

- **Frontend:** React, Vite, CSS Modules, Context API for state management.
- **Backend:** Google Apps Script (`Code.gs`) handling POST requests.
- **Database:** Google Sheets (`Teams`, `Questions`, `AnswerKey`, `Submissions`).

---

## 1. Google Sheets Setup

1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it "Quiz Arena Database".
3. Copy the **Spreadsheet ID** from the URL (the long string between `/d/` and `/edit`).
4. Create the following four tabs (worksheets) exactly as named below:

### Tab 1: `Teams`
| teamId | teamName   | password    | active | quizStarted | submitted | startTime |
|--------|------------|-------------|--------|-------------|-----------|-----------|
| T001   | Team Alpha | password123 | TRUE   | FALSE       | FALSE     |           |
| T002   | Team Beta  | password456 | TRUE   | FALSE       | FALSE     |           |

### Tab 2: `Questions`
| questionId | question                          | optionA | optionB | optionC | optionD | category | active |
|------------|-----------------------------------|---------|---------|---------|---------|----------|--------|
| Q001       | What is the capital of France?    | Berlin  | Paris   | Madrid  | Rome    | General  | TRUE   |
| Q002       | What is 2 + 2?                    | 3       | 4       | 5       | 6       | Math     | TRUE   |
| Q003       | Which planet is the Red Planet?   | Venus   | Mars    | Jupiter | Saturn  | Science  | TRUE   |
| Q004       | Who wrote Hamlet?                 | Dickens | Austen  | Tolstoy | Shakespeare| Literature | TRUE   |
| Q005       | What is the boiling point of H2O? | 90°C    | 100°C   | 110°C   | 120°C   | Science  | TRUE   |

### Tab 3: `AnswerKey`
| questionId | correctOption |
|------------|---------------|
| Q001       | B             |
| Q002       | B             |
| Q003       | B             |
| Q004       | D             |
| Q005       | B             |

*(Note: The `AnswerKey` is intentionally never sent to the frontend for security).*

### Tab 4: `Submissions`
| submissionId | teamId | teamName | startTime | submitTime | questionId | selectedOption | submissionType |
|--------------|--------|----------|-----------|------------|------------|----------------|----------------|

Leave the data rows empty for the `Submissions` sheet. It will be populated automatically.

---

## 2. Google Apps Script Setup

1. In your Google Sheet, click on **Extensions > Apps Script**.
2. Delete any code in the default `Code.gs` file.
3. Copy the entire contents of the `apps-script/Code.gs` file from this project and paste it into the editor.
4. Near the top of the script, find:
   ```javascript
   SPREADSHEET_ID: "YOUR_SPREADSHEET_ID_HERE",
   ```
   Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Google Sheet ID.
5. Click the **Save** icon.

### Deploy the Apps Script

1. Click **Deploy > New deployment** in the top right.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description:** `Quiz API v1`
   - **Execute as:** `Me` (Your email)
   - **Who has access:** `Anyone` (Important: This allows the React app to communicate with it without users needing to log into Google).
4. Click **Deploy**.
5. You may be prompted to authorize access. Click "Authorize access", choose your Google account, click "Advanced", and then "Go to project (unsafe)" to grant permissions.
6. Once deployed, copy the **Web app URL**.

---

## 3. Local Development Setup

1. Open this repository in your terminal.
2. Copy the `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open the `.env` file and replace the placeholder URL with the Web app URL you copied in the previous step:
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 4. Production Deployment

To deploy the React application for production (e.g., to Vercel, Netlify, or GitHub Pages):

1. Ensure your `.env` variables are set in your hosting provider's dashboard.
2. Build the project:
   ```bash
   npm run build
   ```
3. The built files will be in the `dist` directory, ready to be served by any static file host.

## Known Limitations

- **Concurrent Logins:** Currently, if multiple team members log in simultaneously, they share the same backend submission state, but their local unsaved answers are isolated to their own browsers.
- **Admin Dashboard:** There is no frontend admin UI; all administration is done directly via Google Sheets.

## Future Enhancements

- Add question randomization.
- Add real-time synchronization of answers between teammates using Firebase or WebSockets.
- Implement a scoreboard viewer for the completion page (after grades are calculated).
