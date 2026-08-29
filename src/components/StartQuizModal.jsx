import styles from './Modal.module.css';

export default function StartQuizModal({ onStart, onCancel, questionCount, loading }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} animate-slide`}>
        <div className={styles.modalHeader}>
          <h2 className={`${styles.modalTitle} glitch`}>INITIALIZE QUIZ SESSION</h2>
          <div className={styles.headerLine}></div>
        </div>
        
        <div className={styles.modalBody}>
          <ul className={styles.infoList}>
            <li>
              <span className="hud-label">DURATION</span>
              <span className="hud-value">30:00</span>
            </li>
            <li>
              <span className="hud-label">QUESTIONS</span>
              <span className="hud-value">{questionCount}</span>
            </li>
          </ul>
          
          <div className={styles.warningBox}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span className={styles.warningText}>• TIMER CANNOT BE PAUSED</span>
              <span className={styles.warningText}>• SWITCHING TABS TERMINATES SESSION</span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className={styles.loadingText}>INITIALIZING SYSTEM...</div>
        ) : (
          <div className={styles.modalActions}>
            <button className={styles.cancelBtn} onClick={onCancel}>ABORT</button>
            <button className={styles.primaryBtn} onClick={onStart}>INITIALIZE</button>
          </div>
        )}
      </div>
    </div>
  );
}
