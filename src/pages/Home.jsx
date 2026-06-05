import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, ChevronLeft, ChevronRight, Shield, Award, MapPin, Clock, MessageCircle } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_SHOPS } from '@/lib/mockData'
import { getProducts } from '@/lib/supabase'
import styles from './Home.module.css'

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=900&fit=crop',
    title: 'Sacs personnalisés,',
    em: 'faits avec amour',
    sub: 'Découvrez des créations uniques par des artisans passionnés. Prénoms brodés, fleurs, velours — chaque sac raconte une histoire.',
    badge: '✨ Nouvelle collection disponible !',
  },
  {
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=900&fit=crop',
    title: 'Velours, raphia,',
    em: 'broderies d\'amour',
    sub: 'Des matières nobles sélectionnées avec soin. Chaque sac est une œuvre d\'art artisanale faite à Abidjan.',
    badge: '🎀 Artisanat ivoirien',
  },
  {
    image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=900&fit=crop',
    title: 'Votre prénom,',
    em: 'sur votre sac',
    sub: 'Personnalisez votre sac avec le prénom de votre enfant, des fleurs, des couleurs — votre imagination est la limite.',
    badge: '🌸 100% personnalisable',
  },
  {
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=900&fit=crop',
    title: 'Livraison rapide',
    em: 'à Abidjan',
    sub: 'Commandez via WhatsApp et recevez votre sac en un temps record. Notre équipe est disponible 7j/7.',
    badge: '🚀 Livraison express',
  },
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(null)
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  const next = useCallback(() => setSlide(s => (s + 1) % HERO_SLIDES.length), [])
  const prev = useCallback(() => setSlide(s => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [])

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(next, 4500)
    return () => clearInterval(timerRef.current)
  }, [paused, next])

  const handleArrow = (fn) => {
    clearInterval(timerRef.current)
    fn()
    setPaused(false)
  }

 const [allProducts, setAllProducts] = useState(MOCK_PRODUCTS)
useEffect(() => {
  getProducts().then(data => { if (data) setAllProducts(data) })
}, [])

const filtered = activeCategory
  ? allProducts.filter(p => p.category_id === activeCategory || p.category === activeCategory)
  : allProducts

  const current = HERO_SLIDES[slide]

  return (
    <main className="page-layout">

      {/* ── Hero Carrousel ─────────────────────────────── */}
      <section
        className={styles.hero}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Image de fond */}
        <div className={styles.heroSlides}>
          {HERO_SLIDES.map((s, i) => (
            <div
              key={i}
              className={`${styles.heroSlide} ${i === slide ? styles.heroSlideActive : ''}`}
            >
              <img src={s.image} alt="" />
              <div className={styles.heroOverlay} />
            </div>
          ))}
        </div>

        {/* Contenu */}
        <div className={styles.heroContent}>
          <span className="pill">{current.badge}</span>
          <h1 className={styles.heroTitle}>
            {current.title}<br />
            <em>{current.em}</em>
          </h1>
          <p className={styles.heroSubtitle}>{current.sub}</p>
          <div className={styles.heroBtns}>
            <Link to="/boutiques" className="btn btn-primary">
              Explorer la boutique <ArrowRight size={16} />
            </Link>
            <Link to="/promotions" className="btn btn-outline">
              🔥 Promotions
            </Link>
          </div>
        </div>

        {/* Flèches */}
        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={() => handleArrow(prev)} aria-label="Précédent">
          <ChevronLeft size={22} />
        </button>
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={() => handleArrow(next)} aria-label="Suivant">
          <ChevronRight size={22} />
        </button>

        {/* Dots */}
        <div className={styles.dots}>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === slide ? styles.dotActive : ''}`}
              onClick={() => { clearInterval(timerRef.current); setSlide(i) }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Trust bar */}
      <section className={styles.trustBar}>
        <div className={styles.trustItem}><Shield size={15} /><span>Paiement sécurisé</span></div>
        <div className={styles.trustItem}><Award size={15} /><span>Artisans vérifiés</span></div>
        <div className={styles.trustItem}><MapPin size={15} /><span>Retrait Carrefour Hôtel Blanc</span></div>
        <div className={styles.trustItem}><Clock size={15} /><span>Réponse rapide</span></div>
        <div className={styles.trustItem}><MessageCircle size={15} /><span>Support WhatsApp</span></div>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Parcourir par catégorie</h2>
          <div className={styles.catScroll}>
            <button
              className={`${styles.catPill} ${!activeCategory ? styles.catActive : ''}`}
              onClick={() => setActiveCategory(null)}
            >Tous</button>
            {MOCK_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catPill} ${activeCategory === cat.id ? styles.catActive : ''}`}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {activeCategory
                ? MOCK_CATEGORIES.find(c => c.id === activeCategory)?.name
                : 'Tendances du moment'}
            </h2>
            <Link to="/search" className={styles.seeAll}>Voir tout →</Link>
          </div>
          <div className="products-grid fade-in">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Featured shops */}
      <section className={styles.shopsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Boutiques populaires</h2>
            <Link to="/boutiques" className={styles.seeAll}>Voir tout →</Link>
          </div>
          <div className={styles.shopsGrid}>
            {MOCK_SHOPS.map(shop => (
              <Link key={shop.id} to={`/boutique/${shop.slug}`} className={styles.shopCard}>
                <div className={styles.shopEmoji}>{shop.emoji}</div>
                <div className={styles.shopName}>{shop.name}</div>
                <div className={styles.shopMeta}>
                  <span className="stars"><Star size={11} fill="#ef9f27" stroke="none" />{shop.rating}</span>
                  <span className={styles.shopCount}>{shop.products} articles</span>
                </div>
                <p className={styles.shopDesc}>{shop.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
