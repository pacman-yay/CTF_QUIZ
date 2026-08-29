/**
 * QUIZ ARENA - Google Apps Script Backend
 * 
 * Deployment Instructions:
 * 1. Create a Google Sheet and copy its ID.
 * 2. Set up tabs: "Teams", "Questions", "AnswerKey", "Submissions".
 * 3. Deploy this script as a Web App (Execute as: Me, Who has access: Anyone).
 * 4. Copy the Web App URL to the Vite .env file.
 */

const CONFIG = {
  SPREADSHEET_ID: "YOUR_SPREADSHEET_ID_HERE", // REPLACE THIS
  TEAMS_SHEET: "Teams",
  QUESTIONS_SHEET: "Questions",
  ANSWER_KEY_SHEET: "AnswerKey",
  SUBMISSIONS_SHEET: "Submissions",
  QUIZ_DURATION_MINUTES: 30
};

function doGet(e) {
  return createJsonResponse({ success: true, message: "Quiz Arena API is running." });
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, message: "No data received." }, 400);
    }

    const request = JSON.parse(e.postData.contents);

    switch (request.action) {
      case "login":
        return handleLogin(request);
      case "getQuestions":
        return handleGetQuestions(request);
      case "startQuiz":
        return handleStartQuiz(request);
      case "submitQuiz":
        return handleSubmitQuiz(request);
      default:
        return createJsonResponse({ success: false, message: "Invalid action" }, 400);
    }
  } catch (error) {
    return createJsonResponse({ success: false, message: "Server error: " + error.message }, 500);
  }
}

function handleLogin(request) {
  const { teamName, password } = request;
  if (!teamName || !password) {
    return createJsonResponse({ success: false, message: "Team name and password are required." });
  }

  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.TEAMS_SHEET);
  const data = sheet.getDataRange().getValues();
  
  // Headers: teamId, teamName, password, active, quizStarted, submitted, startTime
  const headers = data[0];
  const teamNameIdx = headers.indexOf("teamName");
  const passwordIdx = headers.indexOf("password");
  const activeIdx = headers.indexOf("active");
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[teamNameIdx] === teamName) {
      if (row[passwordIdx] !== password) {
        return createJsonResponse({ success: false, message: "Invalid team name or password." });
      }
      if (row[activeIdx] !== true && String(row[activeIdx]).toUpperCase() !== "TRUE") {
        return createJsonResponse({ success: false, message: "Team account is not active." });
      }
      
      const teamInfo = {
        teamId: row[headers.indexOf("teamId")],
        teamName: row[teamNameIdx],
        quizStarted: row[headers.indexOf("quizStarted")] === true || String(row[headers.indexOf("quizStarted")]).toUpperCase() === "TRUE",
        submitted: row[headers.indexOf("submitted")] === true || String(row[headers.indexOf("submitted")]).toUpperCase() === "TRUE",
        startTime: row[headers.indexOf("startTime")] || null
      };

      return createJsonResponse({ success: true, team: teamInfo });
    }
  }

  return createJsonResponse({ success: false, message: "Invalid team name or password." });
}

function handleGetQuestions(request) {
  const { teamId } = request;
  if (!teamId) {
    return createJsonResponse({ success: false, message: "Team ID is required." });
  }

  // Validate team is allowed to get questions (must have started)
  // But actually they might need to fetch them right when starting.
  
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(CONFIG.QUESTIONS_SHEET);
  const data = sheet.getDataRange().getValues();
  
  const headers = data[0];
  const activeIdx = headers.indexOf("active");
  
  const questions = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row[activeIdx] === true || String(row[activeIdx]).toUpperCase() === "TRUE") {
      questions.push({
        questionId: row[headers.indexOf("questionId")],
        question: row[headers.indexOf("question")],
        optionA: row[headers.indexOf("optionA")],
        optionB: row[headers.indexOf("optionB")],
        optionC: row[headers.indexOf("optionC")],
        optionD: row[headers.indexOf("optionD")],
        category: row[headers.indexOf("category")]
      });
    }
  }
  
  return createJsonResponse({ success: true, questions });
}

