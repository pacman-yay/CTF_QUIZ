import styles from './Modal.module.css';

export default function SubmitQuizModal({ onConfirm, onCancel, answeredCount, totalCount, isSubmitting }) {
  const unansweredCount = totalCount - answeredCount;
  const isComplete = unansweredCount === 0;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} animate-slide`}>
        <div className={styles.modalHeader}>
          <h2 className={`${styles.modalTitle} glitch`}>TRANSMIT FINAL ANSWERS?</h2>
          <div className={styles.headerLine}></div>
        </div>
        
        <div className={styles.modalBody}>
          <ul className={styles.infoList}>
            <li>
              <span className="hud-label">QUESTIONS</span>
              <span className="hud-value">{totalCount}</span>
            </li>
            <li>
              <span className="hud-label">ANSWERED</span>
              <span className="hud-value">{answeredCount}</span>
            </li>
            <li>
              <span className="hud-label" style={{ color: unansweredCount > 0 ? 'var(--warning)' : 'var(--text-secondary)' }}>
                UNANSWERED
              </span>
              <span className="hud-value" style={{ color: unansweredCount > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>
                {unansweredCount.toString().padStart(2, '0')}
              </span>
            </li>
          </ul>
          
          <div className={styles.warningBox}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span className={styles.warningText}>• ONCE TRANSMITTED, ANSWERS CANNOT BE CHANGED</span>
            </div>
          </div>
        </div>
        
        {isSubmitting ? (
          <div className={styles.loadingText}>TRANSMITTING DATA...</div>
        ) : (
          <div className={styles.modalActions}>
            <button className={styles.cancelBtn} onClick={onCancel}>RETURN TO QUIZ</button>
            <button className={styles.primaryBtn} onClick={onConfirm}>TRANSMIT</button>
          </div>
        )}
      </div>
    </div>
  );
}
