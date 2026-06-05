// ═══════════════════════════════════════════════════════════════
// MOCK DATA — BagStyle Abidjan
// Prix en FCFA
// ═══════════════════════════════════════════════════════════════

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Velours côtelé',  slug: 'velours',      emoji: '🎀' },
  { id: 2, name: 'Raphia / Osier',  slug: 'raphia',       emoji: '🧺' },
  { id: 3, name: 'Mini sacs',       slug: 'mini',         emoji: '👜' },
  { id: 4, name: 'Brodés',          slug: 'brode',        emoji: '🌸' },
  { id: 5, name: 'Bandoulière',     slug: 'bandouliere',  emoji: '💜' },
  { id: 6, name: 'Fleurs & Nature', slug: 'fleurs',       emoji: '🌼' },
  { id: 7, name: 'Cuir & Simili',   slug: 'cuir',         emoji: '🤎' },
  { id: 8, name: 'Crochet',         slug: 'crochet',      emoji: '🧶' },
  { id: 9, name: 'Wax & Tissu',     slug: 'wax',          emoji: '🌺' },
  { id: 10, name: 'Tote bags',      slug: 'tote',         emoji: '🛍️' },
]

export const MOCK_SHOPS = [
  { id: 1, name: 'LittleBagStudio', slug: 'littlebagstudio', emoji: '🎀', products: 234, rating: 4.9, description: 'Sacs en velours côtelé personnalisés faits main' },
  { id: 2, name: 'BohoCharm',       slug: 'bohocharm',       emoji: '🌿', products: 189, rating: 4.8, description: 'Créations bohème en raphia et osier naturel' },
  { id: 3, name: 'FloralBags',      slug: 'floralbags',      emoji: '🌸', products: 312, rating: 4.7, description: 'Sacs ornés de fleurs et broderies colorées' },
  { id: 4, name: 'PastelCraft',     slug: 'pastelcraft',     emoji: '✨', products: 97,  rating: 5.0, description: "L'artisanat pastel pour les petites princesses" },
  { id: 5, name: 'AbidjanTrends',   slug: 'abidjantrends',   emoji: '🌺', products: 156, rating: 4.8, description: 'Mode ivoirienne : wax, tie-dye, tissus locaux' },
  { id: 6, name: 'CrochetLove',     slug: 'crochetlove',     emoji: '🧶', products: 88,  rating: 4.9, description: 'Sacs crochet artisanaux colorés et tendance' },
  { id: 7, name: 'LuxeLeather',     slug: 'luxeleather',     emoji: '🤎', products: 74,  rating: 4.7, description: 'Maroquinerie haut de gamme simili cuir' },
  { id: 8, name: 'NaturaBag',       slug: 'naturabag',       emoji: '🌿', products: 203, rating: 4.8, description: 'Sacs éco-responsables matériaux naturels' },
]

