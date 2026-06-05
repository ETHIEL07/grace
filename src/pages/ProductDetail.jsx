import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Heart, Star, ShoppingBag, Truck, Shield, ArrowLeft, Plus, Minus } from 'lucide-react'
import { MOCK_PRODUCTS, formatCFA } from '@/lib/mockData'
import { useCartStore, useFavStore } from '@/lib/store'
import toast from 'react-hot-toast'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = MOCK_PRODUCTS.find(p => p.slug === id || p.id === Number(id))
  const [qty, setQty] = useState(1)
  const [personName, setPersonName] = useState('')
  const addItem = useCartStore(s => s.addItem)
  const { toggle, has } = useFavStore()

  if (!product) return (
    <main className="page-layout">
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>Produit introuvable</h2>
        <Link to="/boutiques" className="btn btn-primary" style={{ marginTop: 16 }}>
          Retour à la boutique
        </Link>
      </div>
    </main>
  )

  const isFav = has(product.id)

  const handleAddToCart = () => {
    addItem({ ...product, personalisation: personName || undefined }, qty)
    toast.success(`${qty} article${qty > 1 ? 's' : ''} ajouté${qty > 1 ? 's' : ''} au panier ! 🛍️`)
    navigate('/panier')
  }

  return (
    <main className="page-layout">
      <div className="container" style={{ padding: '24px 20px' }}>
        <Link to="/boutiques" className={styles.backLink}>
          <ArrowLeft size={16} /> Retour à la boutique
        </Link>

        <div className={styles.layout}>
          {/* Image */}
          <div className={styles.imgSection}>
            <div className={styles.mainImg} style={{ background: product.color || '#fbeaf0' }}>
              {product.image_url
                ? <img src={product.image_url} alt={product.name} />
                : <span className={styles.emoji}>{product.emoji || '👜'}</span>
              }
              {product.is_new && <span className={styles.badge}>NOUVEAU</span>}
            </div>
          </div>

          {/* Info */}
          <div className={styles.infoSection}>
            <div className={styles.shopLink}>{product.shop?.name}</div>
            <h1 className={styles.productName}>{product.name}</h1>

            {/* Rating */}
            <div className={styles.rating}>
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={16}
                  fill={i <= Math.round(product.rating) ? '#ef9f27' : 'none'}
                  stroke="#ef9f27" />
              ))}
              <span className={styles.ratingScore}>{product.rating?.toFixed(1)}</span>
              <span className={styles.ratingCount}>({product.reviews_count?.toLocaleString()} avis)</span>
            </div>

            {/* Prix en FCFA */}
            <div className={styles.priceRow}>
              <span className={styles.price}>{formatCFA(product.price)}</span>
            </div>

            {/* Personnalisation */}
            <div className={styles.field}>
              <label className={styles.label}>Personnalisation (prénom)</label>
              <input
                type="text"
                placeholder="Ex: Olivia, Sofia, Grace…"
                value={personName}
                onChange={e => setPersonName(e.target.value)}
                maxLength={20}
              />
              <p className={styles.hint}>Laissez vide si non personnalisé</p>
            </div>

            {/* Quantité */}
            <div className={styles.qtyRow}>
              <span className={styles.label}>Quantité</span>
              <div className={styles.qty}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={14} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}><Plus size={14} /></button>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <button className={`btn btn-primary ${styles.addBtn}`} onClick={handleAddToCart}>
                <ShoppingBag size={18} /> Commander maintenant
              </button>
              <button
                className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
                onClick={() => toggle(product.id)}
                aria-label="Favori"
              >
                <Heart size={20} fill={isFav ? '#d4537e' : 'none'} />
              </button>
            </div>

            {/* Trust */}
            <div className={styles.trust}>
              <div className={styles.trustItem}><Truck size={14} /> Livraison à Abidjan</div>
              <div className={styles.trustItem}><Shield size={14} /> Paiement via WhatsApp</div>
            </div>

            {/* Tags */}
            {product.tags && (
              <div className={styles.tags}>
                {product.tags.map(tag => (
                  <span key={tag} className="pill">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}