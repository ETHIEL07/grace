import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Camera, LogOut, Crown, Shield, Key } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { signOut, supabase } from '@/lib/supabase'
import { isAdmin } from '@/lib/admin'
import toast from 'react-hot-toast'
import styles from './compte.module.css'

export default function Compte() {
  const { user, profile, clear } = useAuthStore()
  const navigate = useNavigate()
  const [avatarUrl, setAvatarUrl]             = useState(profile?.avatar_url || user?.user_metadata?.avatar_url || null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [name, setName]                       = useState(profile?.full_name || user?.user_metadata?.full_name || '')
  const [editName, setEditName]               = useState(false)
  const fileInputRef = useRef(null)

  const admin = isAdmin(user)

  const handleLogout = async () => {
    await signOut()
    clear()
    toast.success('À bientôt ! 👋')
    navigate('/')
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return toast.error('Image trop lourde (max 2 Mo)')
    setUploadingAvatar(true)
    try {
      const ext  = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      setAvatarUrl(data.publicUrl)
      await supabase.auth.updateUser({ data: { avatar_url: data.publicUrl } })
      toast.success('Photo mise à jour ✅')
    } catch {
      toast.error("Erreur lors de l'upload")
    } finally {
      setUploadingAvatar(false)
    }
  }

  const saveName = async () => {
    await supabase.auth.updateUser({ data: { full_name: name } })
    await supabase.from('profiles').update({ full_name: name }).eq('id', user.id)
    setEditName(false)
    toast.success('Nom mis à jour ✅')
  }

  if (!user) return null

  return (
    <main className="page-layout">
      <div className="container" style={{ padding: '24px 20px', maxWidth: 480 }}>

        <h1 className={styles.pageTitle}>Mon compte</h1>

        {admin && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, #fff8e1, #fff3cd)',
            border: '1px solid #f0c040', borderRadius: 14,
            padding: '12px 16px', marginBottom: 20
          }}>
            <Crown size={20} color="#b8860b" />
            <div>
              <div style={{ fontWeight: 700, color: '#b8860b', fontSize: 14 }}>Administrateur BagStyle</div>
              <div style={{ fontSize: 12, color: '#888' }}>Accès complet à la gestion de la boutique</div>
            </div>
          </div>
        )}

        <div className={styles.profileCard}>
          <div className={styles.avatarWrap} onClick={() => fileInputRef.current?.click()}>
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className={styles.avatarImg} />
              : <div className={styles.avatar}>{name ? name[0].toUpperCase() : <User size={28} />}</div>
            }
            <div className={styles.avatarOverlay}>
              {uploadingAvatar ? <span className={styles.spinnerSm} /> : <Camera size={16} />}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>

          <div className={styles.profileInfo}>
            {editName ? (
              <div className={styles.editRow}>
                <input className={styles.nameInput} value={name} onChange={e => setName(e.target.value)} autoFocus />
                <button className={styles.iconAction} onClick={saveName}>✓</button>
                <button className={styles.iconAction} onClick={() => setEditName(false)}>✕</button>
              </div>
            ) : (
              <div className={styles.editRow}>
                <span className={styles.profileName}>{name || 'Administrateur'}</span>
                <button className={styles.iconAction} onClick={() => setEditName(true)} style={{ fontSize: 12 }}>✏️</button>
              </div>
            )}
            <span className={styles.profileEmail}>{user.email}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Informations du compte</h3>

          <div className={styles.infoRow}>
            <Mail size={15} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>Email de connexion</div>
              <div className={styles.infoValue}>{user.email}</div>
            </div>
          </div>

          <div className={styles.infoRow}>
            <Shield size={15} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>Rôle</div>
              <div className={styles.infoValue} style={{ color: admin ? '#b8860b' : '#555', fontWeight: 600 }}>
                {admin ? '👑 Administrateur' : 'Utilisateur'}
              </div>
            </div>
          </div>

          <div className={styles.infoRow}>
            <Key size={15} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>Membre depuis</div>
              <div className={styles.infoValue}>
                {new Date(user.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Sécurité</h3>
          <button
            className="btn btn-outline"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={async () => {
              const { error } = await supabase.auth.resetPasswordForEmail(user.email)
              if (error) toast.error('Erreur')
              else toast.success('Email de réinitialisation envoyé ✅')
            }}
          >
            Changer le mot de passe
          </button>
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span className={styles.logoutIcon}><LogOut size={17} /></span>
          <span>Se déconnecter</span>
        </button>

      </div>
    </main>
  )
}