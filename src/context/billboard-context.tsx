'use client';

import * as React from 'react';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Billboard } from '@/lib/types';
import { Loader2 } from 'lucide-react';

type BillboardContextType = {
  billboards: Billboard[];
  isLoading: boolean;
};

const BillboardContext = React.createContext<BillboardContextType | undefined>(undefined);

export function BillboardProvider({ children }: { children: React.ReactNode }) {
  const firestore = useFirestore();
  
  const billboardsCollectionRef = useMemoFirebase(() => collection(firestore, 'billboards'), [firestore]);
  const { data: billboards, isLoading, error } = useCollection<Billboard>(billboardsCollectionRef);

  if (error) {
    // It's good practice to log the error or display an error message
    console.error("Error fetching billboards:", error);
  }

  // The provider will now show a loader only while the initial data is being fetched.
  // Once fetched, it will render the children with the billboard data (or an empty array).
  return (
    <BillboardContext.Provider value={{ billboards: billboards || [], isLoading }}>
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin" />
        </div>
      ) : (
        children
      )}
    </BillboardContext.Provider>
  );
}

export function useBillboards() {
  const context = React.useContext(BillboardContext);
  if (context === undefined) {
    throw new Error('useBillboards must be used within a BillboardProvider');
  }
  return context;
}
