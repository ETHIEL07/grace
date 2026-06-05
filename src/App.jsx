import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

import AuthCallback from '@/pages/AuthCallback';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { isAdmin } from '@/lib/admin';

import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import AdminBottomNav from '@/components/layout/AdminBottomNav';
import Footer from '@/components/layout/Footer';

import Home from '@/pages/Home';
import AdminHome from '@/pages/AdminHome';
import AdminOrders from '@/pages/AdminOrders';
import AdminSold from '@/pages/AdminSold';
import AdminProducts from '@/pages/AdminProducts';
import Search from '@/pages/Search';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Auth from '@/pages/Auth';
import Favorites from '@/pages/Favorites';
import Boutiques from '@/pages/Boutiques';
import Compte from '@/pages/compte';
import Promotions from '@/pages/Promotions';

const AUTH_PATHS = ['/connexion', '/inscription', '/auth/callback'];

function Loading() {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif',
      color: '#666',
    }}>
      Chargement...
    </div>
  );
}

// Garde : redirige vers /connexion si non connecté
// adminOnly=true → redirige les non-admins vers /accueil
function PrivateRoute({ children, adminOnly = false }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUserLocal] = useState(null);
  const setUser = useAuthStore(s => s.setUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserLocal(session?.user || null);
      if (session) setUser(session.user);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserLocal(session?.user || null);
      if (session) setUser(session.user);
      else setUser(null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (isLoading) return <Loading />;
  if (!user) return <Navigate to="/connexion" replace />;
  if (adminOnly && !isAdmin(user)) return <Navigate to="/accueil" replace />;
  return children;
}

function AppLayout() {
  const location = useLocation();
  const user = useAuthStore(s => s.user);
  const [currentUser, setCurrentUser] = useState(null);
  const isAuthPage = AUTH_PATHS.includes(location.pathname);

  // Récupérer l'utilisateur courant pour choisir la nav
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setCurrentUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const userIsAdmin = isAdmin(currentUser || user);

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Navigate to="/connexion" replace />} />

        {/* Pages publiques */}
        <Route path="/connexion"     element={<Auth />} />
        <Route path="/inscription"   element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Pages admin (réservées) */}
        <Route path="/accueil"   element={
          <PrivateRoute>
            {/* L'admin va sur AdminHome, le user sur Home */}
            <AdminAwareHome />
          </PrivateRoute>
        } />
        <Route path="/commandes" element={<PrivateRoute adminOnly><AdminOrders /></PrivateRoute>} />
        <Route path="/vendus"    element={<PrivateRoute adminOnly><AdminSold /></PrivateRoute>} />
        <Route path="/produits"  element={<PrivateRoute adminOnly><AdminProducts /></PrivateRoute>} />

        {/* Pages utilisateur */}
        <Route path="/search"         element={<PrivateRoute><Search /></PrivateRoute>} />
        <Route path="/produit/:id"    element={<PrivateRoute><ProductDetail /></PrivateRoute>} />
        <Route path="/panier"         element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/boutiques"      element={<PrivateRoute><Boutiques /></PrivateRoute>} />
        <Route path="/boutique/:slug" element={<PrivateRoute><Boutiques /></PrivateRoute>} />
        <Route path="/promotions"     element={<PrivateRoute><Promotions /></PrivateRoute>} />
        <Route path="/favoris"        element={<PrivateRoute><Favorites /></PrivateRoute>} />
        <Route path="/compte"         element={<PrivateRoute><Compte /></PrivateRoute>} />
      </Routes>

      {!isAuthPage && <Footer />}
      {!isAuthPage && (userIsAdmin ? <AdminBottomNav /> : <BottomNav />)}

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px', borderRadius: '12px' },
          success: { iconTheme: { primary: '#d4537e', secondary: '#fff' } },
        }}
      />
    </>
  );
}

// Composant qui redirige /accueil selon le rôle
function AdminAwareHome() {
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAdminUser(isAdmin(session?.user));
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  );
  return adminUser ? <AdminHome /> : <Home />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
