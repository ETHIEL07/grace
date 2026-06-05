import { Link } from 'react-router-dom'
import { Heart, ArrowRight } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { useFavStore } from '@/lib/store'
import { MOCK_PRODUCTS } from '@/lib/mockData'

export default function Favorites() {
  const { ids } = useFavStore()
  const favProducts = MOCK_PRODUCTS.filter(p => ids.includes(p.id))

  return (
    <main className="page-layout">
      <div className="container" style={{ padding: '24px 20px' }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Mes favoris</h1>
        <p style={{ color: '#999', marginBottom: 24 }}>{favProducts.length} article{favProducts.length !== 1 ? 's' : ''} sauvegardé{favProducts.length !== 1 ? 's' : ''}</p>

        {favProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Heart size={56} color="#e8c0d0" style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 20, color: '#333' }}>Aucun favori pour l'instant</h2>
            <p style={{ color: '#999', marginBottom: 20 }}>Cliquez sur ❤️ sur les produits qui vous plaisent !</p>
            <Link to="/search" className="btn btn-primary">
              Explorer la boutique <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="products-grid fade-in">
            {favProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  )
}
