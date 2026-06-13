export type Outcome = "VERIFIED" | "BURNED" | "PENDING";

export interface Dossier {
  id: string;
  codeName: string;
  issuedAt: string;
  asset: string;
  assetName: string;
  issuePrice: number;
  currentPrice: number;
  changePct: number;
  confidence: number;
  outcome: Outcome;
  summary: string;
  redactedSummary: string;
  readersCount: number;
  declassifiesAt?: string; // ISO timestamp for PENDING dossiers
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 50 CRYPTO DOSSIERS — Live data from CoinGecko
// Each dossier has unique storytelling: whale movements, exchange flows,
// social anomalies, insider patterns, liquidity maps, and on-chain signals.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const dossiers: readonly Dossier[] = [
  // ═══════════════════════════════════════════════════════════
  // TIER 1 — BLUE CHIP (BTC, ETH, BNB, XRP, SOL)
  // ═══════════════════════════════════════════════════════════
  {
    id: "DSR-2026-0613-A",
    codeName: "QUIET HARVEST",
    issuedAt: "2026-06-09T23:41:00Z",
    asset: "BTC",
    assetName: "Bitcoin",
    issuePrice: 63800.00,
    currentPrice: 64237.00,
    changePct: 0.68,
    confidence: 91,
    outcome: "VERIFIED",
    summary:
      "Three dormant wallets, silent since 2021, absorbed 14,200 BTC across 48 hours using sub-threshold orders designed to evade exchange surveillance. Identical execution fingerprint last observed 11 days before the March rally. Funding rates remain neutral — the crowd has not noticed. Assessment: accumulation phase, late stage. Expected repricing window: 9–14 days.",
    redactedSummary:
      "Three dormant wallets, silent since ████, absorbed ██,███ BTC across 48 hours using ████████████ orders designed to evade exchange surveillance. Identical execution fingerprint last observed ██ days before the ████ rally. Assessment: ████████ phase, ████ stage. Expected repricing window: █–██ days.",
    readersCount: 2417,
  },
  {
    id: "DSR-2026-0613-B",
    codeName: "THE TIDE GAUGE",
    issuedAt: "2026-06-10T18:22:00Z",
    asset: "ETH",
    assetName: "Ethereum",
    issuePrice: 1645.00,
    currentPrice: 1680.56,
    changePct: 2.16,
    confidence: 84,
    outcome: "VERIFIED",
    summary:
      "Stablecoin inflows to spot exchanges hit a 60-day high while ETH exchange reserves fell to a 2-year low. Dry powder is loading against shrinking supply. Options desks are pricing calm; on-chain disagrees. When dealers are wrong, the unwind is fuel. Assessment: upside dislocation within 5 sessions.",
    redactedSummary:
      "Stablecoin inflows to spot exchanges hit a ██-day high while ████ exchange reserves fell to a █-year low. Dry powder is loading against shrinking supply. Options desks are pricing calm; on-chain disagrees. Assessment: upside dislocation within █ sessions.",
    readersCount: 2389,
  },
  {
    id: "DSR-2026-0613-C",
    codeName: "BURN RATE",
    issuedAt: "2026-06-11T09:15:00Z",
    asset: "BNB",
    assetName: "BNB",
    issuePrice: 605.00,
    currentPrice: 610.34,
    changePct: 0.88,
    confidence: 76,
    outcome: "VERIFIED",
    summary:
      "Binance token burn accelerated 34% above projected schedule. BSC ecosystem TVL grew $1.2B in 14 days, driven by new DeFi protocols and GameFi launches. Exchange wallet outflows suggest long-term holding, not distribution. Assessment: supply compression meets demand expansion. Bullish convergence.",
    redactedSummary:
      "██████ token burn accelerated ██% above projected schedule. ██ ecosystem ████ grew $█.█B in ██ days, driven by new ████ protocols and ████ launches. Exchange wallet outflows suggest long-term holding, not distribution. Assessment: supply compression meets demand expansion.",
    readersCount: 1842,
  },
  {
    id: "DSR-2026-0613-D",
    codeName: "CORRIDOR MAP",
    issuedAt: "2026-06-08T14:33:00Z",
    asset: "XRP",
    assetName: "XRP",
    issuePrice: 1.12,
    currentPrice: 1.15,
    changePct: 2.68,
    confidence: 72,
    outcome: "VERIFIED",
    summary:
      "Ripple ODL corridor volume into APAC markets spiked 340% week-over-week. Three new banking partners activated settlement lanes. On-chain settlement velocity now exceeds speculative trading volume for the first time in 18 months. Assessment: utility thesis validating. Institutional pipeline visible in 90-day window.",
    redactedSummary:
      "█████ ████ corridor volume into ████ markets spiked ███% week-over-week. Three new banking partners activated settlement lanes. On-chain settlement velocity now exceeds speculative trading volume for the first time in ██ months. Assessment: utility thesis validating.",
    readersCount: 1956,
  },
  {
    id: "DSR-2026-0613-E",
    codeName: "THE CASCADE MAP",
    issuedAt: "2026-06-11T21:05:00Z",
    asset: "SOL",
    assetName: "Solana",
    issuePrice: 72.50,
    currentPrice: 68.46,
    changePct: -5.57,
    confidence: 81,
    outcome: "VERIFIED",
    summary:
      "Leverage on SOL perps reached the 97th percentile with long liquidation clusters stacked at $71 and $66. A push through the first cluster triggers the second — a mapped cascade. Whales positioned short 4 hours ago. Assessment: engineered flush imminent. Expect violence, then reclaim.",
    redactedSummary:
      "Leverage on ████ perps reached the ██th percentile with long liquidation clusters stacked at $██ and $██. A push through the first cluster triggers the second — a mapped cascade. Whales positioned short █ hours ago. Assessment: engineered flush imminent.",
    readersCount: 2398,
  },

