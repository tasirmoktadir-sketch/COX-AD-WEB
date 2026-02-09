'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  
  // New state for a more robust admin check
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // This effect runs when user state or firestore instance changes.
    if (isUserLoading) {
      return; // Wait for user authentication to be resolved.
    }

    if (!user) {
      // If there's no user after loading, they are not authenticated.
      router.replace('/login');
      return;
    }

    // User is authenticated, now check for admin role with a direct getDoc call.
    const checkAdminStatus = async () => {
      setIsCheckingAdmin(true);
      try {
        const adminRoleRef = doc(firestore, 'roles_admin', user.uid);
        const docSnap = await getDoc(adminRoleRef);

        if (docSnap.exists()) {
          // Document exists, user is an admin.
          setIsAdmin(true);
        } else {
          // Document does not exist, user is not an admin.
          setIsAdmin(false);
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
            duration: 20000,
          });
          router.replace('/');
        }
      } catch (error: any) {
        // An error occurred, likely a permissions issue from security rules.
        setIsAdmin(false);
        toast({
          variant: 'destructive',
          title: 'Permission Error',
          description: `Failed to check admin status due to a security rule. Please ensure you have permission to read your own document in the /roles_admin collection. (Error: ${error.message})`,
          duration: 10000,
        });
        router.replace('/');
      } finally {
        setIsCheckingAdmin(false);
        setAuthChecked(true);
      }
    };

    checkAdminStatus();

  }, [user, isUserLoading, firestore, router]);

  // Show a loader while the initial user check or the admin status check is in progress.
  if (isUserLoading || isCheckingAdmin || !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  // After all checks are complete, if the user is a confirmed admin, show the dashboard.
  if (user && isAdmin) {
    return <>{children}</>;
  }

  // If they are not an admin, the useEffect will have triggered a redirect.
  // We return a loader here to prevent any brief flash of content.
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-16 w-16 animate-spin" />
    </div>
  );
}
