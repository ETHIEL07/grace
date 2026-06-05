import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('❌ ENV Supabase manquant (.env)')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const signUp = (email, password, meta) =>
  supabase.auth.signUp({ email, password, options: { data: meta } })

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () => supabase.auth.signOut()

export const getSession = () => supabase.auth.getSession()

export const signInWithGoogle = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: { prompt: 'consent' },
    },
  })
}

export const db = {
  products: () => supabase.from('products'),
  categories: () => supabase.from('categories'),
  shops: () => supabase.from('shops'),
  orders: () => supabase.from('orders'),
  orderItems: () => supabase.from('order_items'),
  favorites: () => supabase.from('favorites'),
  reviews: () => supabase.from('reviews'),
  profiles: () => supabase.from('profiles'),
}

export const getProducts = async ({ category, featured, search, limit } = {}) => {
  try {
    let query = supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (featured) query = query.eq('is_featured', true)
    if (search)   query = query.ilike('name', `%${search}%`)
    if (limit)    query = query.limit(limit)

    const { data, error } = await query
    if (error || !data || data.length === 0) return null

    return data.map(p => ({
      ...p,
      shop: { name: p.shop_name || 'BagStyle' },
      reviews_count: p.reviews_count || 0,
      rating: p.rating || 4.8,
    }))
  } catch {
    return null
  }
}

export const storage = {
  products: supabase.storage.from('product-images'),
  shops: supabase.storage.from('shop-images'),

  uploadProductImage: async (file, path) => {
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true })
    if (error) throw error
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  },
}