import { useNavigate } from 'react-router-dom'
import { Heart, Star, ShoppingCart } from 'lucide-react'
import { useCartStore, useFavStore } from '@/lib/store'
import { formatCFA } from '@/lib/mockData'
import toast from 'react-hot-toast'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const addItem = useCartStore(s => s.addItem)
  const { toggle, has } = useFavStore()
  const isFav = has(product.id)
  const navigate = useNavigate()

  // ✅ Clic sur l'image = ajouter au panier ET aller au panier pour commander
  const handleImageClick = () => {
    addItem(product)
    toast.success(`${product.name} ajouté ! 🛍️`, { duration: 1800 })
    navigate('/panier')
  }

  const handleAddBtn = (e) => {
    e.stopPropagation()
    addItem(product)
    toast.success('Ajouté au panier ! 🛍️', { duration: 1800 })
  }

  const handleFav = (e) => {
    e.stopPropagation()
    toggle(product.id)
    toast(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris ❤️', { duration: 1500 })
  }

  return (
    <div className={styles.card}>
      {/* Image — clic direct → panier ✅ */}
      <div
        className={styles.imgWrap}
        style={{ background: product.color || '#fbeaf0', cursor: 'pointer' }}
        onClick={handleImageClick}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && handleImageClick()}
        aria-label={`Commander ${product.name}`}
      >
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className={styles.img} />
        ) : (
          <span className={styles.emoji}>{product.emoji || '👜'}</span>
        )}
        {product.is_new && <span className={styles.new}>NOUVEAU</span>}

        {/* Overlay hover */}
        <div className={styles.overlay}>
          <ShoppingCart size={22} />
          <span>Commander</span>
        </div>

        <button
          className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
          onClick={handleFav}
          aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={16} fill={isFav ? '#d4537e' : 'none'} />
        </button>
      </div>

      {/* Info */}
      <div className={styles.info}>
        <div className={styles.shopName}>{product.shop?.name}</div>
        <div className={styles.name}>{product.name}</div>

        <div className={styles.row}>
          <div className={styles.stars}>
            <Star size={11} fill="#ef9f27" stroke="none" />
            <span>{product.rating?.toFixed(1)}</span>
            <span className={styles.reviewCount}>({product.reviews_count?.toLocaleString()})</span>
          </div>
        </div>

        <div className={styles.bottom}>
          <div>
            <span className="price">{formatCFA(product.price)}</span>
          </div>
          <button className={styles.addBtn} onClick={handleAddBtn} aria-label="Ajouter au panier">
            +
          </button>
        </div>
      </div>
    </div>
  )
}