export const MOCK_PRODUCTS = [
  // ── VELOURS ──────────────────────────────────────────────────
  {
    id: 1, shop_id: 1, category_id: 1,
    name: 'Sac velours côtelé prénom Olivia',
    slug: 'sac-velours-olivia', price: 8500,
    rating: 4.9, reviews_count: 782,
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
    tags: ['personnalisé', 'velours', 'rose'], is_featured: true, is_new: false,
    shop: { name: 'LittleBagStudio' },
  },
  {
    id: 2, shop_id: 4, category_id: 1,
    name: 'Bandoulière velours côtelé Grace',
    slug: 'bandouliere-velours-grace', price: 18000,
    rating: 5.0, reviews_count: 5200,
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
    tags: ['velours', 'personnalisé', 'top'], is_featured: true, is_new: false,
    shop: { name: 'PastelCraft' },
  },
  {
    id: 3, shop_id: 1, category_id: 1,
    name: 'Mini sac velours lilas Lola',
    slug: 'mini-velours-lilas', price: 7200,
    rating: 4.8, reviews_count: 341,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    tags: ['velours', 'lilas', 'mini', 'pastel'], is_featured: false, is_new: true,
    shop: { name: 'LittleBagStudio' },
  },

  // ── RAPHIA / OSIER ───────────────────────────────────────────
  {
    id: 4, shop_id: 2, category_id: 2,
    name: 'Sac osier personnalisé avec fleurs',
    slug: 'sac-osier-fleurs', price: 12000,
    rating: 4.8, reviews_count: 304,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    tags: ['raphia', 'fleurs', 'nature'], is_featured: true, is_new: false,
    shop: { name: 'BohoCharm' },
  },
  {
    id: 5, shop_id: 8, category_id: 2,
    name: 'Grand cabas raphia naturel',
    slug: 'cabas-raphia-naturel', price: 9500,
    rating: 4.7, reviews_count: 198,
    image_url: 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=400&h=400&fit=crop',
    tags: ['raphia', 'cabas', 'naturel', 'grand'], is_featured: false, is_new: false,
    shop: { name: 'NaturaBag' },
  },
  {
    id: 6, shop_id: 8, category_id: 2,
    name: 'Panier osier bohème Amara',
    slug: 'panier-osier-boheme', price: 14500,
    rating: 4.9, reviews_count: 87,
    image_url: 'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=400&h=400&fit=crop',
    tags: ['osier', 'bohème', 'panier'], is_featured: false, is_new: true,
    shop: { name: 'NaturaBag' },
  },

  // ── MINI SACS ────────────────────────────────────────────────
  {
    id: 7, shop_id: 1, category_id: 3,
    name: 'Mini sac à main brodé Sofia',
    slug: 'mini-sac-sofia', price: 9500,
    rating: 4.6, reviews_count: 210,
    image_url: 'https://images.unsplash.com/photo-1614179818511-7b2a16c7aa40?w=400&h=400&fit=crop',
    tags: ['mini', 'brodé', 'mignon'], is_featured: false, is_new: true,
    shop: { name: 'LittleBagStudio' },
  },
  {
    id: 8, shop_id: 4, category_id: 3,
    name: 'Mini pochette pastel soirée',
    slug: 'mini-pochette-pastel', price: 6500,
    rating: 4.8, reviews_count: 155,
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
    tags: ['mini', 'pastel', 'soirée', 'pochette'], is_featured: false, is_new: false,
    shop: { name: 'PastelCraft' },
  },
  {
    id: 9, shop_id: 6, category_id: 3,
    name: 'Mini sac crochet multicolore',
    slug: 'mini-crochet-multi', price: 8000,
    rating: 4.9, reviews_count: 426,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    tags: ['mini', 'crochet', 'coloré'], is_featured: true, is_new: false,
    shop: { name: 'CrochetLove' },
  },

  // ── BRODÉS ───────────────────────────────────────────────────
  {
    id: 10, shop_id: 2, category_id: 4,
    name: 'Sac brodé fleurs pastel Rose',
    slug: 'sac-brode-rose', price: 13500,
    rating: 4.9, reviews_count: 150,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    tags: ['brodé', 'fleurs', 'pastel'], is_featured: false, is_new: false,
    shop: { name: 'BohoCharm' },
  },
  {
    id: 11, shop_id: 3, category_id: 4,
    name: 'Sac brodé prénom Fatou étoiles',
    slug: 'sac-brode-fatou', price: 15000,
    rating: 4.9, reviews_count: 632,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    tags: ['brodé', 'prénom', 'étoiles', 'personnalisé'], is_featured: true, is_new: false,
    shop: { name: 'FloralBags' },
  },
  {
    id: 12, shop_id: 1, category_id: 4,
    name: 'Sac brodé papillons colorés',
    slug: 'sac-brode-papillons', price: 11500,
    rating: 4.7, reviews_count: 289,
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
    tags: ['brodé', 'papillons', 'coloré'], is_featured: false, is_new: true,
    shop: { name: 'LittleBagStudio' },
  },

  // ── BANDOULIÈRE ──────────────────────────────────────────────
  {
    id: 13, shop_id: 3, category_id: 5,
    name: 'Sac bandoulière Chloé motifs fleuris',
    slug: 'sac-bandouliere-chloe', price: 15500,
    rating: 4.7, reviews_count: 84,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    tags: ['bandoulière', 'fleurs', 'cadeau'], is_featured: false, is_new: true,
    shop: { name: 'FloralBags' },
  },
  {
    id: 14, shop_id: 7, category_id: 5,
    name: 'Bandoulière cuir camel Nadia',
    slug: 'bandouliere-cuir-camel', price: 22000,
    rating: 4.8, reviews_count: 174,
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
    tags: ['bandoulière', 'cuir', 'camel', 'classique'], is_featured: true, is_new: false,
    shop: { name: 'LuxeLeather' },
  },
  {
    id: 15, shop_id: 5, category_id: 5,
    name: 'Bandoulière wax africain Koua',
    slug: 'bandouliere-wax-koua', price: 17000,
    rating: 5.0, reviews_count: 389,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    tags: ['bandoulière', 'wax', 'africain', 'coloré'], is_featured: true, is_new: false,
    shop: { name: 'AbidjanTrends' },
  },

  // ── FLEURS & NATURE ──────────────────────────────────────────
  {
    id: 16, shop_id: 3, category_id: 6,
    name: 'Tote fleuri Jardin secret',
    slug: 'tote-fleuri-jardin', price: 10500,
    rating: 4.8, reviews_count: 521,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    tags: ['fleurs', 'tote', 'jardin', 'nature'], is_featured: true, is_new: false,
    shop: { name: 'FloralBags' },
  },
  {
    id: 17, shop_id: 8, category_id: 6,
    name: 'Sac fleurs séchées Bohème',
    slug: 'sac-fleurs-sechees', price: 19000,
    rating: 4.9, reviews_count: 143,
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
    tags: ['fleurs', 'séchées', 'bohème', 'nature'], is_featured: false, is_new: true,
    shop: { name: 'NaturaBag' },
  },

  // ── CUIR & SIMILI ────────────────────────────────────────────
  {
    id: 18, shop_id: 7, category_id: 7,
    name: 'Sac cabas cuir noir élégant',
    slug: 'sac-cabas-cuir-noir', price: 28000,
    rating: 4.7, reviews_count: 95,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    tags: ['cuir', 'noir', 'élégant', 'cabas'], is_featured: false, is_new: false,
    shop: { name: 'LuxeLeather' },
  },
  {
    id: 19, shop_id: 7, category_id: 7,
    name: 'Pochette cuir cognac Stella',
    slug: 'pochette-cuir-cognac', price: 12500,
    rating: 4.8, reviews_count: 231,
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
    tags: ['cuir', 'cognac', 'pochette', 'chic'], is_featured: false, is_new: false,
    shop: { name: 'LuxeLeather' },
  },

  // ── CROCHET ──────────────────────────────────────────────────
  {
    id: 20, shop_id: 6, category_id: 8,
    name: 'Sac crochet bohème beige',
    slug: 'sac-crochet-beige', price: 11000,
    rating: 4.8, reviews_count: 312,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    tags: ['crochet', 'bohème', 'beige', 'fait-main'], is_featured: true, is_new: false,
    shop: { name: 'CrochetLove' },
  },
  {
    id: 21, shop_id: 6, category_id: 8,
    name: 'Sac filet crochet coloré',
    slug: 'sac-filet-crochet', price: 8500,
    rating: 4.9, reviews_count: 487,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    tags: ['crochet', 'filet', 'coloré', 'plage'], is_featured: false, is_new: true,
    shop: { name: 'CrochetLove' },
  },
  {
    id: 22, shop_id: 6, category_id: 8,
    name: 'Sac crochet pompons Maeva',
    slug: 'sac-crochet-pompons', price: 13000,
    rating: 4.7, reviews_count: 178,
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
    tags: ['crochet', 'pompons', 'fun', 'coloré'], is_featured: false, is_new: false,
    shop: { name: 'CrochetLove' },
  },

  // ── WAX & TISSU ──────────────────────────────────────────────
  {
    id: 23, shop_id: 5, category_id: 9,
    name: 'Sac wax Abidjan Chic doré',
    slug: 'sac-wax-abidjan', price: 16500,
    rating: 5.0, reviews_count: 892,
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
    tags: ['wax', 'africain', 'doré', 'chic'], is_featured: true, is_new: false,
    shop: { name: 'AbidjanTrends' },
  },
  {
    id: 24, shop_id: 5, category_id: 9,
    name: 'Tote wax imprimé savane',
    slug: 'tote-wax-savane', price: 9000,
    rating: 4.8, reviews_count: 276,
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    tags: ['wax', 'tote', 'savane', 'imprimé'], is_featured: false, is_new: true,
    shop: { name: 'AbidjanTrends' },
  },
  {
    id: 25, shop_id: 5, category_id: 9,
    name: 'Pochette tissu batik Awa',
    slug: 'pochette-batik-awa', price: 7500,
    rating: 4.7, reviews_count: 134,
    image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    tags: ['batik', 'tissu', 'pochette', 'africain'], is_featured: false, is_new: false,
    shop: { name: 'AbidjanTrends' },
  },

  // ── TOTE BAGS ────────────────────────────────────────────────
  {
    id: 26, shop_id: 8, category_id: 10,
    name: 'Tote coton bio message positif',
    slug: 'tote-coton-bio', price: 5500,
    rating: 4.6, reviews_count: 703,
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    tags: ['tote', 'coton', 'bio', 'éco'], is_featured: false, is_new: false,
    shop: { name: 'NaturaBag' },
  },
  {
    id: 27, shop_id: 3, category_id: 10,
    name: 'Tote floral brodé prénom',
    slug: 'tote-floral-prenom', price: 12000,
    rating: 4.9, reviews_count: 341,
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=400&fit=crop',
    tags: ['tote', 'floral', 'brodé', 'prénom'], is_featured: true, is_new: true,
    shop: { name: 'FloralBags' },
  },
  {
    id: 28, shop_id: 2, category_id: 10,
    name: 'Grand tote raphia naturel Noa',
    slug: 'grand-tote-raphia', price: 10000,
    rating: 4.8, reviews_count: 195,
    image_url: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop',
    tags: ['tote', 'raphia', 'grand', 'naturel'], is_featured: false, is_new: false,
    shop: { name: 'BohoCharm' },
  },
]

export const formatCFA = (price) =>
  new Intl.NumberFormat('fr-FR').format(price ?? 0) + ' FCFA'

export const PRICE_MIN = 5000
export const PRICE_MAX = 30000