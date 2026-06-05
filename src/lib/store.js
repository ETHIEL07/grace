import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Cart store ────────────────────────────────────────────────────
// BUGFIX: Zustand persist ne peut pas sérialiser les getters ES6.
// On les remplace par des fonctions normales + sélecteurs externes.
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const items = get().items
        const existing = items.find(i => i.id === product.id)
        if (existing) {
          set({
            items: items.map(i =>
              i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
            )
          })
        } else {
          set({ items: [...items, { ...product, quantity }] })
        }
      },

      removeItem: (id) => set({ items: get().items.filter(i => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) return get().removeItem(id)
        set({ items: get().items.map(i => i.id === id ? { ...i, quantity } : i) })
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: 'bagstyle-cart' }
  )
)

// Sélecteurs dérivés — utilisés dans les composants via useCartStore(selectXxx)
export const selectTotal = (s) =>
  s.items.reduce((sum, i) => sum + (Number(i.price) || 0) * i.quantity, 0)

export const selectCount = (s) =>
  s.items.reduce((sum, i) => sum + i.quantity, 0)

// ── Auth store ────────────────────────────────────────────────────
export const useAuthStore = create((set) => ({
  user: null,
  profile: null,
  loading: true,
  userLocation: null,          // { lat, lng, label }

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setUserLocation: (loc) => set({ userLocation: loc }),
  clear: () => set({ user: null, profile: null, userLocation: null }),
}))

// ── Favorites store ───────────────────────────────────────────────
export const useFavStore = create(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const ids = get().ids
        set({ ids: ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id] })
      },
      has: (id) => get().ids.includes(id),
    }),
    { name: 'bagstyle-favs' }
  )
)
