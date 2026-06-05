// Liste des emails administrateurs
// Ajouter/retirer des emails ici pour gérer les admins
export const ADMIN_EMAILS = [
  'amichiatehiel@gmail.com',
]

/**
 * Vérifie si un user Supabase est admin
 * @param {object|null} user - user de supabase.auth
 * @returns {boolean}
 */
export function isAdmin(user) {
  if (!user) return false
  return ADMIN_EMAILS.includes(user.email?.toLowerCase())
}
