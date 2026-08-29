import { createContext, useState, useEffect, useContext } from 'react';
import { submitQuiz as apiSubmitQuiz } from '../services/api';

const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem('quiz_team');
    return saved ? JSON.parse(saved) : null;
  });

  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('quiz_questions');
    return saved ? JSON.parse(saved) : [];
  });

  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('quiz_answers');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [quizStarted, setQuizStarted] = useState(() => {
    return localStorage.getItem('quiz_started') === 'true';
  });

  const [startTime, setStartTime] = useState(() => {
    return localStorage.getItem('quiz_startTime') || null;
  });

  const [remainingSeconds, setRemainingSeconds] = useState(1800);
  
  const [submitted, setSubmitted] = useState(() => {
    return localStorage.getItem('quiz_submitted') === 'true';
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist state
  useEffect(() => {
    if (team) localStorage.setItem('quiz_team', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    if (questions.length > 0) localStorage.setItem('quiz_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('quiz_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('quiz_started', quizStarted.toString());
  }, [quizStarted]);

  useEffect(() => {
    if (startTime) localStorage.setItem('quiz_startTime', startTime);
  }, [startTime]);

  useEffect(() => {
    localStorage.setItem('quiz_submitted', submitted.toString());
  }, [submitted]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (quizStarted && startTime && !submitted) {
      interval = setInterval(() => {
        const start = new Date(startTime).getTime();
        const now = new Date().getTime();
        const elapsed = Math.floor((now - start) / 1000);
        const duration = 1800; // 30 minutes
        const remaining = duration - elapsed;

        if (remaining <= 0) {
          setRemainingSeconds(0);
          clearInterval(interval);
          handleAutoSubmit();
        } else {
          setRemainingSeconds(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, startTime, submitted]);

  // Strict Boundaries: Tab Switching & Closing
  useEffect(() => {
    // 1. Handle Tab Switching
    const handleVisibilityChange = () => {
      if (document.hidden && quizStarted && !submitted && !isSubmitting) {
        // They switched tabs or minimized the browser! Instant lockdown.
        submitQuiz('violation-tab-switch');
      }
    };

    // 2. Handle Tab Closing / Reloading
    const handleBeforeUnload = (e) => {
      if (quizStarted && !submitted) {
        // Native browser warning popup
        const warning = "WARNING: If you leave or reload this page, your current progress will be finalized and submitted permanently.";
        e.preventDefault();
        e.returnValue = warning;
        return warning;
      }
    };

    // 3. Handle actual unloading (try to fire a final submit)
    const handleUnload = () => {
      if (quizStarted && !submitted && team) {
        // navigator.sendBeacon is the only reliable way to send an API request while the tab is closing
        const url = import.meta.env.VITE_APPS_SCRIPT_URL;
        if (url) {
          const payload = JSON.stringify({
            action: 'submitQuiz',
            teamId: team.teamId,
            password: team.password,
            answers: answers,
            submissionType: 'violation-tab-closed'
          });
          navigator.sendBeacon(url, payload);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleUnload);
    };
  }, [quizStarted, submitted, isSubmitting, team, answers]);

  const selectAnswer = (questionId, optionId) => {
    if (submitted) return;
    setAnswers(prev => {
      if (prev[questionId] === optionId) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      }
      return {
        ...prev,
        [questionId]: optionId
      };
    });
  };

  const submitQuiz = async (type = 'manual') => {
    if (submitted || isSubmitting) return;
    
    setIsSubmitting(true);
    const payload = {
      teamId: team.teamId,
      teamName: team.teamName,
      password: team.password,
      answers,
      submissionType: type
    };

    const response = await apiSubmitQuiz(payload);
    
    if (response.success) {
      setSubmitted(true);
      
      // Update team state to reflect submitted status
      setTeam(prev => ({ ...prev, submitted: true }));
    }
    setIsSubmitting(false);
    return response;
  };

  const handleAutoSubmit = async () => {
    await submitQuiz('auto');
  };

  const logout = () => {
    localStorage.clear();
    setTeam(null);
    setQuestions([]);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizStarted(false);
    setStartTime(null);
    setRemainingSeconds(1800);
    setSubmitted(false);
  };

  return (
    <QuizContext.Provider value={{
      team, setTeam,
      questions, setQuestions,
      answers, selectAnswer,
      currentQuestionIndex, setCurrentQuestionIndex,
      quizStarted, setQuizStarted,
      startTime, setStartTime,
      remainingSeconds,
      submitted, setSubmitted,
      isSubmitting, submitQuiz,
      logout
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => useContext(QuizContext);
