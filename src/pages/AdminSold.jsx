import { useState, useEffect } from 'react'
import { CheckCircle, TrendingUp, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCFA } from '@/lib/mockData'
import styles from './AdminHome.module.css'

const STATUS_CONFIG = {
  delivered: { label: 'Livrée',    color: '#22c55e', bg: '#f0fdf4' },
  paid:      { label: 'Payée',     color: '#8b5cf6', bg: '#f5f3ff' },
  picked_up: { label: 'Récupérée', color: '#06b6d4', bg: '#ecfeff' },
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ background: color + '18', color }}>
        <Icon size={20} />
      </div>
      <div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  )
}

export default function AdminSold() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [period, setPeriod]     = useState('all')

  useEffect(() => {
    const fetchSold = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .in('status', ['delivered', 'paid', 'picked_up'])
        .order('created_at', { ascending: false })
      if (!error && data) setOrders(data)
      setLoading(false)
    }
    fetchSold()
  }, [])

  const now = new Date()
  const filtered = orders.filter(o => {
    if (period === 'all') return true
    const d = new Date(o.created_at)
    if (period === 'today') return d.toDateString() === now.toDateString()
    if (period === 'week') {
      const weekAgo = new Date(now)
      weekAgo.setDate(now.getDate() - 7)
      return d >= weekAgo
    }
    if (period === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    return true
  })

  const totalRevenue = filtered.reduce((s, o) => s + (Number(o.total_amount) || 0), 0)
  const avgOrder     = filtered.length ? totalRevenue / filtered.length : 0
  const totalItems   = filtered.reduce((s, o) => s + (o.items_snapshot?.length || 0), 0)

  return (
    <main className="page-layout">
      <div className="container" style={{ padding: '24px 20px' }}>

        <div className={styles.adminHeader}>
          <div>
            <h1 className={styles.adminTitle}>Ventes</h1>
            <p className={styles.adminSub}>Commandes finalisées</p>
          </div>
          <span className={styles.adminBadge}>👑 Admin</span>
        </div>

        <div className={styles.filterRow} style={{ marginBottom: 20, gap: 8 }}>
          {[
            { id: 'today', label: "Aujourd'hui" },
            { id: 'week',  label: '7 derniers jours' },
            { id: 'month', label: 'Ce mois' },
            { id: 'all',   label: 'Tout' },
          ].map(p => (
            <button
              key={p.id}
              className={`${styles.filterBtn} ${period === p.id ? styles.filterActive : ''}`}
              onClick={() => setPeriod(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className={styles.statsRow} style={{ marginBottom: 24 }}>
          <StatCard icon={ShoppingBag} label="Commandes"          value={filtered.length}         color="#d4537e" />
          <StatCard icon={TrendingUp}  label="Chiffre d'affaires"  value={formatCFA(totalRevenue)} color="#22c55e" />
          <StatCard icon={CheckCircle} label="Panier moyen"        value={formatCFA(avgOrder)}     color="#8b5cf6" />
          <StatCard icon={ShoppingBag} label="Articles vendus"     value={totalItems}              color="#f59e0b" />
        </div>

        {loading ? (
          <div className={styles.loading}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <CheckCircle size={40} color="#e8c0d0" />
            <p>Aucune vente sur cette période</p>
          </div>
        ) : (
          filtered.map(order => {
            const st     = STATUS_CONFIG[order.status] || STATUS_CONFIG.delivered
            const isOpen = expanded === order.id
            const items  = order.items_snapshot || []
            const date   = new Date(order.created_at).toLocaleDateString('fr-FR', {
              day: '2-digit', month: 'short', year: 'numeric'
            })

            return (
              <div key={order.id} className={`${styles.orderCard} ${styles.orderCardSold}`}>
                <div className={styles.orderHeader} onClick={() => setExpanded(isOpen ? null : order.id)}>
                  <div className={styles.orderLeft}>
                    <span className={styles.orderId}>#{String(order.id).slice(-6).toUpperCase()}</span>
                    <div className={styles.orderMeta}>
                      <strong>{order.customer_name || 'Client'}</strong>
                      <span>{order.customer_email} · {date}</span>
                    </div>
                  </div>
                  <div className={styles.orderRight}>
                    <span className={styles.statusBadge} style={{ color: st.color, background: st.bg }}>{st.label}</span>
                    <span className="price">{formatCFA(order.total_amount)}</span>
                    {isOpen ? <ChevronUp size={16} color="#aaa" /> : <ChevronDown size={16} color="#aaa" />}
                  </div>
                </div>

                {isOpen && items.length > 0 && (
                  <div className={styles.orderBody}>
                    <div className={styles.orderItems}>
                      {items.map((item, i) => (
                        <div key={i} className={styles.orderItem}>
                          {item.image_url && <img src={item.image_url} alt={item.name} className={styles.itemThumb} />}
                          <div className={styles.itemInfo}>
                            <span className={styles.itemName}>{item.name}</span>
                          </div>
                          <span className={styles.itemQty}>×{item.quantity}</span>
                          <span className="price">{formatCFA(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div style={{ display:'flex', justifyContent:'flex-end', fontWeight:700, fontSize:14, paddingTop:8, borderTop:'1px solid #f0f0f0' }}>
                        Total : {formatCFA(order.total_amount)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}