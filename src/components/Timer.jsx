import { useEffect, useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import styles from './Timer.module.css';

export default function Timer() {
  const { remainingSeconds, startTime, quizStarted, submitted } = useQuiz();
  const [formattedTime, setFormattedTime] = useState('30:00.00');
  const [warningLevel, setWarningLevel] = useState('normal'); // normal, warning, danger
  const totalSeconds = 1800; // 30 minutes

  useEffect(() => {
    let animationFrameId;

    const updateTimer = () => {
      if (!startTime || !quizStarted || submitted) {
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        setFormattedTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.00`);
        return;
      }

      const startMs = new Date(startTime).getTime();
      const now = new Date().getTime();
      const elapsedMs = now - startMs;
      const totalDurationMs = totalSeconds * 1000;
      let remainingMs = totalDurationMs - elapsedMs;

      if (remainingMs <= 0) remainingMs = 0;

      const mins = Math.floor(remainingMs / 60000);
      const secs = Math.floor((remainingMs % 60000) / 1000);
      const millis = Math.floor((remainingMs % 1000) / 10); // 2 digits

      setFormattedTime(
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`
      );

      const rSecs = remainingMs / 1000;
      if (rSecs <= 60) {
        setWarningLevel('danger');
      } else if (rSecs <= 300) {
        setWarningLevel('warning');
      } else {
        setWarningLevel('normal');
      }

      if (remainingMs > 0 && !submitted) {
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    if (quizStarted && !submitted) {
      animationFrameId = requestAnimationFrame(updateTimer);
    } else {
      updateTimer();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [startTime, quizStarted, submitted, remainingSeconds]);

  const progressPercentage = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;

  return (
    <div className={`${styles.timerContainer} ${styles[warningLevel]}`}>
      <div className={styles.widgetText}>
        <div className={styles.timerLabel}>TIME REMAINING</div>
        <div className={styles.timerDigits}>{formattedTime}</div>
      </div>
      <svg viewBox="0 0 36 36" className={styles.circularSvg}>
        <path className={styles.circleBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        <path 
          className={styles.circleFillTime} 
          strokeDasharray={`${Math.max(0, 100 - progressPercentage)}, 100`} 
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
        />
      </svg>
    </div>
  );
}
