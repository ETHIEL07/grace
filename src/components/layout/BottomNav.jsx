import { Link, useLocation } from 'react-router-dom'
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react'
import { useCartStore, selectCount } from '@/lib/store'
import styles from './BottomNav.module.css'

const NAV_ITEMS = [
  { to: '/',        icon: Home,        label: 'Accueil' },
  { to: '/search',  icon: Search,      label: 'Rechercher' },
  { to: '/favoris', icon: Heart,       label: 'Favoris' },
  { to: '/panier',  icon: ShoppingBag, label: 'Panier', badge: true },
  { to: '/compte',  icon: User,        label: 'Compte' },
]

export default function BottomNav() {
  const { pathname } = useLocation()
  const count = useCartStore(selectCount)   // ✅ sélecteur dérivé

  return (
    <nav className={styles.nav} aria-label="Navigation principale">
      {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
        <Link
          key={to}
          to={to}
          className={`${styles.item} ${pathname === to ? styles.active : ''}`}
          aria-current={pathname === to ? 'page' : undefined}
        >
          <span className={styles.iconWrap}>
            <Icon size={22} />
            {badge && count > 0 && (
              <span className={styles.badge}>{count > 9 ? '9+' : count}</span>
            )}
          </span>
          <span className={styles.label}>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
