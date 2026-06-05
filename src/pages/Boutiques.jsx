import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingBag, Search } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { MOCK_SHOPS, MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData'
import styles from './Boutiques.module.css'

export default function Boutiques() {
  const [activeShop, setActiveShop]   = useState(null)
  const [activeCat,  setActiveCat]    = useState(null)
  const [query, setQuery]             = useState('')

  const currentShop = MOCK_SHOPS.find(s => s.id === activeShop)

  const products = MOCK_PRODUCTS.filter(p => {
    const matchShop = !activeShop || p.shop_id === activeShop
    const matchCat  = !activeCat  || p.category_id === activeCat
    const matchQ    = !query || p.name.toLowerCase().includes(query.toLowerCase())
    return matchShop && matchCat && matchQ
  })

  return (
    <main className="page-layout">
      <div className="container" style={{ padding: '24px 20px' }}>

        <h1 className={styles.pageTitle}>🛍️ Explorer la boutique</h1>
        <p className={styles.pageDesc}>
          Découvrez toutes nos créations — sacs personnalisés, wax africain, crochet, broderies…
        </p>

        {/* Barre de recherche */}
        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Rechercher dans la boutique…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Filtres boutiques */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nos boutiques</h2>
          <div className={styles.shopGrid}>
            <button
              className={`${styles.shopCard} ${!activeShop ? styles.shopActive : ''}`}
              onClick={() => setActiveShop(null)}
            >
              <span className={styles.shopEmoji}>🛍️</span>
              <div className={styles.shopName}>Toutes</div>
              <div className={styles.shopSub}>{MOCK_PRODUCTS.length} articles</div>
            </button>
            {MOCK_SHOPS.map(shop => (
              <button
                key={shop.id}
                className={`${styles.shopCard} ${activeShop === shop.id ? styles.shopActive : ''}`}
                onClick={() => setActiveShop(activeShop === shop.id ? null : shop.id)}
              >
                <span className={styles.shopEmoji}>{shop.emoji}</span>
                <div className={styles.shopName}>{shop.name}</div>
                <div className={styles.shopMeta}>
                  <Star size={11} fill="#ef9f27" stroke="none" />
                  <span>{shop.rating}</span>
                  <span className={styles.shopSub}> · {shop.products} articles</span>
                </div>
                <p className={styles.shopDesc}>{shop.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Filtres catégories */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Par catégorie</h2>
          <div className={styles.catScroll}>
            <button
              className={`${styles.catPill} ${!activeCat ? styles.catActive : ''}`}
              onClick={() => setActiveCat(null)}
            >
              Tout
            </button>
            {MOCK_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catPill} ${activeCat === cat.id ? styles.catActive : ''}`}
                onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
        </section>

        {/* Résultats */}
        <section className={styles.section}>
          <div className={styles.resultsHeader}>
            <h2 className={styles.sectionTitle}>
              {currentShop ? currentShop.name : 'Tous les sacs'}{activeCat ? '' : ''}
            </h2>
            <span className={styles.count}>{products.length} article{products.length !== 1 ? 's' : ''}</span>
          </div>

          {products.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingBag size={48} color="#e8c0d0" />
              <p>Aucun sac trouvé pour ces filtres.</p>
              <button className="btn btn-outline" onClick={() => { setActiveShop(null); setActiveCat(null); setQuery('') }}>
                Réinitialiser
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
