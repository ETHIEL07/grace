import { useState, useEffect } from 'react'
import { ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCFA } from '@/lib/mockData'
import toast from 'react-hot-toast'
import styles from './AdminHome.module.css'

const STATUS_CONFIG = {
  pending:   { label: 'En attente',  color: '#f59e0b', bg: '#fffbeb' },
  delivered: { label: 'Livrée',      color: '#22c55e', bg: '#f0fdf4' },
  cancelled: { label: 'Annulée',     color: '#ef4444', bg: '#fef2f2' },
  paid:      { label: 'Payée',       color: '#8b5cf6', bg: '#f5f3ff' },
  picked_up: { label: 'Récupérée',   color: '#06b6d4', bg: '#ecfeff' },
}

const DONE = ['delivered', 'cancelled', 'paid', 'picked_up']

export default function AdminOrders() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter]     = useState('all')

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .not('status', 'in', '("delivered","paid","picked_up","cancelled")')
      .order('created_at', { ascending: false })
    if (!error && data) setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        if (!DONE.includes(payload.new.status)) {
          setOrders(prev => [payload.new, ...prev])
          toast.success('🛍️ Nouvelle commande reçue !')
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, () => fetchOrders())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    if (error) toast.error('Erreur mise à jour')
    else { toast.success('Statut mis à jour ✅'); fetchOrders() }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  return (
    <main className="page-layout">
      <div className="container" style={{ padding: '24px 20px' }}>

        <div className={styles.adminHeader}>
          <div>
            <h1 className={styles.adminTitle}>Commandes en cours</h1>
            <p className={styles.adminSub}>{orders.length} commande{orders.length !== 1 ? 's' : ''} active{orders.length !== 1 ? 's' : ''}</p>
          </div>
          <span className={styles.adminBadge}>👑 Admin</span>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.filterRow}>
            {['all', 'pending'].map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Toutes' : STATUS_CONFIG[f]?.label}
                <span className={styles.badge}>
                  {f === 'all' ? orders.length : orders.filter(o => o.status === f).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <ShoppingBag size={40} color="#e8c0d0" />
            <p>Aucune commande active</p>
          </div>
        ) : (
          filtered.map(order => {
            const st     = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            const isOpen = expanded === order.id
            const items  = order.items_snapshot || []
            const date   = new Date(order.created_at).toLocaleDateString('fr-FR', {
              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })

            return (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader} onClick={() => setExpanded(isOpen ? null : order.id)}>
                  <div className={styles.orderLeft}>
                    <span className={styles.orderId}>#{String(order.id).slice(-6).toUpperCase()}</span>
                    <div className={styles.orderMeta}>
                      <strong>{order.customer_name || 'Client'}</strong>
                      <span>{order.customer_email}</span>
                      {order.customer_phone && <span>📞 {order.customer_phone}</span>}
                    </div>
                  </div>
                  <div className={styles.orderRight}>
                    <span className={styles.statusBadge} style={{ color: st.color, background: st.bg }}>{st.label}</span>
                    <span className="price">{formatCFA(order.total_amount)}</span>
                    <span className={styles.orderDate}>{date}</span>
                    {isOpen ? <ChevronUp size={16} color="#aaa" /> : <ChevronDown size={16} color="#aaa" />}
                  </div>
                </div>

                {isOpen && (
                  <div className={styles.orderBody}>
                    <div className={styles.deliveryInfo}>
                      <span>Mode : <strong>{order.delivery_mode === 'livraison' ? '🚚 Livraison' : '🏪 Retrait boutique'}</strong></span>
                      {order.delivery_address && <span>📍 {order.delivery_address}</span>}
                      {order.notes && <span>📝 {order.notes}</span>}
                    </div>

                    {items.length > 0 && (
                      <div className={styles.orderItems}>
                        {items.map((item, i) => (
                          <div key={i} className={styles.orderItem}>
                            {item.image_url && <img src={item.image_url} alt={item.name} className={styles.itemThumb} />}
                            <div className={styles.itemInfo}>
                              <span className={styles.itemName}>{item.name}</span>
                              <span className={styles.itemShop}>{item.shop}</span>
                            </div>
                            <span className={styles.itemQty}>×{item.quantity}</span>
                            <span className="price">{formatCFA(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <div style={{ display:'flex', justifyContent:'flex-end', fontWeight:700, fontSize:14, paddingTop:8, borderTop:'1px solid #f0f0f0' }}>
                          Total : {formatCFA(order.total_amount)}
                        </div>
                      </div>
                    )}

                    <div className={styles.statusActions}>
                      <span style={{ fontSize: 13, color: '#666' }}>Changer le statut :</span>
                      <div className={styles.statusBtns}>
                       {['pending','delivered','paid','picked_up','cancelled'].map(s => (
                          <button
                            key={s}
                            className={`${styles.statusBtn} ${order.status === s ? styles.statusBtnActive : ''}`}
                            style={order.status === s ? { background: STATUS_CONFIG[s]?.bg, color: STATUS_CONFIG[s]?.color, borderColor: STATUS_CONFIG[s]?.color } : {}}
                            onClick={() => updateStatus(order.id, s)}
                            disabled={order.status === s}
                          >
                            {STATUS_CONFIG[s]?.label}
                          </button>
                        ))}
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