import { useState, useEffect, useCallback, useRef } from 'react';

const COINGECKO_API =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true';

const REFRESH_INTERVAL = 60_000; // 60 seconds

export interface LivePriceData {
  price: number;
  change24h: number;
}

export interface LivePrices {
  [asset: string]: LivePriceData;
}

export interface UseLivePriceReturn {
  prices: LivePrices;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isLive: boolean;
}

// Fallback mock data
const MOCK_PRICES: LivePrices = {
  bitcoin: { price: 68400.0, change24h: -3.93 },
  ethereum: { price: 3120.0, change24h: -9.57 },
  solana: { price: 148.0, change24h: 5.42 },
};

// Asset symbol → CoinGecko ID mapping
const SYMBOL_TO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
};

export function useLivePrice(): UseLivePriceReturn {
  const [prices, setPrices] = useState<LivePrices>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const response = await fetch(COINGECKO_API);
      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }
      const data = await response.json();

      const formatted: LivePrices = {};
      for (const [id, info] of Object.entries(data)) {
        const usdInfo = info as { usd: number; usd_24h_change?: number };
        formatted[id] = {
          price: usdInfo.usd,
          change24h: usdInfo.usd_24h_change ?? 0,
        };
      }

      setPrices(formatted);
      setLastUpdated(new Date());
      setError(null);
      setIsLive(true);
    } catch (err) {
      console.warn('[useLivePrice] Falling back to mock data:', err);
      // Fall back to mock data
      setPrices(MOCK_PRICES);
      setError(err instanceof Error ? err.message : 'Failed to fetch live prices');
      setIsLive(false);
      // Still update lastUpdated so UI shows we attempted
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchPrices();

    // Set up auto-refresh
    intervalRef.current = setInterval(fetchPrices, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchPrices]);

  return { prices, loading, error, lastUpdated, isLive };
}

// Helper: get live price for a given asset symbol (BTC, ETH, SOL)
export function getLivePriceForSymbol(
  prices: LivePrices,
  symbol: string
): LivePriceData | null {
  const id = SYMBOL_TO_ID[symbol];
  if (id && prices[id]) {
    return prices[id];
  }
  return null;
}
