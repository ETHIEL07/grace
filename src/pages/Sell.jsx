import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Package, CreditCard, Users, TrendingUp } from 'lucide-react'
import styles from './Sell.module.css'

const STEPS = [
  { icon: Users, title: 'Créez votre boutique', desc: 'Inscription gratuite en 5 minutes. Choisissez votre nom de boutique et ajoutez votre logo.' },
  { icon: Package, title: 'Publiez vos créations', desc: 'Ajoutez vos sacs avec photos, descriptions et prix. Nos outils simplissimes vous guident.' },
  { icon: CreditCard, title: 'Recevez vos paiements', desc: 'Les paiements sont traités par Stripe. Retraits vers votre compte bancaire en 2 jours.' },
  { icon: TrendingUp, title: 'Développez vos ventes', desc: 'Accédez aux statistiques, aux avis clients et aux outils de promotion.' },
]

const PERKS = [
  '0% de commission les 3 premiers mois',
  'Support client dédié 7j/7',
  'Outils de personnalisation avancés',
  'Visibilité sur mobile, web et app',
  'Tableau de bord vendeur complet',
  'Paiements sécurisés via Stripe',
]

export default function Sell() {
  return (
    <main className="page-layout">
      {/* Hero */}
      <section className={styles.hero}>
        <h1>Vendez vos créations sur BagStyle</h1>
        <p>Rejoignez des centaines d'artisans qui partagent leur passion et développent leur activité.</p>
        <Link to="/connexion?mode=register&type=seller" className="btn btn-primary">
          Créer ma boutique gratuitement <ArrowRight size={16} />
        </Link>
      </section>

      {/* Steps */}
      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Comment ça marche ?</h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((step, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNum}>{i + 1}</div>
                <step.icon size={28} className={styles.stepIcon} />
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className={styles.perksSection}>
        <div className="container">
          <div className={styles.perksLayout}>
            <div>
              <h2>Pourquoi choisir BagStyle ?</h2>
              <p style={{ color: '#666', marginBottom: 24 }}>
                Nous vous donnons tous les outils pour réussir, sans frais cachés.
              </p>
              <ul className={styles.perksList}>
                {PERKS.map((perk, i) => (
                  <li key={i} className={styles.perkItem}>
                    <CheckCircle size={18} className={styles.checkIcon} />
                    {perk}
                  </li>
                ))}
              </ul>
              <Link to="/connexion?mode=register&type=seller" className="btn btn-primary" style={{ marginTop: 24 }}>
                Commencer maintenant <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.statsPanel}>
              <div className={styles.stat}><span className={styles.statNum}>44 817</span><span className={styles.statLabel}>Produits actifs</span></div>
              <div className={styles.stat}><span className={styles.statNum}>12 K+</span><span className={styles.statLabel}>Clients satisfaits</span></div>
              <div className={styles.stat}><span className={styles.statNum}>4.9 ⭐</span><span className={styles.statLabel}>Note moyenne</span></div>
              <div className={styles.stat}><span className={styles.statNum}>0%</span><span className={styles.statLabel}>Commission 3 mois</span></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
