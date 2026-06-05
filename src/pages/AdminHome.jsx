import { useState, useEffect, useRef } from 'react'
import {
  Package, ShoppingBag, CheckCircle, TrendingUp,
  Edit2, Image, Save, X, Upload, Search, Filter,
  ChevronDown, ChevronUp, Loader, AlertCircle, Plus
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCFA } from '@/lib/mockData'
import toast from 'react-hot-toast'
import styles from './AdminHome.module.css'

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const STATUS_CONFIG = {
  pending:   { label: 'En attente',  color: '#f59e0b', bg: '#fffbeb' },
  confirmed: { label: 'Confirmée',   color: '#3b82f6', bg: '#eff6ff' },
  delivered: { label: 'Livrée',      color: '#22c55e', bg: '#f0fdf4' },
  cancelled: { label: 'Annulée',     color: '#ef4444', bg: '#fef2f2' },
  paid:      { label: 'Payée',       color: '#8b5cf6', bg: '#f5f3ff' },
  picked_up: { label: 'Récupérée',   color: '#06b6d4', bg: '#ecfeff' },
}

// ─────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// Edit Product Modal
// ─────────────────────────────────────────────
function EditProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name:      product.name || '',
    price:     product.price || '',
    old_price: product.old_price || '',
    image_url: product.image_url || '',
    in_stock:  product.in_stock !== false,
    is_featured: product.is_featured || false,
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(product.image_url || '')
  const fileRef = useRef()

  const set = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(p => ({ ...p, [k]: val }))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const ext  = file.name.split('.').pop()
      const path = `products/${product.id}-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('product-images').getPublicUrl(path)
      setForm(p => ({ ...p, image_url: data.publicUrl }))
      setPreview(data.publicUrl)
      toast.success('Image téléversée ✅')
    } catch (err) {
      toast.error('Erreur upload : ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name:        form.name.trim(),
          price:       Number(form.price),
          old_price:   form.old_price ? Number(form.old_price) : null,
          image_url:   form.image_url.trim() || null,
          in_stock:    form.in_stock,
          is_featured: form.is_featured,
        })
        .eq('id', product.id)
      if (error) throw error
      toast.success('Produit mis à jour ✅')
      onSaved()
      onClose()
    } catch (err) {
      toast.error('Erreur : ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>Modifier le produit</h3>
          <button className={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div className={styles.modalBody}>
          {/* Image preview */}
          <div className={styles.imageSection}>
            <div className={styles.imgPreview}>
              {preview
                ? <img src={preview} alt="" onError={() => setPreview('')} />
                : <Package size={40} color="#ddd" />}
            </div>
            <div className={styles.imgActions}>
              <button
                className={`btn btn-outline btn-sm ${styles.uploadBtn}`}
                onClick={() => fileRef.current.click()}
                disabled={uploading}
              >
                {uploading ? <Loader size={14} className={styles.spin} /> : <Upload size={14} />}
                {uploading ? 'Upload...' : 'Téléverser une image'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileUpload} />
              <span className={styles.orText}>ou entrez l'URL :</span>
              <input
                type="url"
                placeholder="https://..."
                value={form.image_url}
                onChange={(e) => {
                  set('image_url')(e)
                  setPreview(e.target.value)
                }}
              />
            </div>
          </div>

          {/* Fields */}
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label>Nom du produit</label>
              <input value={form.name} onChange={set('name')} placeholder="Nom..." />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup}>
              <label>Prix (FCFA)</label>
              <input type="number" value={form.price} onChange={set('price')} placeholder="25000" />
            </div>
            <div className={styles.fieldGroup}>
              <label>Ancien prix (optionnel)</label>
              <input type="number" value={form.old_price} onChange={set('old_price')} placeholder="35000" />
            </div>
          </div>
          <div className={styles.checkRow}>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={form.in_stock} onChange={set('in_stock')} />
              En stock
            </label>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} />
              Mis en avant
            </label>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-outline" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <Loader size={14} className={styles.spin} /> : <Save size={14} />}
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Products Tab
// ─────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [editing, setEditing]   = useState(null)

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className={styles.loading}>
      <div className="spinner" />
    </div>
  )

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} color="#aaa" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <span className={styles.count}>{filtered.length} produit{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className={styles.productsTable}>
        <div className={styles.tableHeader}>
          <span>Produit</span>
          <span>Prix</span>
          <span>Stock</span>
          <span>Action</span>
        </div>
        {filtered.map(p => (
          <div key={p.id} className={styles.tableRow}>
            <div className={styles.productCell}>
              <div className={styles.productThumb}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} />
                  : <Package size={18} color="#ddd" />}
              </div>
              <div>
                <div className={styles.productName}>{p.name}</div>
                <div className={styles.productCat}>{p.category || '—'}</div>
              </div>
            </div>
            <div>
              <span className="price">{formatCFA(p.price)}</span>
              {p.old_price && <span className="price-old">{formatCFA(p.old_price)}</span>}
            </div>
            <div>
              <span className={styles.stockBadge} data-in={p.in_stock}>
                {p.in_stock ? 'En stock' : 'Épuisé'}
              </span>
            </div>
            <div>
              <button
                className={`btn btn-outline btn-sm`}
                onClick={() => setEditing(p)}
              >
                <Edit2 size={13} /> Modifier
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <Package size={36} color="#e8c0d0" />
            <p>Aucun produit trouvé</p>
          </div>
        )}
      </div>

      {editing && (
        <EditProductModal
          product={editing}
          onClose={() => setEditing(null)}
          onSaved={fetchProducts}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Orders Tab (commandes actives)
// ─────────────────────────────────────────────
function OrdersTab() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter]     = useState('all')

  const fetchOrders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
    // Temps réel : écouter les nouvelles commandes
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => [payload.new, ...prev])
        toast.success('🛍️ Nouvelle commande reçue !')
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (payload) => {
        setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o))
      })
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
    if (error) {
      toast.error('Erreur mise à jour')
    } else {
      toast.success('Statut mis à jour ✅')
      fetchOrders()
    }
  }

  // Filtrer : actives = pas delivered/cancelled/paid/picked_up
  const DONE_STATUSES = ['delivered', 'cancelled', 'paid', 'picked_up']
  const activeOrders = orders.filter(o => !DONE_STATUSES.includes(o.status))
  const filteredOrders = filter === 'all' ? activeOrders : activeOrders.filter(o => o.status === filter)

  if (loading) return <div className={styles.loading}><div className="spinner" /></div>

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.filterRow}>
          {['all', 'pending', 'confirmed'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Toutes' : STATUS_CONFIG[f]?.label}
              {f === 'all'
                ? <span className={styles.badge}>{activeOrders.length}</span>
                : <span className={styles.badge}>{activeOrders.filter(o => o.status === f).length}</span>
              }
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className={styles.empty}>
          <ShoppingBag size={40} color="#e8c0d0" />
          <p>Aucune commande active</p>
        </div>
      ) : (
        filteredOrders.map(order => {
          const st    = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
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
                    <strong>{order.customer_name}</strong>
                    <span>{order.customer_email}</span>
                    {order.customer_phone && <span>📞 {order.customer_phone}</span>}
                  </div>
                </div>
                <div className={styles.orderRight}>
                  <span className={styles.statusBadge} style={{ color: st.color, background: st.bg }}>
                    {st.label}
                  </span>
                  <span className="price">{formatCFA(order.total_amount)}</span>
                  <span className={styles.orderDate}>{date}</span>
                  {isOpen ? <ChevronUp size={16} color="#aaa" /> : <ChevronDown size={16} color="#aaa" />}
                </div>
              </div>

              {isOpen && (
                <div className={styles.orderBody}>
                  {/* Mode livraison */}
                  <div className={styles.deliveryInfo}>
                    <span>Mode : <strong>{order.delivery_mode === 'livraison' ? '🚚 Livraison' : '🏪 Retrait en boutique'}</strong></span>
                    {order.delivery_address && <span>Adresse : {order.delivery_address}</span>}
                  </div>

                  {/* Articles */}
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
                    </div>
                  )}

                  {/* Actions statut */}
                  <div className={styles.statusActions}>
                    <span style={{ fontSize: 13, color: '#666' }}>Changer le statut :</span>
                    <div className={styles.statusBtns}>
                      {['pending', 'confirmed', 'delivered', 'paid', 'picked_up', 'cancelled'].map(s => (
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
  )
}

// ─────────────────────────────────────────────
// Sold Tab (commandes finalisées)
// ─────────────────────────────────────────────
function SoldTab() {
  const [orders, setOrders]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState(null)

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

  const total = orders.reduce((s, o) => s + (Number(o.total_amount) || 0), 0)

  if (loading) return <div className={styles.loading}><div className="spinner" /></div>

  return (
    <div>
      {orders.length > 0 && (
        <div className={styles.soldSummary}>
          <CheckCircle size={18} color="#22c55e" />
          <span><strong>{orders.length}</strong> commandes finalisées</span>
          <span className="price" style={{ marginLeft: 'auto' }}>{formatCFA(total)} générés</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <CheckCircle size={40} color="#e8c0d0" />
          <p>Aucune vente finalisée pour l'instant</p>
        </div>
      ) : (
        orders.map(order => {
          const st    = STATUS_CONFIG[order.status] || STATUS_CONFIG.delivered
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
                    <strong>{order.customer_name}</strong>
                    <span>{date}</span>
                  </div>
                </div>
                <div className={styles.orderRight}>
                  <span className={styles.statusBadge} style={{ color: st.color, background: st.bg }}>
                    {st.label}
                  </span>
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
                          <span className={styles.itemShop}>{item.shop}</span>
                        </div>
                        <span className={styles.itemQty}>×{item.quantity}</span>
                        <span className="price">{formatCFA(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Main AdminHome
// ─────────────────────────────────────────────
export default function AdminHome({ defaultTab = 'orders' }) {
  const [tab, setTab] = useState(defaultTab)
  const [stats, setStats] = useState({ products: 0, orders: 0, sold: 0, revenue: 0 })

  useEffect(() => {
    const loadStats = async () => {
      const [prodRes, orderRes, soldRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).not('status', 'in', '("delivered","paid","picked_up","cancelled")'),
        supabase.from('orders').select('total_amount').in('status', ['delivered', 'paid', 'picked_up']),
      ])
      const revenue = (soldRes.data || []).reduce((s, o) => s + (Number(o.total_amount) || 0), 0)
      setStats({
        products: prodRes.count || 0,
        orders:   orderRes.count || 0,
        sold:     (soldRes.data || []).length,
        revenue,
      })
    }
    loadStats()
  }, [tab])

  const TABS = [
    { id: 'orders',   label: '🛍️ Commandes',  badge: stats.orders },
    { id: 'sold',     label: '✅ Vendus / Livrés' },
    { id: 'products', label: '📦 Produits' },
  ]

  return (
    <main className="page-layout">
      <div className="container" style={{ padding: '24px 20px' }}>

        {/* Header */}
        <div className={styles.adminHeader}>
          <div>
            <h1 className={styles.adminTitle}>Tableau de bord</h1>
            <p className={styles.adminSub}>Administration BagStyle</p>
          </div>
          <span className={styles.adminBadge}>👑 Admin</span>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <StatCard icon={Package}      label="Produits"          value={stats.products} color="#d4537e" />
          <StatCard icon={ShoppingBag}  label="Commandes actives" value={stats.orders}   color="#f59e0b" />
          <StatCard icon={CheckCircle}  label="Vendus / Livrés"   value={stats.sold}     color="#22c55e" />
          <StatCard icon={TrendingUp}   label="Chiffre d'affaires" value={formatCFA(stats.revenue)} color="#8b5cf6" />
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.badge > 0 && <span className={styles.tabBadge}>{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={styles.tabContent}>
          {tab === 'orders'   && <OrdersTab />}
          {tab === 'sold'     && <SoldTab />}
          {tab === 'products' && <ProductsTab />}
        </div>

      </div>
    </main>
  )
}
