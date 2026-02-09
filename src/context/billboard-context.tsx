'use client';

import * as React from 'react';
import type { Billboard } from '@/lib/types';
import { getBillboards } from '@/lib/data';

type BillboardContextType = {
  billboards: Billboard[];
  setBillboards: React.Dispatch<React.SetStateAction<Billboard[]>>;
};

const BillboardContext = React.createContext<BillboardContextType | undefined>(undefined);

export function BillboardProvider({ children }: { children: React.ReactNode }) {
  const [billboards, setBillboards] = React.useState<Billboard[]>(() => {
    const initialBillboards = getBillboards();
    return initialBillboards;
  });

  return (
    <BillboardContext.Provider value={{ billboards, setBillboards }}>
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
