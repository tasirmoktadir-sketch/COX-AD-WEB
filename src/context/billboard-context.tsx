
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

  // Always render children. Components that need to can use the isLoading flag
  // to show their own loading states, preventing the whole app from unmounting.
  return (
    <BillboardContext.Provider value={{ billboards: billboards || [], isLoading }}>
      {children}
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
