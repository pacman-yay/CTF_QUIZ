import { useQuiz } from '../context/QuizContext';
import styles from './CompletionPage.module.css';

export default function CompletionPage() {
  const { team, logout } = useQuiz();

  return (
    <div className={`${styles.container} animate-fade`}>
      <div className={`${styles.headerTitle} glitch`}>
        ◈ QUIZ // ARENA
      </div>

      <div className={`${styles.card} animate-slide`}>
        {/* Decorative corner elements */}
        <div className={styles.cornerTl}></div>
        <div className={styles.cornerTr}></div>
        <div className={styles.cornerBl}></div>
        <div className={styles.cornerBr}></div>

        <div className={styles.successIcon}>✓</div>
        
        <h1 className={`${styles.title} glitch`}>SESSION COMPLETE</h1>
        
        <div className={styles.body}>
          <div className={styles.transmissionMsg}>ANSWERS TRANSMITTED SECURELY</div>
          
          <div className={styles.teamBadge}>
            <span className="hud-label">TEAM IDENTIFIER</span>
            <div className={styles.teamName}>{team?.teamName}</div>
          </div>
          
          <p className={styles.closingText}>SESSION HAS BEEN CLOSED. YOU MAY NOW DISCONNECT.</p>
        </div>

        <button 
          className={styles.doneBtn}
          onClick={logout}
        >
          EXIT & CLEAR SESSION
        </button>
      </div>
      

    </div>
  );
}
