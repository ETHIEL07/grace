import { useState, useEffect, useRef } from 'react'
import { Package, Edit2, Upload, Save, X, Search, Loader } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { formatCFA } from '@/lib/mockData'
import toast from 'react-hot-toast'
import styles from './AdminHome.module.css'

function EditProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name:        product.name || '',
    price:       product.price || '',
    old_price:   product.old_price || '',
    image_url:   product.image_url || '',
    is_featured: product.is_featured || false,
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [preview, setPreview]     = useState(product.image_url || '')
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
      toast.success('Image mise à jour ✅')
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
                {uploading ? 'Upload...' : 'Changer la photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFileUpload} />
              <span className={styles.orText}>ou URL directe :</span>
              <input
                type="url"
                placeholder="https://..."
                value={form.image_url}
                onChange={(e) => { set('image_url')(e); setPreview(e.target.value) }}
              />
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.fieldGroup} style={{ gridColumn: '1/-1' }}>
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

export default function AdminHome() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [editing, setEditing]     = useState(null)
  const [catFilter, setCatFilter] = useState('all')

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('name')
    if (!error && data) setProducts(data)
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const cats = ['all', ...new Set(products.map(p => p.categories?.name).filter(Boolean))]

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter === 'all' || p.categories?.name === catFilter
    return matchSearch && matchCat
  })

  return (
    <main className="page-layout">
      <div className="container" style={{ padding: '24px 20px' }}>

        <div className={styles.adminHeader}>
          <div>
            <h1 className={styles.adminTitle}>Produits</h1>
            <p className={styles.adminSub}>{products.length} articles dans la boutique</p>
          </div>
          <span className={styles.adminBadge}>👑 Admin</span>
        </div>

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
          <span className={styles.count}>{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {cats.length > 1 && (
          <div className={styles.filterRow} style={{ marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            {cats.map(c => (
              <button
                key={c}
                className={`${styles.filterBtn} ${catFilter === c ? styles.filterActive : ''}`}
                onClick={() => setCatFilter(c)}
              >
                {c === 'all' ? 'Tous' : c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className={styles.loading}><div className="spinner" /></div>
        ) : (
          <div className={styles.productsTable}>
            <div className={styles.tableHeader}>
              <span>Produit</span>
              <span>Catégorie</span>
              <span>Prix</span>
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
                  <div className={styles.productName}>{p.name}</div>
                </div>
                <div className={styles.productCat}>{p.categories?.name || '—'}</div>
                <div>
                  <span className="price">{formatCFA(p.price)}</span>
                  {p.old_price && <span className="price-old" style={{ fontSize: 11, marginLeft: 4 }}>{formatCFA(p.old_price)}</span>}
                </div>
                <div>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditing(p)}>
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
        )}

        {editing && (
          <EditProductModal
            product={editing}
            onClose={() => setEditing(null)}
            onSaved={fetchProducts}
          />
        )}
      </div>
    </main>
  )
}