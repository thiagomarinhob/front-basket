// Constantes da aplicação

export const APP_NAME = 'Basket Admin';

export const NAVIGATION_ITEMS = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    title: 'Ligas',
    href: '/ligas',
    icon: 'Trophy',
  },
  {
    title: 'Times',
    href: '/times',
    icon: 'Users',
  },
  {
    title: 'Jogadores',
    href: '/jogadores',
    icon: 'User',
  },
  {
    title: 'Jogos',
    href: '/jogos',
    icon: 'Calendar',
  },
  {
    title: 'Categorias',
    href: '/categorias',
    icon: 'Tag',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: 'BarChart3',
  },
  {
    title: 'Configurações',
    href: '/configuracoes',
    icon: 'Settings',
  },
] as const;

export const PROTECTED_ROUTES = [
  '/dashboard',
  '/ligas',
  '/times',
  '/jogadores',
  '/jogos',
  '/categorias',
  '/analytics',
  '/configuracoes',
];

export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];