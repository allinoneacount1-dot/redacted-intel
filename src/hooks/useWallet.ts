import { useState, useEffect, useCallback } from 'react';

// Extend window for wallet providers
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (opts?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
      on: (event: string, callback: () => void) => void;
      removeAllListeners: (event: string) => void;
      publicKey: { toString: () => string } | null;
    };
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeAllListeners: (event: string) => void;
    };
  }
}

export type WalletType = 'phantom' | 'metamask';

interface WalletState {
  address: string | null;
  balance: string | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  walletType: WalletType | null;
}

interface UseWalletReturn extends WalletState {
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => void;
  isPhantomAvailable: boolean;
  isMetaMaskAvailable: boolean;
}

const STORAGE_KEY = 'wallet-connection';

function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function useWallet(): UseWalletReturn {
  const [state, setState] = useState<WalletState>({
    address: null,
    balance: null,
    connected: false,
    connecting: false,
    error: null,
    walletType: null,
  });

  const isPhantomAvailable = typeof window !== 'undefined' && !!window.solana?.isPhantom;
  const isMetaMaskAvailable = typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;

  // Auto-connect from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { walletType } = JSON.parse(stored) as { walletType: WalletType };
        if (walletType === 'phantom' && isPhantomAvailable) {
          // Try silent connect (only if trusted)
          window.solana
            ?.connect({ onlyIfTrusted: true })
            .then((resp) => {
              setState({
                address: resp.publicKey.toString(),
                balance: null,
                connected: true,
                connecting: false,
                error: null,
                walletType: 'phantom',
              });
            })
            .catch(() => {
              // User hasn't previously approved, do nothing
            });
        } else if (walletType === 'metamask' && isMetaMaskAvailable) {
          // Check if already connected
          window.ethereum
            ?.request({ method: 'eth_accounts' })
            .then((accounts) => {
              const accs = accounts as string[];
              if (accs.length > 0) {
                setState({
                  address: accs[0],
                  balance: null,
                  connected: true,
                  connecting: false,
                  error: null,
                  walletType: 'metamask',
                });
              }
            })
            .catch(() => {});
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const connect = useCallback(
    async (walletType: WalletType) => {
      setState((prev) => ({ ...prev, connecting: true, error: null }));

      try {
        if (walletType === 'phantom') {
          if (!window.solana) {
            throw new Error('Phantom wallet not detected. Install phantom.app');
          }
          const resp = await window.solana.connect();
          const address = resp.publicKey.toString();

          localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletType: 'phantom' }));

          setState({
            address,
            balance: null,
            connected: true,
            connecting: false,
            error: null,
            walletType: 'phantom',
          });
        } else if (walletType === 'metamask') {
          if (!window.ethereum) {
            throw new Error('MetaMask not detected. Install metamask.io');
          }
          const accounts = (await window.ethereum.request({
            method: 'eth_requestAccounts',
          })) as string[];

          if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found. Unlock MetaMask.');
          }

          localStorage.setItem(STORAGE_KEY, JSON.stringify({ walletType: 'metamask' }));

          setState({
            address: accounts[0],
            balance: null,
            connected: true,
            connecting: false,
            error: null,
            walletType: 'metamask',
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Connection failed';
        setState((prev) => ({
          ...prev,
          connecting: false,
          error: message,
        }));
      }
    },
    []
  );

  const disconnect = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      if (state.walletType === 'phantom' && window.solana) {
        window.solana.disconnect().catch(() => {});
      }
    } catch {
      // Ignore
    }
    setState({
      address: null,
      balance: null,
      connected: false,
      connecting: false,
      error: null,
      walletType: null,
    });
  }, [state.walletType]);

  return {
    ...state,
    connect,
    disconnect,
    isPhantomAvailable,
    isMetaMaskAvailable,
  };
}

export { truncateAddress };