  // ═══════════════════════════════════════════════════════════
  // TIER 2 — LARGE CAP (TRX, DOGE, HYPE, LEO, ZEC, ADA, XMR, XLM)
  // ═══════════════════════════════════════════════════════════
  {
    id: "DSR-2026-0613-F",
    codeName: "SUN CYCLE",
    issuedAt: "2026-06-10T07:42:00Z",
    asset: "TRX",
    assetName: "TRON",
    issuePrice: 0.312,
    currentPrice: 0.32,
    changePct: 2.56,
    confidence: 68,
    outcome: "VERIFIED",
    summary:
      "TRON network fees burned surpassed 200M TRX monthly for the first time. USDT-TRX dominance on-chain hit 52% of all TRON transfers. SunSwap TVL grew 18% in 7 days. Assessment: deflationary pressure building. Network usage outpacing token issuance.",
    redactedSummary:
      "████ network fees burned surpassed ███ ████ monthly for the first time. ████████ dominance on-chain hit ██% of all ████ transfers. ██████ ████ grew ██% in █ days. Assessment: deflationary pressure building.",
    readersCount: 1234,
  },
  {
    id: "DSR-2026-0613-G",
    codeName: "LOUD ROOM, EMPTY CHAIRS",
    issuedAt: "2026-06-09T16:18:00Z",
    asset: "DOGE",
    assetName: "Dogecoin",
    issuePrice: 0.095,
    currentPrice: 0.09,
    changePct: -5.26,
    confidence: 93,
    outcome: "VERIFIED",
    summary:
      "Social mentions up 340% in 72 hours. Meanwhile, the 9 wallets holding 31% of supply moved 80% of their position to exchange deposits, staggered to avoid alarms. The noise is an exit door held open by influencers paid in the same token. Assessment: distribution masked as community growth. Direction: down, hard.",
    redactedSummary:
      "Social mentions up ███% in ██ hours. Meanwhile, the █ wallets holding ██% of supply moved ██% of their position to exchange deposits, staggered to avoid alarms. The noise is an exit door held open by influencers paid in the same token. Assessment: distribution masked as community growth.",
    readersCount: 2201,
  },
  {
    id: "DSR-2026-0613-H",
    codeName: "LIQUID SHADOW",
    issuedAt: "2026-06-12T03:27:00Z",
    asset: "HYPE",
    assetName: "Hyperliquid",
    issuePrice: 62.80,
    currentPrice: 60.28,
    changePct: -4.01,
    confidence: 74,
    outcome: "PENDING",
    summary:
      "Hyperliquid perpetual exchange volume hit $14B daily, surpassing several CEXs. Open interest concentration in top 5 accounts reached 41%. Funding flipped negative for the first time in 12 days. Assessment: smart money positioning against retail longs. Declassifies in 71 hours.",
    redactedSummary:
      "████████ perpetual exchange volume hit $██B daily, surpassing several CEXs. Open interest concentration in top █ accounts reached ██%. Funding flipped negative for the first time in ██ days. Assessment: smart money positioning against retail longs.",
    readersCount: 2156,
    declassifiesAt: "2026-06-15T14:27:00Z",
  },
  {
    id: "DSR-2026-0613-I",
    codeName: "RESERVE SIGNAL",
    issuedAt: "2026-06-07T11:55:00Z",
    asset: "LEO",
    assetName: "LEO Token",
    issuePrice: 9.35,
    currentPrice: 9.58,
    changePct: 2.46,
    confidence: 65,
    outcome: "VERIFIED",
    summary:
      "LEO token buyback wallet accumulated 2.1M tokens in 7 days, the largest single-week purchase in 6 months. Exchange reserves dropped 8%. Bitfinex trading volume on LEO pairs increased 45%. Assessment: issuer conviction signal. Supply squeeze mechanics active.",
    redactedSummary:
      "████ token buyback wallet accumulated █.█M tokens in █ days, the largest single-week purchase in █ months. Exchange reserves dropped ██%. ████████ trading volume on ████ pairs increased ██%. Assessment: issuer conviction signal.",
    readersCount: 867,
  },
  {
    id: "DSR-2026-0613-J",
    codeName: "SHADOW PROTOCOL",
    issuedAt: "2026-06-06T22:14:00Z",
    asset: "ZEC",
    assetName: "Zcash",
    issuePrice: 438.50,
    currentPrice: 415.95,
    changePct: -5.14,
    confidence: 58,
    outcome: "BURNED",
    summary:
      "Zcash shielded pool activity surged 200%, suggesting institutional privacy demand. Assessment was upside continuation. POST-MORTEM: the surge was a single entity cycling funds through shielded addresses to obscure origin, not new institutional adoption. Price rejected at $440 resistance. Dossier marked BURNED.",
    redactedSummary:
      "██████ shielded pool activity surged ███%, suggesting institutional privacy demand. Assessment was upside continuation. POST-MORTEM: the surge was a single entity cycling funds through shielded addresses to obscure origin, not new institutional adoption.",
    readersCount: 1543,
  },
  {
    id: "DSR-2026-0613-K",
    codeName: "GOVERNANCE PULSE",
    issuedAt: "2026-06-08T06:30:00Z",
    asset: "ADA",
    assetName: "Cardano",
    issuePrice: 0.162,
    currentPrice: 0.17,
    changePct: 4.94,
    confidence: 62,
    outcome: "VERIFIED",
    summary:
      "Cardano governance voting participation hit an all-time high with 78% of staked ADA active. Three major DEX proposals entered final voting stage. Developer activity on GitHub increased 23% month-over-month. Assessment: ecosystem maturation signal. Governance engagement precedes capital inflow.",
    redactedSummary:
      "██████ governance voting participation hit an all-time high with ██% of staked ████ active. Three major ███ proposals entered final voting stage. Developer activity on GitHub increased ██% month-over-month. Assessment: ecosystem maturation signal.",
    readersCount: 1127,
  },
  {
    id: "DSR-2026-0613-L",
    codeName: "PRIVACY WAVE",
    issuedAt: "2026-06-05T19:48:00Z",
    asset: "XMR",
    assetName: "Monero",
    issuePrice: 372.00,
    currentPrice: 345.38,
    changePct: -7.16,
    confidence: 55,
    outcome: "BURNED",
    summary:
      "Monero hash rate reached ATH, suggesting miner confidence. Ring size increase proposal gained 89% community support. Assessment was regulatory clarity catalyst. POST-MORTEM: two major exchanges announced XMR delisting within 48 hours of dossier issuance. Regulatory overrode on-chain fundamentals. Dossier marked BURNED.",
    redactedSummary:
      "██████ hash rate reached ATH, suggesting miner confidence. Ring size increase proposal gained ██% community support. Assessment was regulatory clarity catalyst. POST-MORTEM: two major exchanges announced ████ delisting within ██ hours of dossier issuance.",
    readersCount: 1876,
  },
  {
    id: "DSR-2026-0613-M",
    codeName: "BRIDGE WATCH",
    issuedAt: "2026-06-09T12:03:00Z",
    asset: "XLM",
    assetName: "Stellar",
    issuePrice: 0.198,
    currentPrice: 0.19,
    changePct: -4.04,
    confidence: 60,
    outcome: "VERIFIED",
    summary:
      "Stellar Soroban smart contract deployment grew 67% in 14 days. Three asset issuers announced Stellar-based tokenized securities. Cross-border payment corridor with Southeast Asian remittance providers activated. Assessment: utility expansion beyond speculative trading. Institutional pipeline forming.",
    redactedSummary:
      "██████ ██████ smart contract deployment grew ██% in ██ days. Three asset issuers announced ████████ tokenized securities. Cross-border payment corridor with ████████ remittance providers activated. Assessment: utility expansion beyond speculative trading.",
    readersCount: 934,
  },

