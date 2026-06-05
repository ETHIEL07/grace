import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react'
import { signIn, signUp, signInWithGoogle, supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

function requestGeolocation(setLocLabel) {
  if (!navigator.geolocation) return
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords
      sessionStorage.setItem('bagstyle_loc', JSON.stringify({ lat, lng }))
      setLocLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      toast.success('Localisation enregistrée ✅', { duration: 2000 })
    },
    () => { toast('Localisation non disponible', { icon: '📍' }) },
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

export default function Auth() {
  const [mode, setMode]         = useState('login')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [locLabel, setLocLabel] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', whatsapp: '' })
  const navigate = useNavigate()
  const setUser  = useAuthStore(s => s.setUser)

  // Si déjà connecté → aller à l'accueil directement
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) navigate('/accueil', { replace: true })
    }
    checkSession()
  }, [navigate])

  const setField = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  useEffect(() => {
    if (mode === 'register') requestGeolocation(setLocLabel)
  }, [mode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'login') {
        const { data, error } = await signIn(form.email, form.password)
        if (error) throw error
        setUser(data.user)
        requestGeolocation(() => {})
        toast.success('Bienvenue ! 👋')
        navigate('/accueil')
      } else {
        const { data, error } = await signUp(form.email, form.password, {
          full_name: form.name,
          whatsapp:  form.whatsapp || null,
        })
        if (error) throw error
        toast.success('Compte créé ! Vérifiez votre email.')
        setMode('login')
      }
    } catch (err) {
      toast.error(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) throw error
      // La redirection vers /auth/callback est gérée par Supabase OAuth
    } catch (err) {
      toast.error(err.message || 'Erreur Google')
      setGoogleLoading(false)
    }
  }

  return (
    <main className="page-layout">
      <div className={styles.wrapper}>
        <div className={styles.card}>

          <Link to="/accueil" className={styles.logo}>
            Bag<span>Style</span>
          </Link>

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${mode === 'login'    ? styles.activeTab : ''}`} onClick={() => setMode('login')}>Connexion</button>
            <button className={`${styles.tab} ${mode === 'register' ? styles.activeTab : ''}`} onClick={() => setMode('register')}>Inscription</button>
          </div>

          {/* Bouton Google */}
          <button
            type="button"
            className={styles.googleBtn}
            onClick={handleGoogle}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <span className={styles.spinner} />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continuer avec Google
          </button>

          <div className={styles.divider}><span>ou</span></div>

          <form onSubmit={handleSubmit} className={styles.form}>

            {mode === 'register' && (
              <div className={styles.field}>
                <label>Prénom / Nom</label>
                <div className={styles.inputWrap}>
                  <User size={16} className={styles.inputIcon} />
                  <input type="text" placeholder="Marie Dupont" value={form.name} onChange={setField('name')} required style={{ paddingLeft: '38px' }} />
                </div>
              </div>
            )}

            <div className={styles.field}>
              <label>Email</label>
              <div className={styles.inputWrap}>
                <Mail size={16} className={styles.inputIcon} />
                <input type="email" placeholder="vous@exemple.com" value={form.email} onChange={setField('email')} required style={{ paddingLeft: '38px' }} />
              </div>
            </div>

            <div className={styles.field}>
              <label>
                Mot de passe
                {mode === 'login' && <Link to="/mot-de-passe-oublie" className={styles.forgot}>Mot de passe oublié ?</Link>}
              </label>
              <div className={styles.inputWrap}>
                <Lock size={16} className={styles.inputIcon} />
                <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={setField('password')} required minLength={6} style={{ paddingLeft: '38px', paddingRight: '38px' }} />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className={styles.field}>
                <label>Numéro WhatsApp <span style={{ fontWeight: 400, color: '#aaa', fontSize: 12 }}>(facultatif)</span></label>
                <div className={styles.inputWrap}>
                  <Phone size={16} className={styles.inputIcon} />
                  <input type="tel" placeholder="+225 07 XX XX XX XX" value={form.whatsapp} onChange={setField('whatsapp')} style={{ paddingLeft: '38px' }} />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div className={styles.field}>
                <label>Votre localisation <span style={{ fontWeight: 400, color: '#aaa', fontSize: 12 }}>(pour la livraison)</span></label>
                <div className={styles.inputWrap} style={{ cursor: 'pointer' }} onClick={() => requestGeolocation(setLocLabel)}>
                  <MapPin size={16} className={styles.inputIcon} />
                  <input type="text" placeholder="Cliquez pour détecter automatiquement" value={locLabel} readOnly style={{ paddingLeft: '38px', cursor: 'pointer', background: locLabel ? '#f0fdf4' : undefined }} />
                </div>
                {locLabel && <p style={{ fontSize: 11, color: '#22c55e', marginTop: 4 }}>✅ Localisation enregistrée — sera jointe à vos commandes</p>}
              </div>
            )}

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? '...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <p className={styles.switchMode}>
            {mode === 'login' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
              {mode === 'login' ? 'Inscription' : 'Connexion'}
            </button>
          </p>
        </div>
      </div>
    </main>
  )
}