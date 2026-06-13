export type Outcome = "VERIFIED" | "BURNED" | "PENDING";

export interface Dossier {
  id: string;
  codeName: string;
  issuedAt: string;
  asset: string;
  issuePrice: number;
  currentPrice: number;
  changePct: number;
  confidence: number;
  outcome: Outcome;
  summary: string;
  redactedSummary: string;
  readersCount: number;
}

export const dossiers: readonly Dossier[] = [
  {
    id: "DSR-001",
    codeName: "SILENT VECTOR",
    issuedAt: "2025-01-14",
    asset: "NVDA",
    issuePrice: 128.5,
    currentPrice: 142.8,
    changePct: 11.13,
    confidence: 92,
    outcome: "VERIFIED",
    summary:
      "Long position on NVIDIA ahead of Q4 earnings. AI datacenter demand surge projected to exceed consensus estimates by 18%.",
    redactedSummary:
      "████████ position on ████ ahead of Q4 ███████. AI ██████████ demand surge projected to exceed ██████████ estimates by 18%.",
    readersCount: 14203,
  },
  {
    id: "DSR-002",
    codeName: "GLASS ORACLE",
    issuedAt: "2025-02-03",
    asset: "TSLA",
    issuePrice: 248.0,
    currentPrice: 215.4,
    changePct: -13.15,
    confidence: 67,
    outcome: "BURNED",
    summary:
      "Bull thesis on Tesla FSD regulatory approval in EU. Timeline slipped; autonomy permit delayed to Q3.",
    redactedSummary:
      "Bull thesis on ████ ████ regulatory approval in EU. Timeline slipped; autonomy permit delayed to Q3.",
    readersCount: 9871,
  },
  {
    id: "DSR-003",
    codeName: "IRON MERIDIAN",
    issuedAt: "2025-02-19",
    asset: "PLTR",
    issuePrice: 62.3,
    currentPrice: 81.75,
    changePct: 31.22,
    confidence: 88,
    outcome: "VERIFIED",
    summary:
      "Government contract pipeline analysis indicated 40% revenue uplift from defense sector deals in H2.",
    redactedSummary:
      "Government contract pipeline analysis indicated 40% revenue uplift from ██████ sector deals in H2.",
    readersCount: 18442,
  },
  {
    id: "DSR-004",
    codeName: "PALE HORIZON",
    issuedAt: "2025-03-07",
    asset: "BTC",
    issuePrice: 71200.0,
    currentPrice: 68400.0,
    changePct: -3.93,
    confidence: 54,
    outcome: "PENDING",
    summary:
      "Bitcoin accumulation thesis post-halving. Institutional ETF inflows expected to offset miner sell pressure within 90 days.",
    redactedSummary:
      "██████ accumulation thesis post-halving. Institutional ████ inflows expected to offset ████ sell pressure within 90 days.",
    readersCount: 22105,
  },
  {
    id: "DSR-005",
    codeName: "BLACK SABLE",
    issuedAt: "2025-03-22",
    asset: "MSFT",
    issuePrice: 410.2,
    currentPrice: 437.6,
    changePct: 6.68,
    confidence: 79,
    outcome: "VERIFIED",
    summary:
      "Azure AI revenue run-rate accelerating. Copilot enterprise adoption exceeded internal targets by 25%.",
    redactedSummary:
      "████ AI revenue run-rate accelerating. ██████ enterprise adoption exceeded internal targets by 25%.",
    readersCount: 11330,
  },
  {
    id: "DSR-006",
    codeName: "COLD FORK",
    issuedAt: "2025-04-10",
    asset: "ETH",
    issuePrice: 3450.0,
    currentPrice: 3120.0,
    changePct: -9.57,
    confidence: 45,
    outcome: "BURNED",
    summary:
      "Ethereum L2 fee compression thesis failed. Sequencer revenue declined as activity migrated to competing L1s.",
    redactedSummary:
      "████████ L2 fee compression thesis failed. ██████████ revenue declined as activity migrated to competing L1s.",
    readersCount: 7654,
  },
  {
    id: "DSR-007",
    codeName: "WRAITH KEY",
    issuedAt: "2025-04-28",
    asset: "AMZN",
    issuePrice: 186.4,
    currentPrice: 203.9,
    changePct: 9.39,
    confidence: 83,
    outcome: "VERIFIED",
    summary:
      "AWS margin expansion driven by custom silicon (Graviton/Trainium). Operating income beat modeled scenario by 12%.",
    redactedSummary:
      "███ margin expansion driven by custom silicon (████████/████████). Operating income beat modeled scenario by 12%.",
    readersCount: 15890,
  },
  {
    id: "DSR-008",
    codeName: "SIGIL DAWN",
    issuedAt: "2025-05-15",
    asset: "COIN",
    issuePrice: 225.0,
    currentPrice: 198.5,
    changePct: -11.78,
    confidence: 61,
    outcome: "PENDING",
    summary:
      "Coinbase staking revenue recovery pending SEC clarity on ETH staking classification. Legal resolution expected Q3.",
    redactedSummary:
      "███████ staking revenue recovery pending ████ clarity on ████ staking classification. Legal resolution expected Q3.",
    readersCount: 6210,
  },
  {
    id: "DSR-009",
    codeName: "VOID ANCHOR",
    issuedAt: "2025-05-30",
    asset: "LLY",
    issuePrice: 780.0,
    currentPrice: 842.3,
    changePct: 7.99,
    confidence: 74,
    outcome: "VERIFIED",
    summary:
      "GLP-1 receptor agonist demand surge. Tirzepatide supply constraints creating pricing power through 2026.",
    redactedSummary:
      "████ receptor agonist demand surge. ██████████ supply constraints creating pricing power through 2026.",
    readersCount: 13567,
  },
  {
    id: "DSR-010",
    codeName: "EMBER CROWN",
    issuedAt: "2025-06-08",
    asset: "AVGO",
    issuePrice: 165.8,
    currentPrice: 172.4,
    changePct: 3.98,
    confidence: 58,
    outcome: "PENDING",
    summary:
      "Broadcom custom AI ASIC revenue ramp. Hyperscaler orders for next-gen inference chips expected to double YoY.",
    redactedSummary:
      "████████ custom AI ████ revenue ramp. ██████████ orders for next-gen inference chips expected to double YoY.",
    readersCount: 10221,
  },
] as const;
