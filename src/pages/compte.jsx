import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, MapPin, ShoppingBag, Heart, LogOut, Edit2, Check, Camera, Package, ChevronDown, ChevronUp, Clock, Crown, BarChart2 } from 'lucide-react'
import { useAuthStore } from '@/lib/store'
import { signOut, supabase } from '@/lib/supabase'
import { useCartStore, useFavStore, selectCount } from '@/lib/store'
import { formatCFA } from '@/lib/mockData'
import { isAdmin } from '@/lib/admin'
import toast from 'react-hot-toast'
import styles from './compte.module.css'

function requestGeolocation(setLocLabel) {
  if (!navigator.geolocation) return toast('Géolocalisation non supportée', { icon: '📍' })
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude: lat, longitude: lng } = pos.coords
      sessionStorage.setItem('bagstyle_loc', JSON.stringify({ lat, lng }))
      setLocLabel(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
      toast.success('Localisation mise à jour ✅')
    },
    () => toast('Localisation non disponible', { icon: '📍' }),
    { enableHighAccuracy: true, timeout: 8000 }
  )
}

const STATUS_LABEL = {
  pending:    { label: 'En attente',  color: '#f59e0b', bg: '#fffbeb' },
  confirmed:  { label: 'Confirmée',   color: '#3b82f6', bg: '#eff6ff' },
  delivered:  { label: 'Livrée',      color: '#22c55e', bg: '#f0fdf4' },
  cancelled:  { label: 'Annulée',     color: '#ef4444', bg: '#fef2f2' },
}

