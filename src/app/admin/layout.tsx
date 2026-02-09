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
    // We only want to check for redirects after all loading is complete.
    const isAuthCheckComplete = !isUserLoading && !isAdminLoading;

    if (isAuthCheckComplete) {
      if (!user) {
        // If not logged in after checks, redirect to login.
        router.replace('/login');
      } else if (!isAdmin) {
        // If logged in but not an admin, show error and redirect home.
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: `Your account (UID: ${user.uid}) lacks admin privileges. Please verify the document at /roles_admin/${user.uid} in Firestore.`,
        });
        router.replace('/');
      }
    }
  }, [user, isAdmin, isUserLoading, isAdminLoading, router]);

  // While we are checking user auth OR admin role, show a loader.
  if (isUserLoading || isAdminLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  // After loading, if the user is a confirmed admin, show the dashboard.
  if (user && isAdmin) {
    return <>{children}</>;
  }

  // If they are not an admin, the useEffect above will trigger a redirect.
  // In the meantime, show a loader to prevent any content flashing.
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}
