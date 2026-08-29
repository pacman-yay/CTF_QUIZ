import { useEffect, useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { getQuestions, startQuiz } from '../services/api';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import QuestionNavigator from '../components/QuestionNavigator';
import StartQuizModal from '../components/StartQuizModal';
import SubmitQuizModal from '../components/SubmitQuizModal';
import styles from './QuizPage.module.css';

export default function QuizPage() {
  const { 
    team, 
    questions, setQuestions,
    answers, selectAnswer,
    currentQuestionIndex, setCurrentQuestionIndex,
    quizStarted, setQuizStarted,
    startTime, setStartTime,
    isSubmitting, submitQuiz,
    submitted
  } = useQuiz();

  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [startingQuiz, setStartingQuiz] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (questions.length === 0 && team && !submitted) {
      loadQuestions();
    }
  }, [team, questions.length, submitted]);

  const loadQuestions = async () => {
    setLoadingQuestions(true);
    setError('');
    try {
      const res = await getQuestions(team.teamId);
      if (res.success) {
        const shuffled = [...res.questions];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setQuestions(shuffled);
      } else {
        setError(res.message || "Failed to load questions.");
      }
    } catch (err) {
      setError("Unable to connect to the node.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleStartQuiz = async () => {
    setStartingQuiz(true);
    setError('');
    try {
      const res = await startQuiz(team.teamId, team.password);
      if (res.success) {
        setStartTime(res.startTime);
        setQuizStarted(true);
      } else {
        setError(res.message || "Failed to initialize session.");
      }
    } catch (err) {
      setError("Unable to connect to the node.");
    } finally {
      setStartingQuiz(false);
    }
  };

  const handleManualSubmit = async () => {
    await submitQuiz('manual');
    setShowSubmitModal(false);
  };

  if (loadingQuestions) {
    return <div className={styles.centerContainer}><span className="hud-label">ESTABLISHING CONNECTION...</span></div>;
  }

  if (error) {
    return (
      <div className={styles.centerContainer}>
        <div className={styles.errorMessage}>[ERROR] {error}</div>
        <button onClick={loadQuestions} className={styles.primaryBtn}>RETRY CONNECTION</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div className={styles.centerContainer}><span className="hud-label">NO DATA FOUND</span></div>;
  }

  if (!quizStarted) {
    return (
      <StartQuizModal 
        questionCount={questions.length} 
        onStart={handleStartQuiz} 
        onCancel={() => window.location.reload()} 
        loading={startingQuiz}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / questions.length) * 100;

  return (
    <div className={`${styles.quizLayout} animate-fade`}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className="brand">CYBER <span className="redX">X</span> HUNT</div>
        </div>

        <div className={styles.headerCenter}>
          <div className={styles.teamInfo}>{team.teamName}</div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.sessionProgressWidget}>
            <div className={styles.widgetText}>
              <div className="hud-label">PROGRESS</div>
              <div className="hud-value">{answeredCount} / {questions.length}</div>
            </div>
            <svg viewBox="0 0 36 36" className={styles.circularSvg}>
              <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path 
                className={styles.circleFillProgress} 
                strokeDasharray={`${progressPercent}, 100`} 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
              />
            </svg>
          </div>
          
          <div className={styles.headerDivider}></div>
          
          <Timer />
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={`${styles.questionSection} animate-slide`}>
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedOption={answers[currentQuestion.questionId]}
            onSelectOption={selectAnswer}
            onNext={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1))}
            onPrev={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
            onReview={() => setShowSubmitModal(true)}
          />
        </div>
        
        <aside className={`${styles.sidebar} animate-slide`} style={{ animationDelay: '0.1s' }}>
          <QuestionNavigator
            questions={questions}
            answers={answers}
            currentIndex={currentQuestionIndex}
            onNavigate={setCurrentQuestionIndex}
          />
          
          <button 
            className={styles.submitBtn}
            onClick={() => setShowSubmitModal(true)}
          >
            TRANSMIT ANSWERS
          </button>
        </aside>
      </main>

      {/* Decorative Lines */}
      <div className={styles.decorativeLineTop}></div>
      <div className={styles.decorativeLineBottom}></div>

      {showSubmitModal && (
        <SubmitQuizModal
          totalCount={questions.length}
          answeredCount={answeredCount}
          onConfirm={handleManualSubmit}
          onCancel={() => setShowSubmitModal(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
