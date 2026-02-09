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

  const { data: isAdminDoc, isLoading: isAdminLoading, error: isAdminError } = useDoc(adminRoleRef);
  const isAdmin = !!isAdminDoc;

  useEffect(() => {
    // We only want to check for redirects after all loading is complete.
    const isAuthCheckComplete = !isUserLoading && !isAdminLoading;

    if (isAuthCheckComplete) {
      if (!user) {
        // If not logged in after checks, redirect to login.
        router.replace('/login');
      } else if (isAdminError) {
          toast({
            variant: 'destructive',
            title: 'Permission Error',
            description: `A security rule is blocking access. Please check your Firestore rules for the /roles_admin collection. (Error: ${isAdminError.message})`,
            duration: 10000,
          });
          router.replace('/');
      }
      else if (!isAdmin) {
        // If logged in but not an admin, show error and redirect home.
        toast({
          variant: 'destructive',
          title: 'Access Denied: Not an Admin',
          description: (
            <div>
              <p>Your account is not configured as an administrator.</p>
              <p className="mt-2">Please double-check the following in your Firestore database:</p>
              <ul className="list-disc pl-5 mt-1 text-xs">
                <li>A collection named exactly <strong>roles_admin</strong> exists.</li>
                <li>Inside that collection, there is a document whose ID is exactly your User UID.</li>
              </ul>
              <p className="mt-2 text-xs font-mono bg-muted p-1 rounded">Your UID: {user.uid}</p>
            </div>
          ),
          duration: 20000, // Make it stay longer
        });
        router.replace('/');
      }
    }
  }, [user, isAdmin, isUserLoading, isAdminLoading, router, isAdminError]);

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
