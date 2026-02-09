'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const adminRoleRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'roles_admin', user.uid);
  }, [firestore, user]);

  const { data: isAdminDoc, isLoading: isAdminLoading } = useDoc(adminRoleRef);
  const isAdmin = !!isAdminDoc;

  useEffect(() => {
    const isAuthCheckComplete = !isUserLoading && !isAdminLoading;

    if (isAuthCheckComplete) {
      if (!user) {
        // Not authenticated, redirect to login
        router.replace('/login');
      } else if (!isAdmin) {
        // Authenticated but not an admin, redirect home with a message
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: 'You do not have permission to access the admin dashboard.',
        });
        router.replace('/');
      }
    }
  }, [user, isAdmin, isUserLoading, isAdminLoading, router]);

  // While checking auth or admin status, show a loader.
  // The useEffect will handle redirection. If we get past this, the user is an authorized admin.
  if (isUserLoading || isAdminLoading || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
