import { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { login } from '../services/api';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { setTeam } = useQuiz();
  const [teamName, setTeamName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName || !password) {
      setError("Please enter both Team Identifier and Access Code.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await login(teamName, password);
      
      if (response.success) {
        // Securely store password in memory to authenticate future requests
        const secureTeamData = { ...response.team, password };
        setTeam(secureTeamData);
      } else {
        setError(response.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Unable to connect to the node. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.container} animate-fade`}>
      
      <div className={`${styles.headerTitle} brand`}>
        CYBER <span className="redX">X</span> HUNT
      </div>

      <div className={`${styles.loginCard} animate-slide`}>
        
        {/* Decorative corner elements */}
        <div className={styles.cornerTl}></div>
        <div className={styles.cornerTr}></div>
        <div className={styles.cornerBl}></div>
        <div className={styles.cornerBr}></div>

        <div className={styles.cardHeader}>
          <h1 className={`${styles.title} glitch`}>COMPETITION NODE</h1>
          <h2 className={styles.subtitle}>ACCESS PORTAL</h2>
        </div>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="teamName" className="hud-label">TEAM IDENTIFIER</label>
            <input 
              id="teamName"
              type="text" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              disabled={loading}
              autoComplete="off"
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password" className="hud-label">ACCESS CODE</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'INITIALIZING...' : 'INITIALIZE'}
          </button>
        </form>
      </div>


    </div>
  );
}
