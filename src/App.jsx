import { useQuiz } from './context/QuizContext';
import LoginPage from './pages/LoginPage';
import QuizPage from './pages/QuizPage';
import CompletionPage from './pages/CompletionPage';

function AppContent() {
  const { team, submitted } = useQuiz();

  if (!team) {
    return <LoginPage />;
  }

  return (
    <>
      <QuizPage />
      {(submitted || team.submitted) && <CompletionPage />}
    </>
  );
}

export default function App() {
  return (
    <>
      <div className="scanlines"></div>
      <AppContent />
    </>
  );
}
