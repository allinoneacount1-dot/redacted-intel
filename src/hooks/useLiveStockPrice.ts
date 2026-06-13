import { useState, useEffect, useCallback, useRef } from "react";

// Stock symbols we support
export const STOCK_SYMBOLS = [
  "AAPL",
  "TSLA",
  "NVDA",
  "MSFT",
  "GOOGL",
  "AMZN",
  "META",
  "AMD",
  "JPM",
  "XOM",
] as const;

export type StockSymbol = (typeof STOCK_SYMBOLS)[number];

export interface StockData {
  symbol: string;
  price: number;
  change24h: number;
  prevClose: number;
}

export interface UseLiveStockPriceReturn {
  prices: Record<string, StockData>;
  lastUpdated: Date | null;
  isLive: boolean;
  refresh: () => void;
}

const REFRESH_INTERVAL = 60_000; // 60 seconds
const API_URL = "/api/stocks";

export function useLiveStockPrice(): UseLiveStockPriceReturn {
  const [prices, setPrices] = useState<Record<string, StockData>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.stocks) {
        setPrices(data.stocks);
        setLastUpdated(new Date());
        setIsLive(true);
      }
    } catch {
      // Silently fail — stocks are secondary to crypto
      setIsLive(false);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchPrices();
  }, [fetchPrices]);

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchPrices]);

  return { prices, lastUpdated, isLive, refresh };
}
