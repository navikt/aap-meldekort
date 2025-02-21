'use client';

import { useEffect, useState } from 'react';

export function useSkjermBredde(): { erLitenSkjerm: boolean } {
  const [bredde, setBredde] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBredde(window.innerWidth);

      function handleResize() {
        setBredde(window.innerWidth);
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return { erLitenSkjerm: bredde !== null ? bredde < 768 : false };
}
