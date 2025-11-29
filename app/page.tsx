import { redirect } from 'next/navigation';

export default function Home() {
  // Redireciona para o dashboard (o middleware vai lidar com autenticação)
  redirect('/dashboard');
}