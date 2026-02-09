'use client';

import * as React from 'react';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Billboard } from '@/lib/types';
import { getBillboards as getInitialBillboards } from '@/lib/data';
import { Loader2 } from 'lucide-react';

type BillboardContextType = {
  billboards: Billboard[];
  isLoading: boolean;
};

const BillboardContext = React.createContext<BillboardContextType | undefined>(undefined);

export function BillboardProvider({ children }: { children: React.ReactNode }) {
  const firestore = useFirestore();
  
  const billboardsCollectionRef = useMemoFirebase(() => collection(firestore, 'billboards'), [firestore]);
  const { data: billboards, isLoading: isLoadingBillboards, error } = useCollection<Billboard>(billboardsCollectionRef);

  const [isSeeding, setIsSeeding] = React.useState(false);

  React.useEffect(() => {
    if (firestore && billboards && billboards.length === 0 && !isLoadingBillboards && !isSeeding) {
      const seedData = async () => {
        setIsSeeding(true);
        console.log("No billboards found. Seeding initial data...");
        const initialBillboards = getInitialBillboards();
        const batch = writeBatch(firestore);
        initialBillboards.forEach((billboard) => {
          const { id, ...data } = billboard;
          const docRef = doc(firestore, 'billboards', id);
          batch.set(docRef, data);
        });
        await batch.commit();
        console.log("Seeding complete.");
        setIsSeeding(false);
      };
      seedData();
    }
  }, [billboards, isLoadingBillboards, firestore, isSeeding]);

  if (error) {
    console.error("Error fetching billboards:", error);
    // You could render an error state here
  }

  const isLoading = isLoadingBillboards || isSeeding;

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