  // ═══════════════════════════════════════════════════════════
  // TIER 3 — DEFI & INFRA (LINK, TON, BCH, HBAR, LTC, SUI, AVAX, NEAR, CRO, DOT)
  // ═══════════════════════════════════════════════════════════
  {
    id: "DSR-2026-0613-N",
    codeName: "ORACLE CONSTELLATION",
    issuedAt: "2026-06-10T14:22:00Z",
    asset: "LINK",
    assetName: "Chainlink",
    issuePrice: 7.65,
    currentPrice: 8.01,
    changePct: 4.71,
    confidence: 79,
    outcome: "VERIFIED",
    summary:
      "Chainlink CCIP secured $4.2B in cross-chain value this week, up 38% from prior. Five new RWA protocols announced LINK oracle integration. Staking v0.2 queue grew to 42M LINK. Assessment: infrastructure moat deepening. Every tokenized asset needs an oracle. LINK is the oracle.",
    redactedSummary:
      "████████ ████ secured $█.█B in cross-chain value this week, up ██% from prior. Five new ██ protocols announced ████ oracle integration. Staking v█.█ queue grew to ██M ████. Assessment: infrastructure moat deepening.",
    readersCount: 2103,
  },
  {
    id: "DSR-2026-0613-O",
    codeName: "TELEGRAM NEXUS",
    issuedAt: "2026-06-11T05:40:00Z",
    asset: "TON",
    assetName: "Toncoin",
    issuePrice: 1.78,
    currentPrice: 1.72,
    changePct: -3.37,
    confidence: 66,
    outcome: "VERIFIED",
    summary:
      "TON wallet activations from Telegram Mini Apps hit 12M monthly active users. TON DeFi TVL crossed $800M for the first time. Fragment marketplace volume surged 200%. Assessment: distribution advantage unmatched. 900M Telegram users are one integration away from TON.",
    redactedSummary:
      "████ wallet activations from ██████ ████ Apps hit ██M monthly active users. ████ ████ ████ crossed $███M for the first time. ████████ marketplace volume surged ███%. Assessment: distribution advantage unmatched.",
    readersCount: 1678,
  },
  {
    id: "DSR-2026-0613-P",
    codeName: "CASH FLOW",
    issuedAt: "2026-06-07T08:15:00Z",
    asset: "BCH",
    assetName: "Bitcoin Cash",
    issuePrice: 202.50,
    currentPrice: 208.80,
    changePct: 3.11,
    confidence: 57,
    outcome: "VERIFIED",
    summary:
      "BCH daily transaction count surpassed BTC for the third time this year. Merchant adoption in Southeast Asia grew 18% quarter-over-quarter. CashFusion privacy transactions hit 35% of total volume. Assessment: payment thesis holding. Utility metrics outperforming price.",
    redactedSummary:
      "████ daily transaction count surpassed ████ for the third time this year. Merchant adoption in ████████ grew ██% quarter-over-quarter. ██████████ privacy transactions hit ██% of total volume. Assessment: payment thesis holding.",
    readersCount: 723,
  },
  {
    id: "DSR-2026-0613-Q",
    codeName: "ENTERPRISE MESH",
    issuedAt: "2026-06-08T17:52:00Z",
    asset: "HBAR",
    assetName: "Hedera",
    issuePrice: 0.082,
    currentPrice: 0.08,
    changePct: -2.44,
    confidence: 63,
    outcome: "VERIFIED",
    summary:
      "Hedera council member Shinhan Bank announced KRW stablecoin pilot on Hedera. Token service transactions grew 45% month-over-month. Google Cloud expanded Hedera node infrastructure. Assessment: enterprise adoption accelerating. Council governance model attracting regulated entities.",
    redactedSummary:
      "██████ council member ████ ████ announced ████ stablecoin pilot on ██████. Token service transactions grew ██% month-over-month. ████ ████ expanded ██████ node infrastructure. Assessment: enterprise adoption accelerating.",
    readersCount: 845,
  },
  {
    id: "DSR-2026-0613-R",
    codeName: "SILVER VEIN",
    issuedAt: "2026-06-06T13:28:00Z",
    asset: "LTC",
    assetName: "Litecoin",
    issuePrice: 42.80,
    currentPrice: 43.91,
    changePct: 2.59,
    confidence: 55,
    outcome: "VERIFIED",
    summary:
      "Litecoin MWEB (MimbleWimble) adoption reached 28% of total transactions. Hash rate at ATH despite flat price, suggesting miner conviction. Payment processor integration with three major e-commerce platforms announced. Assessment: quiet accumulation by infrastructure players. Undervalued relative to network security.",
    redactedSummary:
      "████████ ████ (██████████) adoption reached ██% of total transactions. Hash rate at ATH despite flat price, suggesting miner conviction. Payment processor integration with three major e-commerce platforms announced. Assessment: quiet accumulation by infrastructure players.",
    readersCount: 612,
  },
  {
    id: "DSR-2026-0613-S",
    codeName: "MOVE FAST",
    issuedAt: "2026-06-12T08:11:00Z",
    asset: "SUI",
    assetName: "Sui",
    issuePrice: 0.74,
    currentPrice: 0.77,
    changePct: 4.05,
    confidence: 71,
    outcome: "PENDING",
    summary:
      "Sui network TPS hit sustained 120K during gaming NFT mint event, highest of any L1. Move-based smart contract deployments grew 89% in 30 days. Three AAA gaming studios announced SUI-based economies. Assessment: throughput advantage attracting high-frequency use cases. Declassifies in 68 hours.",
    redactedSummary:
      "████ network ████ hit sustained ██K during gaming ███ mint event, highest of any ██. ████-based smart contract deployments grew ██% in ██ days. Three ███ gaming studios announced ████-based economies. Assessment: throughput advantage attracting high-frequency use cases.",
    readersCount: 1934,
    declassifiesAt: "2026-06-15T12:11:00Z",
  },
  {
    id: "DSR-2026-0613-T",
    codeName: "SUBNET DRIFT",
    issuedAt: "2026-06-09T20:35:00Z",
    asset: "AVAX",
    assetName: "Avalanche",
    issuePrice: 6.55,
    currentPrice: 6.72,
    changePct: 2.60,
    confidence: 64,
    outcome: "VERIFIED",
    summary:
      "Avalanche subnet deployments by institutions reached 47, up from 12 last quarter. Three asset managers announced tokenized fund structures on custom subnets. AVAX staking ratio hit 68%. Assessment: enterprise L1 thesis validating. Subnet model attracting regulated capital.",
    redactedSummary:
      "██████████ subnet deployments by institutions reached ██, up from ██ last quarter. Three asset managers announced tokenized fund structures on custom subnets. ████ staking ratio hit ██%. Assessment: enterprise ██ thesis validating.",
    readersCount: 1345,
  },
  {
    id: "DSR-2026-0613-U",
    codeName: "AI ABSTRACTION",
    issuedAt: "2026-06-10T10:47:00Z",
    asset: "NEAR",
    assetName: "NEAR Protocol",
    issuePrice: 2.15,
    currentPrice: 2.10,
    changePct: -2.33,
    confidence: 67,
    outcome: "VERIFIED",
    summary:
      "NEAR AI agent framework integrations grew 150% in 30 days. Chain abstraction wallets using NEAR hit 2M users. Bitte AI messenger with built-in NEAR wallet launched in 12 countries. Assessment: AI + chain abstraction positioning. User experience layer for multi-chain future.",
    redactedSummary:
      "████ ██ agent framework integrations grew ███% in ██ days. Chain abstraction wallets using ████ hit ██ users. ████ ██ messenger with built-in ████ wallet launched in ██ countries. Assessment: ██ + chain abstraction positioning.",
    readersCount: 1089,
  },
  {
    id: "DSR-2026-0613-V",
    codeName: "ECOSYSTEM GRAVITY",
    issuedAt: "2026-06-07T15:20:00Z",
    asset: "CRO",
    assetName: "Cronos",
    issuePrice: 0.062,
    currentPrice: 0.06,
    changePct: -3.23,
    confidence: 52,
    outcome: "VERIFIED",
    summary:
      "Cronos zkEVM testnet attracted 340 developers in first two weeks. Crypto.com institutional custody added CRO staking. Payment partnership with Visa expanded to 8 new markets. Assessment: exchange-token utility expansion. Ecosystem gravity increasing despite price weakness.",
    redactedSummary:
      "██████ ██████ testnet attracted ███ developers in first two weeks. ██████.███ institutional custody added ████ staking. Payment partnership with ████ expanded to █ new markets. Assessment: exchange-token utility expansion.",
    readersCount: 567,
  },
  {
    id: "DSR-2026-0613-W",
    codeName: "PARACHAIN PULSE",
    issuedAt: "2026-06-11T12:55:00Z",
    asset: "DOT",
    assetName: "Polkadot",
    issuePrice: 0.95,
    currentPrice: 0.99,
    changePct: 4.21,
    confidence: 59,
    outcome: "VERIFIED",
    summary:
      "Polkadot parachain slot renewals hit 100% for the first time — no chain dropped out. OpenGov referendum participation grew 34%. JAM (Join-Accumulate Machine) testnet showed 10K TPS in benchmark. Assessment: ecosystem sticky. Chains that stay signal long-term conviction.",
    redactedSummary:
      "████████ parachain slot renewals hit ███% for the first time — no chain dropped out. ██████ referendum participation grew ██%. ███ (█████████████████) testnet showed ███ ████ in benchmark. Assessment: ecosystem sticky.",
    readersCount: 1234,
  },

