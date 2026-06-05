import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';

export default function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useAuthStore(s => s.setUser);

  useEffect(() => {
    const handle = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erreur session:', error);
          navigate('/connexion', { replace: true });
          return;
        }

        if (data?.session) {
          setUser(data.session.user);
          navigate('/accueil', { replace: true });
        } else {
          // Session pas encore dispo, on écoute onAuthStateChange
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
              setUser(session.user);
              subscription.unsubscribe();
              navigate('/accueil', { replace: true });
            } else if (event === 'SIGNED_OUT') {
              subscription.unsubscribe();
              navigate('/connexion', { replace: true });
            }
          });

          // Timeout de sécurité 5s
          setTimeout(() => {
            subscription.unsubscribe();
            navigate('/connexion', { replace: true });
          }, 5000);
        }
      } catch (err) {
        console.error('Erreur AuthCallback:', err);
        navigate('/connexion', { replace: true });
      }
    };

    handle();
  }, [navigate, setUser]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
      backgroundColor: '#f8f9fa',
      color: '#333',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '3px solid #d4537e',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: 16, color: '#666' }}>Connexion en cours...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}