function handleStartQuiz(request) {
  const { teamId } = request;
  if (!teamId) return createJsonResponse({ success: false, message: "Team ID is required." });

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const sheet = ss.getSheetByName(CONFIG.TEAMS_SHEET);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const teamIdIdx = headers.indexOf("teamId");
  const startedIdx = headers.indexOf("quizStarted");
  const startTimeIdx = headers.indexOf("startTime");
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][teamIdIdx] === teamId) {
      if (data[i][startedIdx] === true || String(data[i][startedIdx]).toUpperCase() === "TRUE") {
        // Already started, return existing start time
        return createJsonResponse({ 
          success: true, 
          message: "Quiz already started.",
          startTime: data[i][startTimeIdx] 
        });
      }
      
      const now = new Date().toISOString();
      // Update sheet (row i + 1, col startedIdx + 1)
      sheet.getRange(i + 1, startedIdx + 1).setValue(true);
      
      // Ensure startTime column exists
      if (startTimeIdx !== -1) {
        sheet.getRange(i + 1, startTimeIdx + 1).setValue(now);
      } else {
        // Fallback: append column if missing
        sheet.getRange(1, headers.length + 1).setValue("startTime");
        sheet.getRange(i + 1, headers.length + 1).setValue(now);
      }
      
      return createJsonResponse({ success: true, startTime: now });
    }
  }
  
  return createJsonResponse({ success: false, message: "Team not found." });
}

function handleSubmitQuiz(request) {
  const { teamId, teamName, answers, submissionType } = request;
  if (!teamId || !answers) {
    return createJsonResponse({ success: false, message: "Invalid submission data." });
  }

  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  const teamsSheet = ss.getSheetByName(CONFIG.TEAMS_SHEET);
  const teamsData = teamsSheet.getDataRange().getValues();
  const headers = teamsData[0];
  
  const teamIdIdx = headers.indexOf("teamId");
  const submittedIdx = headers.indexOf("submitted");
  const startTimeIdx = headers.indexOf("startTime");
  
  let teamRow = -1;
  let startTime = null;
  
  for (let i = 1; i < teamsData.length; i++) {
    if (teamsData[i][teamIdIdx] === teamId) {
      if (teamsData[i][submittedIdx] === true || String(teamsData[i][submittedIdx]).toUpperCase() === "TRUE") {
        return createJsonResponse({ success: false, message: "Quiz already submitted." });
      }
      teamRow = i + 1;
      startTime = teamsData[i][startTimeIdx];
      break;
    }
  }
  
  if (teamRow === -1) {
    return createJsonResponse({ success: false, message: "Team not found." });
  }
  
  const now = new Date();
  
  // Validate time (optional strict validation)
  if (startTime) {
    const startMs = new Date(startTime).getTime();
    const elapsedMs = now.getTime() - startMs;
    const allowedMs = (CONFIG.QUIZ_DURATION_MINUTES * 60 * 1000) + (2 * 60 * 1000); // 2 mins grace period
    if (elapsedMs > allowedMs) {
      // Could log as late submission, but still accept for now
    }
  }
  
  const submitTimeStr = now.toISOString();

  // Mark as submitted in Teams sheet
  teamsSheet.getRange(teamRow, submittedIdx + 1).setValue(true);
  
  // Record submission in Submissions sheet
  const subsSheet = ss.getSheetByName(CONFIG.SUBMISSIONS_SHEET);
  
  // If we save answers as one JSON blob per team
  // Alternatively, save one row per question as per instructions.
  // We'll save one row per question for easier auditing.
  const rowsToInsert = [];
  const submissionId = "SUB_" + Date.now() + "_" + teamId;
  
  for (const [questionId, selectedOption] of Object.entries(answers)) {
    rowsToInsert.push([
      submissionId,
      teamId,
      teamName,
      startTime,
      submitTimeStr,
      questionId,
      selectedOption,
      submissionType || "manual"
    ]);
  }
  
  if (rowsToInsert.length > 0) {
    subsSheet.getRange(subsSheet.getLastRow() + 1, 1, rowsToInsert.length, rowsToInsert[0].length).setValues(rowsToInsert);
  } else {
    // Empty submission
    subsSheet.appendRow([submissionId, teamId, teamName, startTime, submitTimeStr, "NONE", "NONE", submissionType]);
  }

  return createJsonResponse({ success: true, message: "Submission successful." });
}

function createJsonResponse(data, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