function OrdersSection({ userId }) {
  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [expanded, setExpanded]   = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (!error && data) setOrders(data)
      setLoading(false)
    }
    fetchOrders()
  }, [userId])

  if (loading) return (
    <div className={styles.ordersLoading}>
      <span className={styles.spinnerSm} /> Chargement des commandes...
    </div>
  )

  if (orders.length === 0) return (
    <div className={styles.ordersEmpty}>
      <Package size={36} color="#f8bbd0" />
      <p>Aucune commande pour l'instant</p>
      <Link to="/search" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>
        Découvrir la boutique
      </Link>
    </div>
  )

  return (
    <div className={styles.ordersList}>
      {orders.map(order => {
        const status = STATUS_LABEL[order.status] || STATUS_LABEL.pending
        const isOpen = expanded === order.id
        const items  = order.items_snapshot || []
        const date   = new Date(order.created_at).toLocaleDateString('fr-FR', {
          day: '2-digit', month: 'short', year: 'numeric'
        })

        return (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader} onClick={() => setExpanded(isOpen ? null : order.id)}>
              <div className={styles.orderLeft}>
                <div className={styles.orderNum}>Commande #{String(order.id).slice(-6).toUpperCase()}</div>
                <div className={styles.orderMeta}>
                  <Clock size={11} /> {date} · {order.delivery_mode === 'livraison' ? '🚚 Livraison' : '🏪 Retrait'}
                </div>
              </div>
              <div className={styles.orderRight}>
                <span className={styles.orderStatus} style={{ color: status.color, background: status.bg }}>
                  {status.label}
                </span>
                <div className={styles.orderTotal}>{formatCFA(order.total_amount)}</div>
                {isOpen ? <ChevronUp size={16} color="#aaa" /> : <ChevronDown size={16} color="#aaa" />}
              </div>
            </div>

            {isOpen && (
              <div className={styles.orderBody}>
                {items.map((item, i) => (
                  <div key={i} className={styles.orderItem}>
                    <span className={styles.orderItemName}>{item.name} <span className={styles.orderItemQty}>×{item.quantity}</span></span>
                    <span className={styles.orderItemPrice}>{formatCFA((item.price || 0) * item.quantity)}</span>
                  </div>
                ))}
                <div className={styles.orderTotalRow}>
                  <strong>Total</strong>
                  <strong>{formatCFA(order.total_amount)}</strong>
                </div>
                {order.delivery_address && (
                  <div className={styles.orderAddress}>
                    <MapPin size={12} /> {order.delivery_address}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Compte() {
  const { user, profile, clear } = useAuthStore()
  const navigate   = useNavigate()
  const cartCount  = useCartStore(selectCount)
  const favCount   = useFavStore(s => s.ids.length)
  const [editName, setEditName]   = useState(false)
  const [name, setName]           = useState(profile?.full_name || user?.user_metadata?.full_name || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || user?.user_metadata?.avatar_url || null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)

  let loc = null
  try { loc = JSON.parse(sessionStorage.getItem('bagstyle_loc') || 'null') } catch {}
  const [locLabel, setLocLabel] = useState(
    loc ? `${loc.lat?.toFixed(5)}, ${loc.lng?.toFixed(5)}` : ''
  )

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
      toast.success('Photo de profil mise à jour ✅')
    } catch {
      toast.error("Erreur lors de l'upload")
    } finally {
      setUploadingAvatar(false)
    }
  }

  if (!user) {
    return (
      <main className="page-layout">
        <div className={styles.notLogged}>
          <User size={56} color="#e8c0d0" />
          <h2>Vous n'êtes pas connecté</h2>
          <p>Connectez-vous pour accéder à votre compte.</p>
          <Link to="/connexion" className="btn btn-primary">Se connecter</Link>
          <Link to="/inscription" className="btn btn-outline" style={{ marginTop: 8 }}>Créer un compte</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="page-layout">
      <div className="container" style={{ padding: '24px 20px', maxWidth: 520 }}>

        <h1 className={styles.pageTitle}>Mon compte {isAdmin(user) && <span style={{display:'inline-flex',alignItems:'center',gap:4,background:'#fff3cd',color:'#b8860b',border:'1px solid #f0c040',borderRadius:20,padding:'2px 10px',fontSize:12,fontWeight:700,marginLeft:10,verticalAlign:'middle'}}><Crown size={13} /> Administrateur</span>}</h1>

        {isAdmin(user) && (
          <div style={{background:'linear-gradient(135deg,#fff5f8 0%,#fce4ec 100%)',border:'1px solid #f8bbd0',borderRadius:16,padding:'16px 18px',marginBottom:20}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,fontWeight:700,color:'#c2185b',fontSize:14}}><BarChart2 size={16} /> Accès rapide admin</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {[{to:'/accueil',label:'🏠 Tableau de bord'},{to:'/commandes',label:'🛍️ Commandes'},{to:'/vendus',label:'✅ Ventes'},{to:'/produits',label:'📦 Produits'}].map(l => (
                <Link key={l.to} to={l.to} style={{display:'block',background:'#fff',borderRadius:10,padding:'10px 12px',fontSize:13,fontWeight:600,color:'#d4537e',textDecoration:'none',border:'1px solid #f8bbd0',textAlign:'center'}}>{l.label}</Link>
              ))}
            </div>
          </div>
        )}

        {/* Avatar + nom */}
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
                <button className={styles.iconAction} onClick={() => setEditName(false)}><Check size={16} /></button>
              </div>
            ) : (
              <div className={styles.editRow}>
                <span className={styles.profileName}>{name || 'Mon compte'}</span>
                <button className={styles.iconAction} onClick={() => setEditName(true)}><Edit2 size={14} /></button>
              </div>
            )}
            <span className={styles.profileEmail}>{user.email}</span>
          </div>
        </div>

        {/* Infos */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Informations</h3>

          <div className={styles.infoRow}>
            <Mail size={15} className={styles.infoIcon} />
            <div>
              <div className={styles.infoLabel}>Email</div>
              <div className={styles.infoValue}>{user.email}</div>
            </div>
          </div>

          {user.user_metadata?.whatsapp && (
            <div className={styles.infoRow}>
              <Phone size={15} className={styles.infoIcon} />
              <div>
                <div className={styles.infoLabel}>WhatsApp</div>
                <div className={styles.infoValue}>{user.user_metadata.whatsapp}</div>
              </div>
            </div>
          )}

          <div className={styles.infoRow} style={{ cursor: 'pointer' }} onClick={() => requestGeolocation(setLocLabel)}>
            <MapPin size={15} className={styles.infoIcon} />
            <div style={{ flex: 1 }}>
              <div className={styles.infoLabel}>
                Localisation <span style={{ color: '#d4537e', fontSize: 10 }}>— Cliquer pour mettre à jour</span>
              </div>
              <div className={styles.infoValue}>
                {locLabel
                  ? <span style={{ color: '#22c55e' }}>📍 {locLabel}</span>
                  : <span style={{ color: '#bbb' }}>Non enregistrée — cliquez pour détecter</span>
                }
              </div>
            </div>
          </div>
        </div>

        {/* Activité */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Mon activité</h3>
          <div className={styles.statsRow}>
            <Link to="/panier" className={styles.statCard}>
              <ShoppingBag size={22} color="#d4537e" />
              <div className={styles.statNum}>{cartCount}</div>
              <div className={styles.statLabel}>Panier</div>
            </Link>
            <Link to="/favoris" className={styles.statCard}>
              <Heart size={22} color="#d4537e" />
              <div className={styles.statNum}>{favCount}</div>
              <div className={styles.statLabel}>Favoris</div>
            </Link>
          </div>
        </div>

        {/* Mes commandes */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Mes commandes</h3>
          <OrdersSection userId={user.id} />
        </div>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <span className={styles.logoutIcon}><LogOut size={17} /></span>
          <span>Se déconnecter</span>
        </button>

      </div>
    </main>
  )
}