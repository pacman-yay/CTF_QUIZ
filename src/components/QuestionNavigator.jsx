import styles from './QuestionNavigator.module.css';

export default function QuestionNavigator({ questions, answers, currentIndex, onNavigate }) {
  return (
    <div className={styles.navigatorContainer}>
      <div className={styles.navHeader}>
        <div className="hud-label">QUESTION MATRIX</div>
      </div>
      
      <div className={styles.grid}>
        {questions.map((q, index) => {
          const isAnswered = !!answers[q.questionId];
          const isCurrent = index === currentIndex;
          
          let btnClass = styles.navBtn;
          if (isCurrent) btnClass += ` ${styles.current}`;
          else if (isAnswered) btnClass += ` ${styles.answered}`;

          return (
            <button
              key={q.questionId}
              className={btnClass}
              onClick={() => onNavigate(index)}
            >
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </button>
          );
        })}
      </div>
      
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendBox} ${styles.legendCurrent}`}></span> ACTIVE
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendBox} ${styles.legendAnswered}`}></span> COMPLETE
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendBox}`}></span> PENDING
        </div>
      </div>
    </div>
  );
}
