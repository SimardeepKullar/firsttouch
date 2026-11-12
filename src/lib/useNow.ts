import { useEffect, useState } from 'react';

/** The current time, refreshed every 30 seconds so a card flips to "RSVPs closed" on its own. */
export function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  return now;
}