import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { MOCK_PRODUCTS, MOCK_CATEGORIES, formatCFA, PRICE_MAX } from '@/lib/mockData'
import { getProducts } from '@/lib/supabase'
import styles from './Search.module.css'

const SORT_OPTIONS = [
  { value: 'relevance',  label: 'Pertinence' },
  { value: 'price_asc',  label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'rating',     label: 'Mieux notés' },
  { value: 'new',        label: 'Nouveautés' },
]

export default function Search() {
  const [searchParams] = useSearchParams()
  const q = searchParams.get('q') || ''
  const [sort, setSort]               = useState('relevance')
  const [maxPrice, setMaxPrice]       = useState(PRICE_MAX) // ✅ en FCFA maintenant
  const [selectedCats, setSelectedCats] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  const toggleCat = (id) =>
    setSelectedCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )

  const [allProducts, setAllProducts] = useState(MOCK_PRODUCTS)
useEffect(() => {
  getProducts().then(data => { if (data) setAllProducts(data) })
}, [])

let results = allProducts.filter(p => {
    const matchQ = !q ||
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.tags?.some(t => t.toLowerCase().includes(q.toLowerCase()))
    const matchCat   = !selectedCats.length || selectedCats.includes(p.category_id)
    const matchPrice = p.price <= maxPrice
    return matchQ && matchCat && matchPrice
  })

  if (sort === 'price_asc')  results = [...results].sort((a, b) => a.price - b.price)
  if (sort === 'price_desc') results = [...results].sort((a, b) => b.price - a.price)
  if (sort === 'rating')     results = [...results].sort((a, b) => b.rating - a.rating)
  if (sort === 'new')        results = [...results].sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0))

  return (
    <main className="page-layout">
      <div className="container" style={{ padding: '24px 20px' }}>

        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {q ? `Résultats pour "${q}"` : 'Tous les sacs'}
            </h1>
            <p className={styles.count}>{results.length} article{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}</p>
          </div>
          <div className={styles.sortRow}>
            <select value={sort} onChange={e => setSort(e.target.value)} className={styles.sortSelect}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              className={`${styles.filterBtn} ${showFilters ? styles.active : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} /> Filtres
            </button>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={`${styles.sidebar} ${showFilters ? styles.open : ''}`}>
            <div className={styles.filterSection}>
              <div className={styles.filterTitle}>
                Catégories
                {selectedCats.length > 0 && (
                  <button className={styles.clearBtn} onClick={() => setSelectedCats([])}>
                    <X size={12} /> Effacer
                  </button>
                )}
              </div>
              {MOCK_CATEGORIES.map(cat => (
                <label key={cat.id} className={styles.checkLabel}>
                  <input type="checkbox"
                    checked={selectedCats.includes(cat.id)}
                    onChange={() => toggleCat(cat.id)}
                    style={{ width: 'auto' }} />
                  {cat.emoji} {cat.name}
                </label>
              ))}
            </div>

            {/* ✅ Filtre prix en FCFA */}
            <div className={styles.filterSection}>
              <div className={styles.filterTitle}>
                Prix max : {formatCFA(maxPrice)}
              </div>
              <input
                type="range"
                min={5000} max={PRICE_MAX} step={500}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <div className={styles.priceRow}>
                <span>5 000 FCFA</span>
                <span>{formatCFA(PRICE_MAX)}</span>
              </div>
            </div>
          </aside>

          {/* Résultats */}
          <div className={styles.results}>
            {results.length === 0 ? (
              <div className={styles.empty}>
                <span style={{ fontSize: 48 }}>🔍</span>
                <p>Aucun résultat pour cette recherche.</p>
                <button className="btn btn-outline"
                  onClick={() => { setSelectedCats([]); setMaxPrice(PRICE_MAX) }}>
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {results.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
