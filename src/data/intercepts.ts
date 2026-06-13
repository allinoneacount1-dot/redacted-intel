export interface Intercept {
  id: number;
  timestamp: string;
  line: string;
}

export const intercepts: readonly Intercept[] = [
  {
    id: 1,
    timestamp: "23:41:07",
    line: "\x1b[32m[INTERCEPT] Signal acquired — anomalous options flow detected in NVDA 0DTE chain. Volume spike 4.2σ above mean.\x1b[0m",
  },
  {
    id: 2,
    timestamp: "23:42:15",
    line: "\x1b[32m[INTERCEPT] Dark pool print: 45,000 shares PLTR @ $81.20. Block crossed on IEX. Buyer identity masked.\x1b[0m",
  },
  {
    id: 3,
    timestamp: "23:43:33",
    line: "\x1b[32m[INTERCEPT] Wire transfer flagged — $2.4M routed through 3 shell entities. Origin: Cayman Islands. Destination: Zürich.\x1b[0m",
  },
  {
    id: 4,
    timestamp: "23:44:58",
    line: "\x1b[32m[INTERCEPT] Encrypted comms intercepted. Frequency 14.275 MHz. Decryption ETA 6m 12s. Origin node: [REDACTED].\x1b[0m",
  },
  {
    id: 5,
    timestamp: "23:46:22",
    line: "\x1b[32m[INTERCEPT] Insider filing anomaly — CEO disposition of 12% holdings filed 47 minutes post-close. Pattern matches prior events.\x1b[0m",
  },
  {
    id: 6,
    timestamp: "23:47:41",
    line: "\x1b[32m[INTERCEPT] Satellite imagery update: cargo vessel deviated from planned route. Last known position 34.0522°N, 118.2437°W.\x1b[0m",
  },
  {
    id: 7,
    timestamp: "23:49:03",
    line: "\x1b[32m[INTERCEPT] Social sentiment divergence detected. Retail bullishness at 87% while institutional positioning net short. Contrarian signal active.\x1b[0m",
  },
  {
    id: 8,
    timestamp: "23:50:19",
    line: "\x1b[32m[INTERCEPT] Cross-border SWIFT message intercepted. Reference code: ORION-7. Contents partially encrypted. Flagging for analysis.\x1b[0m",
  },
] as const;
