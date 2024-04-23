'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next-intl/client';
import NonAuthLayout from '@components/layouts/NonAuthLayout';
import Loader from '@components/common/Loader';
import { useEffect } from 'react';

export default function Index(props) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  useEffect(() => {
    if (status === 'authenticated' && session.user) router.replace('/dashboard');
  }, [router, session?.user, status]);

  return (
    <NonAuthLayout>
      <Loader />
    </NonAuthLayout>
  );
}
