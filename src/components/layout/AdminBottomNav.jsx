import { Link, useLocation } from 'react-router-dom'
import { Home, Package, ShoppingBag, CheckCircle, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import styles from './BottomNav.module.css'

const ADMIN_NAV = [
  { to: '/accueil',  icon: Home,         label: 'Accueil' },
  { to: '/produits', icon: Package,       label: 'Produits' },
  { to: '/commandes',icon: ShoppingBag,   label: 'Commandes', badge: true },
  { to: '/vendus',   icon: CheckCircle,   label: 'Vendus' },
  { to: '/compte',   icon: User,          label: 'Compte' },
]

export default function AdminBottomNav() {
  const { pathname } = useLocation()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .not('status', 'in', '("delivered","paid","picked_up","cancelled")')
      setPendingCount(count || 0)
    }
    fetchCount()

    const channel = supabase
      .channel('admin-nav-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchCount)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  // Mapper les routes admin sur le bon onglet actif
  const getActive = (to) => {
    if (to === '/accueil' && pathname === '/accueil') return true
    if (to === '/commandes' && pathname === '/commandes') return true
    if (to === '/vendus' && pathname === '/vendus') return true
    if (to === '/produits' && pathname === '/produits') return true
    if (to === '/compte' && pathname === '/compte') return true
    return false
  }

  return (
    <nav className={styles.nav} aria-label="Navigation admin">
      {ADMIN_NAV.map(({ to, icon: Icon, label, badge }) => (
        <Link
          key={to}
          to={to}
          className={`${styles.item} ${getActive(to) ? styles.active : ''}`}
          aria-current={getActive(to) ? 'page' : undefined}
        >
          <span className={styles.iconWrap}>
            <Icon size={22} />
            {badge && pendingCount > 0 && (
              <span className={styles.badge}>{pendingCount > 9 ? '9+' : pendingCount}</span>
            )}
          </span>
          <span className={styles.label}>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