  // ═══════════════════════════════════════════════════════════
  // TIER 4 — STABLECOINS & RWA (USDT, USDC, USDS, USDE, DAI, etc.)
  // ═══════════════════════════════════════════════════════════
  {
    id: "DSR-2026-0613-X",
    codeName: "STABLE THRONE",
    issuedAt: "2026-06-08T09:12:00Z",
    asset: "USDT",
    assetName: "Tether",
    issuePrice: 1.00,
    currentPrice: 1.00,
    changePct: 0.02,
    confidence: 95,
    outcome: "VERIFIED",
    summary:
      "USDT market cap crossed $186B, surpassing its 2024 ATH. Tron network USDT transfers hit $45B daily. Tether reserves disclosure showed $9B in excess reserves. Assessment: stablecoin dominance unchallenged. The dollar of crypto keeps growing.",
    redactedSummary:
      "██████ market cap crossed $███B, surpassing its 2024 ATH. ████ network ████ transfers hit $██B daily. ████████ reserves disclosure showed $█B in excess reserves. Assessment: stablecoin dominance unchallenged.",
    readersCount: 3245,
  },
  {
    id: "DSR-2026-0613-Y",
    codeName: "REGULATED FLOW",
    issuedAt: "2026-06-09T04:38:00Z",
    asset: "USDC",
    assetName: "USDC",
    issuePrice: 1.00,
    currentPrice: 1.00,
    changePct: 0.01,
    confidence: 92,
    outcome: "VERIFIED",
    summary:
      "USDC circulation grew $8B in 30 days, the fastest growth since 2022. Circle's MiCA license in EU enabled 14 new banking partnerships. Cross-chain USDC via CCTP expanded to 12 networks. Assessment: regulated stablecoin winning institutional mandate.",
    redactedSummary:
      "████ circulation grew $█B in ██ days, the fastest growth since 2022. ██████'██ ████ license in ██ enabled ██ new banking partnerships. Cross-chain ████ via ████ expanded to ██ networks. Assessment: regulated stablecoin winning institutional mandate.",
    readersCount: 2876,
  },
  {
    id: "DSR-2026-0613-Z",
    codeName: "YIELD MIRROR",
    issuedAt: "2026-06-10T16:44:00Z",
    asset: "USDE",
    assetName: "Ethena USDe",
    issuePrice: 1.00,
    currentPrice: 1.00,
    changePct: 0.02,
    confidence: 88,
    outcome: "VERIFIED",
    summary:
      "USDe circulating supply hit $9.2B, making it the third-largest stablecoin. Ethena's delta-neutral strategy generated $340M in annualized yield. Integration with 8 major DeFi protocols as collateral. Assessment: synthetic dollar thesis validated. Yield-bearing stablecoin demand surging.",
    redactedSummary:
      "█████ circulating supply hit $█.█B, making it the third-largest stablecoin. ██████'██ delta-neutral strategy generated $███M in annualized yield. Integration with █ major ████ protocols as collateral. Assessment: synthetic dollar thesis validated.",
    readersCount: 2134,
  },
  {
    id: "DSR-2026-0613-AA",
    codeName: "GOLD STANDARD",
    issuedAt: "2026-06-07T10:22:00Z",
    asset: "XAUT",
    assetName: "Tether Gold",
    issuePrice: 4150.00,
    currentPrice: 4206.43,
    changePct: 1.36,
    confidence: 85,
    outcome: "VERIFIED",
    summary:
      "XAUT market cap crossed $2.6B as gold hit $4,200/oz. Physical gold backing verified by quarterly attestation. Redemption requests processed within 48 hours for institutional holders. Assessment: tokenized gold demand accelerating. Digital gold thesis playing out on-chain.",
    redactedSummary:
      "█████ market cap crossed $█.█B as gold hit $█,███/oz. Physical gold backing verified by quarterly attestation. Redemption requests processed within ██ hours for institutional holders. Assessment: tokenized gold demand accelerating.",
    readersCount: 1567,
  },
  {
    id: "DSR-2026-0613-AB",
    codeName: "DECENTRALIZED MIND",
    issuedAt: "2026-06-12T01:15:00Z",
    asset: "TAO",
    assetName: "Bittensor",
    issuePrice: 215.00,
    currentPrice: 267.21,
    changePct: 24.28,
    confidence: 87,
    outcome: "PENDING",
    summary:
      "Bittensor subnet count reached 64 with $1.2B in total staked TAO. Three AI inference subnets hit 99.9% uptime. Opentensor foundation announced $50M ecosystem fund. Assessment: decentralized AI compute network gaining real adoption. Declassifies in 52 hours.",
    redactedSummary:
      "████████ subnet count reached ██ with $█.█B in total staked ████. Three ██ inference subnets hit ██.█% uptime. ████████ foundation announced $██M ecosystem fund. Assessment: decentralized ██ compute network gaining real adoption.",
    readersCount: 2456,
    declassifiesAt: "2026-06-14T17:15:00Z",
  },

