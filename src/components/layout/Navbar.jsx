import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Search, Heart, User, Menu, X } from 'lucide-react'
import { useCartStore, useAuthStore, selectCount } from '@/lib/store'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef(null)
  const count = useCartStore(selectCount)
  const user = useAuthStore(s => s.user)

  // Fermer le menu si clic en dehors
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <nav className={styles.nav} ref={menuRef}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          Bag<span>Style</span>
        </Link>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher sacs, prénoms, styles…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </form>

        <div className={styles.actions}>
          <Link to="/favoris" className={styles.iconBtn} title="Favoris">
            <Heart size={20} />
          </Link>
          <Link to="/panier" className={styles.iconBtn} title="Panier">
            <ShoppingBag size={20} />
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </Link>
          {user ? (
            <Link to="/compte" className={styles.iconBtn} title="Mon compte">
              <User size={20} />
            </Link>
          ) : (
            <Link to="/connexion" className={`btn btn-primary btn-sm ${styles.loginBtn}`}>
              Connexion
            </Link>
          )}
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/search" onClick={() => setMenuOpen(false)}>Produits</Link>
          <Link to="/favoris" onClick={() => setMenuOpen(false)}>Commandes</Link>
          <Link to="/panier" onClick={() => setMenuOpen(false)}>Vendus</Link>
          {user ? (
            <Link to="/compte" onClick={() => setMenuOpen(false)}>Mon compte</Link>
          ) : (
            <Link to="/connexion" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>
              Connexion
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}