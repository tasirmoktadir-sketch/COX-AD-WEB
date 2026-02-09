"use client"

import { useState, useEffect } from 'react';

export function Footer() {
  const [currentYear, setCurrentYear] = useState<string | number>('');

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {currentYear} Cox's Ad Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
