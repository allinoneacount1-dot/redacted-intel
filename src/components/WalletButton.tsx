import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet, truncateAddress } from '../hooks/useWallet';

export default function WalletButton() {
  const { connected, connecting, address, error, connect, disconnect, isPhantomAvailable, isMetaMaskAvailable } =
    useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleCopyAddress = useCallback(() => {
    if (address) {
      navigator.clipboard.writeText(address).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  }, [address]);

  const handleConnect = useCallback(
    (walletType: 'phantom' | 'metamask') => {
      connect(walletType);
    },
    [connect]
  );

  const handleDisconnect = useCallback(() => {
    disconnect();
    setDropdownOpen(false);
  }, [disconnect]);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Connected state
  if (connected && address) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase px-4 py-1.5 border transition-colors duration-200 cursor-pointer"
          style={{
            borderColor: '#39FF6E',
            color: '#39FF6E',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#39FF6E';
            e.currentTarget.style.color = '#0C0C0C';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#39FF6E';
          }}
        >
          {truncateAddress(address)}
        </button>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              className="absolute right-0 top-full mt-2 w-48 z-50"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(57,255,110,0.15)',
              }}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <button
                onClick={handleCopyAddress}
                className="w-full text-left px-4 py-2.5 font-mono text-xs transition-colors duration-200 cursor-pointer"
                style={{ color: '#E9E4D8' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(57,255,110,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {copied ? '✓ COPIED' : 'COPY ADDRESS'}
              </button>
              <button
                onClick={handleDisconnect}
                className="w-full text-left px-4 py-2.5 font-mono text-xs transition-colors duration-200 cursor-pointer"
                style={{ color: '#D03A2B' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(208,58,43,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                DISCONNECT
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Disconnected state
  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen((prev) => !prev)}
        disabled={connecting}
        className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase px-4 py-1.5 border transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{
          borderColor: '#D03A2B',
          color: '#D03A2B',
        }}
        onMouseEnter={(e) => {
          if (!connecting) {
            e.currentTarget.style.backgroundColor = '#D03A2B';
            e.currentTarget.style.color = '#fff';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#D03A2B';
        }}
      >
        {connecting ? 'CONNECTING...' : 'CONNECT WALLET'}
      </button>

      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 w-56 z-50"
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid rgba(208,58,43,0.2)',
            }}
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
          >
            {isPhantomAvailable && (
              <button
                onClick={() => {
                  handleConnect('phantom');
                  setDropdownOpen(false);
                }}
                disabled={connecting}
                className="w-full text-left px-4 py-3 font-mono text-xs transition-colors duration-200 cursor-pointer disabled:opacity-40 flex items-center gap-3"
                style={{ color: '#E9E4D8' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(208,58,43,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ color: '#AB9FF2' }}>👻</span> PHANTOM
              </button>
            )}
            {isMetaMaskAvailable && (
              <button
                onClick={() => {
                  handleConnect('metamask');
                  setDropdownOpen(false);
                }}
                disabled={connecting}
                className="w-full text-left px-4 py-3 font-mono text-xs transition-colors duration-200 cursor-pointer disabled:opacity-40 flex items-center gap-3"
                style={{ color: '#E9E4D8' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(208,58,43,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ color: '#F6851B' }}>🦊</span> METAMASK
              </button>
            )}
            {!isPhantomAvailable && !isMetaMaskAvailable && (
              <div
                className="px-4 py-3 font-mono text-xs"
                style={{ color: 'rgba(233,228,216,0.4)' }}
              >
                No wallet detected. Install Phantom or MetaMask.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div
          className="absolute right-0 top-full mt-2 w-56 px-3 py-2 font-mono text-xs z-50"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid rgba(208,58,43,0.3)',
            color: '#D03A2B',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
