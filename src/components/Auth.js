import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Auth.css';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        // Connexion
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
      } else {
        // Inscription
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
      }
    } catch (error) {
      setError(error.message);
      console.error('Erreur d\'authentification:', error);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleAuth} className="auth-form">
        <h2>{isLogin ? 'Connexion' : 'Inscription'}</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-btn">
          {isLogin ? 'Se connecter' : 'S\'inscrire'}
        </button>
        <p 
          onClick={() => setIsLogin(!isLogin)} 
          className="toggle-auth"
        >
          {isLogin 
            ? 'Pas de compte ? Inscrivez-vous' 
            : 'Déjà un compte ? Connectez-vous'}
        </p>
      </form>
    </div>
  );
}

export default Auth; 