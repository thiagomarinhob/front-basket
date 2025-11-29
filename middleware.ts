import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/ligas',
  '/times',
  '/jogadores',
  '/jogos',
  '/categorias',
  '/analytics',
  '/configuracoes',
];

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Tenta obter o token dos cookies primeiro, depois do header
  const token = 
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');

  // Se a rota é protegida e não tem token, redireciona para login
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se já está autenticado e tenta acessar login, redireciona para dashboard
  if (isPublicRoute && token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Adiciona o token no header da requisição para Server Components
  if (token) {
    const response = NextResponse.next();
    response.headers.set('Authorization', `Bearer ${token}`);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};