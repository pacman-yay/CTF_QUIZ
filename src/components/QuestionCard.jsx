import styles from './QuestionCard.module.css';

export default function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedOption, 
  onSelectOption,
  onNext,
  onPrev,
  onReview
}) {
  const options = [
    { id: 'A', text: question.optionA },
    { id: 'B', text: question.optionB },
    { id: 'C', text: question.optionC },
    { id: 'D', text: question.optionD },
  ];

  const formattedNum = questionNumber.toString().padStart(2, '0');
  const formattedTotal = totalQuestions.toString().padStart(2, '0');

  return (
    <div className={styles.cardContainer}>
      
      {/* Translucent background number */}
      <div className={styles.bgNumber}>{formattedNum}</div>

      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <div className="hud-label">CHALLENGE</div>
          <div className={`${styles.challengeNumber} glitch`}>{formattedNum} / {formattedTotal}</div>
        </div>
      </div>
      
      <div className={styles.questionText}>
        {question.question}
      </div>
      
      <div className={styles.optionsList}>
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          return (
            <button
              key={opt.id}
              className={`${styles.optionBtn} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelectOption(question.questionId, opt.id)}
            >
              <div className={styles.optionIndicator}>
                <span className={styles.optionLetter}>{opt.id}</span>
              </div>
              <div className={styles.optionText}>{opt.text}</div>
            </button>
          );
        })}
      </div>
      
      <div className={styles.actions}>
        <button 
          className={styles.navBtn} 
          onClick={onPrev}
          disabled={questionNumber === 1}
        >
          ← PREVIOUS QUESTION
        </button>
        <button 
          className={styles.navBtn} 
          onClick={questionNumber === totalQuestions ? onReview : onNext}
        >
          {questionNumber === totalQuestions ? 'REVIEW ANSWERS →' : 'NEXT QUESTION →'}
        </button>
      </div>
    </div>
  );
}
