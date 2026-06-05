// Page dédiée commandes actives (accessible via BottomNav admin)
// On réutilise AdminHome avec tab forcé sur 'orders'
import AdminHome from './AdminHome'
export default function AdminOrders() {
  return <AdminHome defaultTab="orders" />
}
