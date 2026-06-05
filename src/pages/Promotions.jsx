import { useState, useEffect } from 'react'
import { Tag, Flame, Star, ShoppingBag } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/lib/store'
import toast from 'react-hot-toast'
import styles from './Promotions.module.css'

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Sac velours côtelé prénom Olivia', image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop', price: 6500, old_price: 8500, discount: 24, rating: 4.9, reviews: 782, badge: '🔥 Best-seller', tags: ['velours', 'personnalisé'] },
  { id: 2, name: 'Mini sac velours lilas Lola', image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop', price: 5200, old_price: 7200, discount: 28, rating: 4.8, reviews: 341, badge: '⚡ Flash', tags: ['velours', 'mini'] },
  { id: 3, name: 'Sac raphia tressé naturel', image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop', price: 9900, old_price: 13500, discount: 27, rating: 4.7, reviews: 198, badge: '🌿 Éco', tags: ['raphia', 'naturel'] },
  { id: 4, name: 'Bandoulière brodée fleurs Camille', image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop', price: 11000, old_price: 15000, discount: 27, rating: 5.0, reviews: 512, badge: '🌸 Nouveau', tags: ['brodé', 'fleurs'] },
  { id: 5, name: 'Tote bag wax multicolore', image_url: 'https://images.unsplash.com/photo-1574346375237-d4e93b6ceed4?w=400&h=400&fit=crop', price: 4800, old_price: 6500, discount: 26, rating: 4.6, reviews: 94, badge: '🌺 Wax', tags: ['wax', 'tote'] },
  { id: 6, name: 'Sac crochet bohème coloré', image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', price: 7500, old_price: 10500, discount: 29, rating: 4.9, reviews: 267, badge: '🧶 Artisan', tags: ['crochet', 'bohème'] },
]

function fmt(n) { return n.toLocaleString('fr-FR') + ' FCFA' }

export default function Promotions() {
  const [promos, setPromos]   = useState([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    async function fetchPromos() {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .order('created_at', { ascending: false })
        if (error || !data || data.length === 0) {
          setPromos(FALLBACK_PRODUCTS)
        } else {
          setPromos(data)
        }
      } catch {
        setPromos(FALLBACK_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }
    fetchPromos()
  }, [])

  const handleAddToCart = (p) => {
    addItem({
      id: `promo-${p.id}`,
      name: p.name,
      price: p.price,
      image_url: p.image_url,
      shop: { name: 'Promotion' },
    })
    toast.success(`${p.name.slice(0, 28)}… ajouté au panier 🛍️`)
  }

  return (
    <main className="page-layout">

      <section className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerBadge}><Flame size={18} /> Offres spéciales</div>
          <h1 className={styles.headerTitle}>Promotions <em>du moment</em></h1>
          <p className={styles.headerSub}>Des sacs artisanaux à prix réduits — disponibilités limitées, commandez vite !</p>
        </div>
      </section>

      <div className={styles.banner}>
        <Tag size={16} />
        <span>Jusqu'à <strong>-30%</strong> sur une sélection de sacs · à partir de 3 commandes</span>
      </div>

      <section className={styles.grid_section}>
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#aaa' }}>Chargement des promotions…</div>
          ) : (
            <div className={styles.grid}>
              {promos.map(p => (
                <div key={p.id} className={styles.card}>
                  <div className={styles.imgWrap}>
                    <img src={p.image_url} alt={p.name} />
                    <span className={styles.discountBadge}>-{p.discount}%</span>
                    {p.badge && <span className={styles.typeBadge}>{p.badge}</span>}
                  </div>
                  <div className={styles.cardBody}>
                    {p.tags && (
                      <div className={styles.tags}>
                        {(Array.isArray(p.tags) ? p.tags : p.tags.split(',')).map(t => (
                          <span key={t} className={styles.tag}>{t.trim()}</span>
                        ))}
                      </div>
                    )}
                    <h3 className={styles.cardName}>{p.name}</h3>
                    {p.rating && (
                      <div className={styles.rating}>
                        <Star size={12} fill="#ef9f27" stroke="none" />
                        <span>{p.rating}</span>
                        <span className={styles.reviews}>({p.reviews || 0} avis)</span>
                      </div>
                    )}
                    <div className={styles.prices}>
                      <span className={styles.price}>{fmt(p.price)}</span>
                      {p.old_price && <span className={styles.oldPrice}>{fmt(p.old_price)}</span>}
                    </div>
                    <button className={styles.orderBtn} onClick={() => handleAddToCart(p)}>
                      <ShoppingBag size={15} />
                      Ajouter au panier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  )
}