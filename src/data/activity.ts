export interface ActivityEntry {
  id: number;
  agent: string;
  action: string;
  target: string;
  timestamp: string;
}

export const activityTicker: readonly ActivityEntry[] = [
  {
    id: 1,
    agent: "SPECTRE-7",
    action: "updated dossier",
    target: "DSR-003 / IRON MERIDIAN",
    timestamp: "14:22:05",
  },
  {
    id: 2,
    agent: "WRAITH-3",
    action: "flagged intercept",
    target: "SWIFT ORION-7",
    timestamp: "14:23:18",
  },
  {
    id: 3,
    agent: "CIPHER-12",
    action: "decrypted payload",
    target: "NODE 14.275 MHz",
    timestamp: "14:24:41",
  },
  {
    id: 4,
    agent: "NOMAD-1",
    action: "archived dossier",
    target: "DSR-002 / GLASS ORACLE",
    timestamp: "14:25:55",
  },
  {
    id: 5,
    agent: "ECHO-9",
    action: "cross-referenced",
    target: "dark pool prints ↔ options flow",
    timestamp: "14:27:03",
  },
  {
    id: 6,
    agent: "VECTOR-4",
    action: "initiated sweep",
    target: "shell entity network (Cayman)",
    timestamp: "14:28:37",
  },
] as const;
