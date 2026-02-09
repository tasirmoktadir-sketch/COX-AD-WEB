'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const adminRoleRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: isAdmin, isLoading: isAdminLoading } = useDoc(adminRoleRef);

  useEffect(() => {
    const isAuthCheckComplete = !isUserLoading && !isAdminLoading;

    if (isAuthCheckComplete) {
      if (!user || !isAdmin) {
        router.replace('/login');
      }
    }
  }, [user, isAdmin, isUserLoading, isAdminLoading, router]);

  if (isUserLoading || isAdminLoading || !user || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