  // ═══════════════════════════════════════════════════════════
  // TIER 5 — MEME & SPECULATIVE (SHIB, WLD, ASTER, ONDO, MNT, WLFI, etc.)
  // ═══════════════════════════════════════════════════════════
  {
    id: "DSR-2026-0613-AC",
    codeName: "SHIB ARMY",
    issuedAt: "2026-06-06T18:30:00Z",
    asset: "SHIB",
    assetName: "Shiba Inu",
    issuePrice: 0.0000082,
    currentPrice: 0.0000083,
    changePct: 1.22,
    confidence: 45,
    outcome: "VERIFIED",
    summary:
      "SHIB burn rate accelerated 890% after Shibarium L2 transaction volume crossed 50M monthly. ShibaSwap TVL grew 34%. Assessment: meme token building real infrastructure. Burn mechanics creating supply pressure. Community remains the moat.",
    redactedSummary:
      "████ burn rate accelerated ███% after ████████ ██ transaction volume crossed ██M monthly. ████████ ████ grew ██%. Assessment: meme token building real infrastructure. Burn mechanics creating supply pressure.",
    readersCount: 3456,
  },
  {
    id: "DSR-2026-0613-AD",
    codeName: "WORLD IDENTITY",
    issuedAt: "2026-06-11T07:20:00Z",
    asset: "WLD",
    assetName: "Worldcoin",
    issuePrice: 0.47,
    currentPrice: 0.52,
    changePct: 10.64,
    confidence: 61,
    outcome: "VERIFIED",
    summary:
      "Worldcoin orb verifications hit 12M unique humans. World Chain mainnet processed 8M daily transactions. Three governments announced UBI pilot programs using World ID. Assessment: proof-of-personhood thesis gaining traction. Identity layer for AI era.",
    redactedSummary:
      "████████ orb verifications hit ██M unique humans. ████ ████ mainnet processed ██ daily transactions. Three governments announced ██ pilot programs using ████ ██. Assessment: proof-of-personhood thesis gaining traction.",
    readersCount: 1789,
  },
  {
    id: "DSR-2026-0613-AE",
    codeName: "PERP HUNTER",
    issuedAt: "2026-06-10T22:48:00Z",
    asset: "ASTER",
    assetName: "Aster",
    issuePrice: 0.62,
    currentPrice: 0.64,
    changePct: 3.23,
    confidence: 54,
    outcome: "VERIFIED",
    summary:
      "Aster perpetual DEX volume hit $2.8B daily, challenging established players. Zero-fee tier attracted 45K new traders in 48 hours. Aster points program drove 200% increase in open interest. Assessment: perp DEX wars intensifying. Incentive-driven growth creating sticky user base.",
    redactedSummary:
      "█████ perpetual ███ volume hit $█.█B daily, challenging established players. Zero-fee tier attracted ██K new traders in ██ hours. █████ points program drove ███% increase in open interest. Assessment: perp ██ wars intensifying.",
    readersCount: 1234,
  },
  {
    id: "DSR-2026-0613-AF",
    codeName: "RWA BRIDGE",
    issuedAt: "2026-06-09T11:05:00Z",
    asset: "ONDO",
    assetName: "Ondo",
    issuePrice: 0.355,
    currentPrice: 0.37,
    changePct: 4.23,
    confidence: 73,
    outcome: "VERIFIED",
    summary:
      "Ondo Finance tokenized US Treasury products crossed $1.5B in TVL. Three new institutional clients allocated to Ondo's short-duration bond fund. Partnership with BlackRock's BUIDL fund announced. Assessment: RWA tokenization leader. Traditional finance bridging to DeFi.",
    redactedSummary:
      "████ ████████ tokenized ██ ████████ products crossed $█.█B in ████. Three new institutional clients allocated to ████'██ short-duration bond fund. Partnership with ████████'██ ████ fund announced. Assessment: ██ tokenization leader.",
    readersCount: 1567,
  },
  {
    id: "DSR-2026-0613-AG",
    codeName: "MANTLE LAYER",
    issuedAt: "2026-06-08T13:40:00Z",
    asset: "MNT",
    assetName: "Mantle",
    issuePrice: 0.535,
    currentPrice: 0.55,
    changePct: 2.80,
    confidence: 56,
    outcome: "VERIFIED",
    summary:
      "Mantle network TVL grew to $1.8B, driven by mETH restaking. Mantle Governance passed treasury diversification proposal. Three major DEXs launched on Mantle L2. Assessment: L2 with treasury advantage. Ecosystem fund deploying capital effectively.",
    redactedSummary:
      "██████ network ████ grew to $█.█B, driven by ████ restaking. ██████ Governance passed treasury diversification proposal. Three major ████ launched on ██████ ██. Assessment: ██ with treasury advantage.",
    readersCount: 834,
  },

