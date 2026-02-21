'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WavePreloader from '@/components/WavePreloader';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdmin = !!localStorage.getItem('admin_token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin');
      if (isAdmin) {
        router.push('/admin/login');
        return;
      }
    }
    router.push('/login');
  }, [router]);

  return (
    <WavePreloader fullScreen />
  );
}