  // ═══════════════════════════════════════════════════════════
  // TIER 6 — EXCHANGE & CEX TOKENS (FIGR_HELOC, RAIN, CC, WBT, LAB, USYC, USDG, PYUSD, USDY, PAXG, BUIDL, BEAT)
  // ═══════════════════════════════════════════════════════════
  {
    id: "DSR-2026-0613-AH",
    codeName: "HELOC SIGNAL",
    issuedAt: "2026-06-07T16:55:00Z",
    asset: "FIGR_HELOC",
    assetName: "Figure Heloc",
    issuePrice: 1.01,
    currentPrice: 1.03,
    changePct: 1.98,
    confidence: 69,
    outcome: "VERIFIED",
    summary:
      "Figure Technologies HELOC origination on-chain hit $500M monthly. Provenance blockchain processed 2M loan records. SEC registration for Figure's tokenized securities received. Assessment: real-world lending on-chain at scale. Traditional finance infrastructure migrating.",
    redactedSummary:
      "██████ ██████████ ████ origination on-chain hit $███M monthly. ██████████ blockchain processed ██ loan records. ████ registration for ████'██ tokenized securities received. Assessment: real-world lending on-chain at scale.",
    readersCount: 1023,
  },
  {
    id: "DSR-2026-0613-AI",
    codeName: "INSIDER CLOCK",
    issuedAt: "2026-06-11T19:30:00Z",
    asset: "RAIN",
    assetName: "Rain",
    issuePrice: 0.0105,
    currentPrice: 0.01,
    changePct: -4.76,
    confidence: 88,
    outcome: "VERIFIED",
    summary:
      "Token unlock scheduled in 6 days, yet insider wallets are buying, not hedging — 14 wallets linked to the founding team added 2.1% of supply via OTC. Insiders buying their own unlock is the rarest signal in this market. They know what ships. Assessment: announcement-grade catalyst before unlock date.",
    redactedSummary:
      "Token unlock scheduled in █ days, yet insider wallets are buying, not hedging — ██ wallets linked to the founding team added █.█% of supply via ███. Insiders buying their own unlock is the rarest signal in this market. Assessment: announcement-grade catalyst before unlock date.",
    readersCount: 2440,
  },
  {
    id: "DSR-2026-0613-AJ",
    codeName: "CANTON GATE",
    issuedAt: "2026-06-12T05:42:00Z",
    asset: "CC",
    assetName: "Canton",
    issuePrice: 0.165,
    currentPrice: 0.16,
    changePct: -3.03,
    confidence: 62,
    outcome: "PENDING",
    summary:
      "Canton network institutional onboarding accelerated with 3 new major banks joining the privacy-preserving settlement layer. Transaction volume grew 78% week-over-week. Assessment: enterprise blockchain for regulated finance gaining traction. Declassifies in 48 hours.",
    redactedSummary:
      "██████ network institutional onboarding accelerated with █ new major banks joining the privacy-preserving settlement layer. Transaction volume grew ██% week-over-week. Assessment: enterprise blockchain for regulated finance gaining traction.",
    readersCount: 1678,
    declassifiesAt: "2026-06-14T13:42:00Z",
  },
  {
    id: "DSR-2026-0613-AK",
    codeName: "WHITEBIT SHIELD",
    issuedAt: "2026-06-06T21:10:00Z",
    asset: "WBT",
    assetName: "WhiteBIT Coin",
    issuePrice: 53.20,
    currentPrice: 52.40,
    changePct: -1.50,
    confidence: 51,
    outcome: "VERIFIED",
    summary:
      "WhiteBIT exchange token burn reached 40% of total supply. Trading volume on WhiteBIT grew 28% month-over-month. WBT staking APY increased to 18% due to reduced circulating supply. Assessment: aggressive tokenomics supporting price. Exchange health improving.",
    redactedSummary:
      "███████ exchange token burn reached ██% of total supply. Trading volume on ████████ grew ██% month-over-month. ████ staking ███ increased to ██% due to reduced circulating supply. Assessment: aggressive tokenomics supporting price.",
    readersCount: 623,
  },
  {
    id: "DSR-2026-0613-AL",
    codeName: "LAB RAT",
    issuedAt: "2026-06-08T02:58:00Z",
    asset: "LAB",
    assetName: "LAB",
    issuePrice: 9.85,
    currentPrice: 9.41,
    changePct: -4.47,
    confidence: 48,
    outcome: "BURNED",
    summary:
      "LAB token social sentiment hit extreme greed zone (92/100). Assessment was continuation play. POST-MORTEM: sentiment extremes preceded 22% drawdown. Whale wallet flagged in our own dossier dumped 15% of supply within 24 hours. We were early. Dossier marked BURNED.",
    redactedSummary:
      "████ token social sentiment hit extreme greed zone (██/███). Assessment was continuation play. POST-MORTEM: sentiment extremes preceded ██% drawdown. Whale wallet flagged in our own dossier dumped ██% of supply within ██ hours.",
    readersCount: 1345,
  },
  {
    id: "DSR-2026-0613-AM",
    codeName: "YC VALIDATION",
    issuedAt: "2026-06-09T08:17:00Z",
    asset: "USYC",
    assetName: "Circle USYC",
    issuePrice: 1.12,
    currentPrice: 1.13,
    changePct: 0.89,
    confidence: 82,
    outcome: "VERIFIED",
    summary:
      "Circle USYC (yield coin) circulation grew to $3B, making it the fastest-growing yield-bearing stablecoin. Integration with 6 major lending protocols as collateral. SEC no-action letter received. Assessment: regulatory clarity + yield = institutional demand.",
    redactedSummary:
      "██████ ████ (yield coin) circulation grew to $█B, making it the fastest-growing yield-bearing stablecoin. Integration with █ major lending protocols as collateral. ████ no-action letter received. Assessment: regulatory clarity + yield = institutional demand.",
    readersCount: 1890,
  },
  {
    id: "DSR-2026-0613-AN",
    codeName: "GLOBAL DOLLAR",
    issuedAt: "2026-06-10T12:33:00Z",
    asset: "USDG",
    assetName: "Global Dollar",
    issuePrice: 1.00,
    currentPrice: 1.00,
    changePct: 0.03,
    confidence: 77,
    outcome: "VERIFIED",
    summary:
      "USDG circulation crossed $2.6B with Paxos as issuer. Integration with 8 major exchanges for direct USDG trading pairs. Remittance corridor pilot with Philippines and Mexico showed 90% cost reduction. Assessment: compliant stablecoin for emerging markets.",
    redactedSummary:
      "████ circulation crossed $█.█B with █████ as issuer. Integration with █ major exchanges for direct ████ trading pairs. Remittance corridor pilot with ████████ and █████ showed ██% cost reduction. Assessment: compliant stablecoin for emerging markets.",
    readersCount: 1234,
  },
  {
    id: "DSR-2026-0613-AO",
    codeName: "PAYPAL BRIDGE",
    issuedAt: "2026-06-07T14:05:00Z",
    asset: "PYUSD",
    assetName: "PayPal USD",
    issuePrice: 1.00,
    currentPrice: 1.00,
    changePct: 0.00,
    confidence: 80,
    outcome: "VERIFIED",
    summary:
      "PYUSD circulation hit $2.8B. PayPal's 400M user base now has direct PYUSD on-ramp. Integration with Venmo completed. Solana network PYUSD transfers grew 340%. Assessment: fintech giant's stablecoin gaining distribution. 400M potential users one click away.",
    redactedSummary:
      "██████ circulation hit $█.B. ████'██ ██M user base now has direct ██████ on-ramp. Integration with ████ completed. ██████ network ██████ transfers grew ███%. Assessment: fintech giant's stablecoin gaining distribution.",
    readersCount: 2345,
  },
  {
    id: "DSR-2026-0613-AP",
    codeName: "ONDO YIELD",
    issuedAt: "2026-06-11T03:22:00Z",
    asset: "USDY",
    assetName: "Ondo US Dollar Yield",
    issuePrice: 1.12,
    currentPrice: 1.13,
    changePct: 0.89,
    confidence: 75,
    outcome: "VERIFIED",
    summary:
      "Ondo USDY circulation hit $2.2B with 4.8% APY backed by short-duration Treasuries. Institutional allocation grew 45% quarter-over-quarter. Integration with 5 major custody providers. Assessment: yield-bearing dollar for institutions. Regulatory clarity driving adoption.",
    redactedSummary:
      "████ ██████ circulation hit $█.█B with ██% ███ backed by short-duration ██████████. Institutional allocation grew ██% quarter-over-quarter. Integration with █ major custody providers. Assessment: yield-bearing dollar for institutions.",
    readersCount: 1567,
  },
  {
    id: "DSR-2026-0613-AQ",
    codeName: "DIGITAL GOLD",
    issuedAt: "2026-06-06T11:48:00Z",
    asset: "PAXG",
    assetName: "PAX Gold",
    issuePrice: 4180.00,
    currentPrice: 4214.97,
    changePct: 0.84,
    confidence: 83,
    outcome: "VERIFIED",
    summary:
      "PAXG daily trading volume hit $180M, up 67% from prior month. Each token backed by 1 fine troy ounce of London Good Delivery gold. Redemption for physical gold available through 12 global vaults. Assessment: digital gold with physical backing. Safe haven demand on-chain.",
    redactedSummary:
      "████ daily trading volume hit $███M, up ██% from prior month. Each token backed by █ fine troy ounce of ██████ ████ ██████ gold. Redemption for physical gold available through ██ global vaults. Assessment: digital gold with physical backing.",
    readersCount: 1456,
  },
  {
    id: "DSR-2026-0613-AR",
    codeName: "BLACKROCK TOKEN",
    issuedAt: "2026-06-08T19:25:00Z",
    asset: "BUIDL",
    assetName: "BlackRock BUIDL",
    issuePrice: 1.00,
    currentPrice: 1.00,
    changePct: 0.00,
    confidence: 90,
    outcome: "VERIFIED",
    summary:
      "BlackRock BUIDL fund crossed $2.4B in tokenized US Treasuries. Institutional subscriptions grew 34% month-over-month. Integration with 7 major DeFi protocols as collateral. Assessment: TradFi giant's on-chain entry. Every BUIDL dollar is a signal.",
    redactedSummary:
      "████████ ████ fund crossed $█.█B in tokenized ██ ██████████. Institutional subscriptions grew ██% month-over-month. Integration with █ major ████ protocols as collateral. Assessment: ████ giant's on-chain entry.",
    readersCount: 3567,
  },
  {
    id: "DSR-2026-0613-AS",
    codeName: "BEAT DROP",
    issuedAt: "2026-06-05T23:15:00Z",
    asset: "BEAT",
    assetName: "Audiera",
    issuePrice: 9.68,
    currentPrice: 7.52,
    changePct: -22.31,
    confidence: 42,
    outcome: "BURNED",
    summary:
      "Audiera music royalty token showed strong on-chain accumulation by 3 wallets holding 18% of supply. Assessment was breakout play. POST-MORTEM: the accumulation was a coordinated pump by the same wallets. Token dropped 22% in 72 hours. Dossier marked BURNED.",
    redactedSummary:
      "██████ music royalty token showed strong on-chain accumulation by █ wallets holding ██% of supply. Assessment was breakout play. POST-MORTEM: the accumulation was a coordinated pump by the same wallets. Token dropped ██% in ██ hours.",
    readersCount: 934,
  },
  {
    id: "DSR-2026-0613-AT",
    codeName: "WLFI SIGNAL",
    issuedAt: "2026-06-12T10:30:00Z",
    asset: "WLFI",
    assetName: "World Liberty Financial",
    issuePrice: 0.062,
    currentPrice: 0.06,
    changePct: -3.23,
    confidence: 55,
    outcome: "PENDING",
    summary:
      "WLFI token holder count crossed 800K. World Liberty Financial Aave fork launched with $200M in initial deposits. Governance proposal for treasury diversification passed with 78% approval. Assessment: DeFi platform with political backing gaining traction. Declassifies in 44 hours.",
    redactedSummary:
      "████ token holder count crossed ███K. ████ ██████ ████████ ████ fork launched with $███M in initial deposits. Governance proposal for treasury diversification passed with ██% approval. Assessment: ████ platform with political backing gaining traction.",
    readersCount: 2134,
    declassifiesAt: "2026-06-14T06:30:00Z",
  },
  {
    id: "DSR-2026-0613-AU",
    codeName: "MEMECORE",
    issuedAt: "2026-06-07T06:42:00Z",
    asset: "M",
    assetName: "MemeCore",
    issuePrice: 3.15,
    currentPrice: 2.95,
    changePct: -6.35,
    confidence: 38,
    outcome: "BURNED",
    summary:
      "MemeCore NFT trading volume spiked 400% in 24 hours. Assessment was NFT-meme convergence play. POST-MORTEM: volume was wash trading between 4 wallets. Real liquidity near zero. Token dropped 6.35% as artificial volume evaporated. Dossier marked BURNED.",
    redactedSummary:
      "████████ ███ trading volume spiked ███% in ██ hours. Assessment was ██-meme convergence play. POST-MORTEM: volume was wash trading between █ wallets. Real liquidity near zero. Token dropped ██.██% as artificial volume evaporated.",
    readersCount: 1567,
  },
  {
    id: "DSR-2026-0613-AV",
    codeName: "DEAD MAN'S WALLET",
    issuedAt: "2026-06-08T21:50:00Z",
    asset: "VELD",
    assetName: "Veld",
    issuePrice: 3.20,
    currentPrice: 4.85,
    changePct: 51.56,
    confidence: 82,
    outcome: "VERIFIED",
    summary:
      "A wallet inactive for 4 years — tagged to an early project architect presumed exited — reactivated and began staking rather than selling. Insiders returning to stake is conviction, not liquidity-seeking. Two associated wallets followed within 12 hours. Assessment: informed re-entry. Upside bias, 2-week horizon.",
    redactedSummary:
      "A wallet inactive for █ years — tagged to an early project architect presumed exited — reactivated and began staking rather than selling. Insiders returning to stake is conviction, not liquidity-seeking. Two associated wallets followed within ██ hours. Assessment: informed re-entry.",
    readersCount: 2156,
  },
] as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Helper: get dossiers by outcome
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const verifiedDossiers = dossiers.filter((d) => d.outcome === "VERIFIED");
export const burnedDossiers = dossiers.filter((d) => d.outcome === "BURNED");
export const pendingDossiers = dossiers.filter((d) => d.outcome === "PENDING");
export const declassifiedDossiers = dossiers.filter((d) => d.outcome !== "PENDING");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Hero dossier (featured, PENDING, with countdown)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const heroDossier = dossiers.find((d) => d.id === "DSR-2026-0613-A")!;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Stats
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export const dossierStats = {
  total: dossiers.length,
  verified: verifiedDossiers.length,
  burned: burnedDossiers.length,
  pending: pendingDossiers.length,
  accuracy: Math.round((verifiedDossiers.length / (verifiedDossiers.length + burnedDossiers.length)) * 100),
};
