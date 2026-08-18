import type { DogEnergy, Mood } from '../data/menu';

export const KPGS_PROGRESSIVE_UPDATE = {
  canonicalRepository: 'RobynAwesome/Introduction-to-MCP',
  canonicalCommit: '6eeb285d0775a7e74ceadc06e32b4068fcfbc595',
  schema: 'kpgs.progressive-update.v1',
  receiptSchema: 'kpgs.swfus.receipt.v1',
  boundaryMarker: '#NB',
} as const;

const STORAGE_KEY = 'paws-potjie:progressive-comfort:v1';
const CLIENT_KEY = 'paws-potjie:progressive-client:v1';

export const SWFUS_STAGES = [
  'TELEMETRY',
  'CLASSIFICATION',
  'ROUTING',
  'PROTOCOL_SELECTION',
  'INVARIANT_AUDIT',
  'POC_FOC_CHECK',
  'STATE_UPDATE',
  'DISTRIBUTION',
] as const;

export type ComfortChoice = {
  mood: Mood;
  energy: DogEnergy;
  selected_by: 'human';
};

export type ProgressiveUpdate = {
  schema: 'kpgs.progressive-update.v1';
  update_id: string;
  node_id: string;
  operation: 'CREATE' | 'UPDATE';
  lane: 'comfort-compass-preference';
  context_route: 'paws-potjie/comfort-compass';
  protocol: 'human-explicit-preference';
  idempotency_key: string;
  value: ComfortChoice;
  apu_status: 'UNSPECIFIED';
  poc_validated: true;
  foc_detected: false;
  invariant_passed: true;
  authority_effect: 'none';
  state_class: 'non_authoritative';
  evidence_refs: string[];
  correlation_id: string;
  source: 'paws-potjie-comfort-compass';
  expected_version: number | null;
  boundary_marker: '#NB';
};

export type SwfusReceipt = {
  schema: 'kpgs.swfus.receipt.v1';
  receipt_id: string;
  update_id: string;
  node_id: string;
  operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
  disposition: 'APPLIED' | 'OBSERVED' | 'HELD' | 'REJECTED';
  stages: Array<{ stage: (typeof SWFUS_STAGES)[number]; status: string; reason: string }>;
  synchronized: boolean;
  canonical_authority_changed: false;
  state_digest: string | null;
  evidence_refs: string[];
  correlation_id: string;
  boundary_marker: '#NB';
  replayed: boolean;
  created_at: string;
};

export type ComfortSyncState = 'local' | 'pending' | 'applied' | 'held' | 'rejected';

export type ComfortSyncSnapshot = {
  choice: ComfortChoice;
  status: ComfortSyncState;
  queued: number;
  remoteVersion: number;
  lastReceipt: SwfusReceipt | null;
};

type StoredState = {
  schema: 'paws-potjie.progressive-comfort.v1';
  clientId: string;
  choice: ComfortChoice;
  remoteVersion: number;
  queue: ProgressiveUpdate[];
  lastReceipt: SwfusReceipt | null;
};

const validMood = (value: unknown): value is Mood =>
  value === 'slow' || value === 'sunny' || value === 'bold';

const validEnergy = (value: unknown): value is DogEnergy =>
  value === 'nap' || value === 'stroll' || value === 'zoomies';

const nonEmpty = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const makeId = (prefix: string) => {
  const token = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${token}`;
};

const volatileClientId = makeId('client-volatile');
let volatileState: StoredState | null = null;

function cloneState(state: StoredState): StoredState {
  return JSON.parse(JSON.stringify(state)) as StoredState;
}

function getClientId() {
  if (typeof window === 'undefined') return 'ssr';
  try {
    const existing = localStorage.getItem(CLIENT_KEY);
    if (existing) return existing;
    const created = makeId('client');
    localStorage.setItem(CLIENT_KEY, created);
    return created;
  } catch {
    return volatileClientId;
  }
}

function defaultState(): StoredState {
  return {
    schema: 'paws-potjie.progressive-comfort.v1',
    clientId: getClientId(),
    choice: { mood: 'slow', energy: 'stroll', selected_by: 'human' },
    remoteVersion: 0,
    queue: [],
    lastReceipt: null,
  };
}

function isSwfusReceipt(value: unknown): value is SwfusReceipt {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<SwfusReceipt>;
  return item.schema === KPGS_PROGRESSIVE_UPDATE.receiptSchema
    && nonEmpty(item.receipt_id)
    && nonEmpty(item.update_id)
    && nonEmpty(item.node_id)
    && ['CREATE', 'READ', 'UPDATE', 'DELETE'].includes(item.operation || '')
    && ['APPLIED', 'OBSERVED', 'HELD', 'REJECTED'].includes(item.disposition || '')
    && typeof item.synchronized === 'boolean'
    && item.canonical_authority_changed === false
    && (item.state_digest === null || typeof item.state_digest === 'string')
    && Array.isArray(item.evidence_refs)
    && item.evidence_refs.every(nonEmpty)
    && typeof item.correlation_id === 'string'
    && item.boundary_marker === '#NB'
    && typeof item.replayed === 'boolean'
    && nonEmpty(item.created_at)
    && Array.isArray(item.stages)
    && item.stages.length === SWFUS_STAGES.length
    && item.stages.every((stage, index) =>
      stage.stage === SWFUS_STAGES[index]
      && nonEmpty(stage.status)
      && typeof stage.reason === 'string');
}

function isProgressiveUpdate(value: unknown): value is ProgressiveUpdate {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<ProgressiveUpdate>;
  return item.schema === KPGS_PROGRESSIVE_UPDATE.schema
    && nonEmpty(item.update_id)
    && nonEmpty(item.node_id)
    && (item.operation === 'CREATE' || item.operation === 'UPDATE')
    && item.lane === 'comfort-compass-preference'
    && item.context_route === 'paws-potjie/comfort-compass'
    && item.protocol === 'human-explicit-preference'
    && nonEmpty(item.idempotency_key)
    && item.apu_status === 'UNSPECIFIED'
    && item.poc_validated === true
    && item.foc_detected === false
    && item.invariant_passed === true
    && item.authority_effect === 'none'
    && item.state_class === 'non_authoritative'
    && Array.isArray(item.evidence_refs)
    && item.evidence_refs.length > 0
    && item.evidence_refs.every(nonEmpty)
    && item.boundary_marker === '#NB'
    && (item.expected_version === null
      || (Number.isInteger(item.expected_version) && (item.expected_version ?? -1) >= 0))
    && Boolean(item.value)
    && validMood(item.value?.mood)
    && validEnergy(item.value?.energy)
    && item.value?.selected_by === 'human';
}

function parseState(raw: string | null): StoredState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    if (parsed.schema !== 'paws-potjie.progressive-comfort.v1'
      || !nonEmpty(parsed.clientId)
      || !parsed.choice
      || !validMood(parsed.choice.mood)
      || !validEnergy(parsed.choice.energy)
      || parsed.choice.selected_by !== 'human'
      || !Number.isInteger(parsed.remoteVersion)
      || (parsed.remoteVersion ?? -1) < 0
      || !Array.isArray(parsed.queue)
      || !parsed.queue.every(isProgressiveUpdate)
      || (parsed.lastReceipt !== null && parsed.lastReceipt !== undefined && !isSwfusReceipt(parsed.lastReceipt))) {
      return null;
    }

    return {
      schema: 'paws-potjie.progressive-comfort.v1',
      clientId: parsed.clientId,
      choice: parsed.choice,
      remoteVersion: parsed.remoteVersion ?? 0,
      queue: parsed.queue,
      lastReceipt: parsed.lastReceipt ?? null,
    };
  } catch {
    return null;
  }
}

function readState(): StoredState {
  if (typeof window === 'undefined') return defaultState();

  try {
    const persisted = parseState(localStorage.getItem(STORAGE_KEY));
    if (persisted) {
      volatileState = cloneState(persisted);
      return persisted;
    }
  } catch {
    // Browser privacy/storage policy may deny localStorage. Keep the app usable
    // with a process-local fallback; this never upgrades persistence claims.
  }

  if (volatileState) return cloneState(volatileState);
  const fresh = defaultState();
  volatileState = cloneState(fresh);
  return fresh;
}

function writeState(state: StoredState) {
  volatileState = cloneState(state);
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Volatile fallback already holds the state. The UI remains functional but
    // must not claim durable persistence when the browser denies storage.
  }
}

function snapshot(state: StoredState, override?: ComfortSyncState): ComfortSyncSnapshot {
  const status: ComfortSyncState = override
    ?? (state.queue.length > 0 ? 'pending' : state.lastReceipt?.disposition === 'APPLIED' ? 'applied' : 'local');
  return {
    choice: state.choice,
    status,
    queued: state.queue.length,
    remoteVersion: state.remoteVersion,
    lastReceipt: state.lastReceipt,
  };
}

export function loadComfortSync(): ComfortSyncSnapshot {
  return snapshot(readState());
}

export function progressiveUpdateEndpoint() {
  return import.meta.env.VITE_KPGS_PROGRESSIVE_UPDATE_ENDPOINT?.trim() || '';
}

export function queueComfortChoice(choice: Omit<ComfortChoice, 'selected_by'>): ComfortSyncSnapshot {
  const state = readState();
  const nextChoice: ComfortChoice = { ...choice, selected_by: 'human' };

  // Clicking an already selected value is observation, not a new mutation.
  if (state.choice.mood === nextChoice.mood && state.choice.energy === nextChoice.energy) {
    return snapshot(state, state.queue.length > 0 ? 'pending' : undefined);
  }

  state.choice = nextChoice;

  // Queue immutable governed requests. Later clicks never rewrite an update that may
  // already have reached the Hub, which preserves exact-retry/idempotency semantics.
  const projectedVersion = state.remoteVersion + state.queue.length;
  const operation: ProgressiveUpdate['operation'] = projectedVersion === 0 ? 'CREATE' : 'UPDATE';
  const updateId = makeId('paws-comfort');
  const update: ProgressiveUpdate = {
    schema: KPGS_PROGRESSIVE_UPDATE.schema,
    update_id: updateId,
    node_id: `paws-potjie:comfort-compass:${state.clientId}`,
    operation,
    lane: 'comfort-compass-preference',
    context_route: 'paws-potjie/comfort-compass',
    protocol: 'human-explicit-preference',
    idempotency_key: `paws-potjie:${state.clientId}:${updateId}`,
    value: nextChoice,
    apu_status: 'UNSPECIFIED',
    poc_validated: true,
    foc_detected: false,
    invariant_passed: true,
    authority_effect: 'none',
    state_class: 'non_authoritative',
    evidence_refs: ['ui://comfort-compass/explicit-human-selection'],
    correlation_id: state.clientId,
    source: 'paws-potjie-comfort-compass',
    expected_version: projectedVersion === 0 ? null : projectedVersion,
    boundary_marker: KPGS_PROGRESSIVE_UPDATE.boundaryMarker,
  };

  state.queue.push(update);
  writeState(state);
  return snapshot(state, progressiveUpdateEndpoint() ? 'pending' : 'local');
}

let activeSync: Promise<ComfortSyncSnapshot> | null = null;

export function syncComfortQueue(): Promise<ComfortSyncSnapshot> {
  if (activeSync) return activeSync;
  activeSync = syncComfortQueueInternal().finally(() => { activeSync = null; });
  return activeSync;
}

async function syncComfortQueueInternal(): Promise<ComfortSyncSnapshot> {
  const endpoint = progressiveUpdateEndpoint();
  let state = readState();

  if (!endpoint || typeof navigator === 'undefined' || !navigator.onLine) {
    return snapshot(state, endpoint ? 'pending' : 'local');
  }

  while (state.queue.length > 0) {
    const current = state.queue[0];
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(current),
      });
    } catch {
      return snapshot(readState(), 'pending');
    }

    if (!response.ok) return snapshot(readState(), 'pending');

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      return snapshot(readState(), 'pending');
    }

    if (!isSwfusReceipt(body)
      || body.update_id !== current.update_id
      || body.node_id !== current.node_id
      || body.operation !== current.operation) {
      return snapshot(readState(), 'rejected');
    }

    // Re-read before applying the receipt so a second human click that was queued
    // while the request was in flight cannot be lost by a stale local snapshot.
    const latest = readState();
    const currentIndex = latest.queue.findIndex((queued) =>
      queued.update_id === current.update_id
      && queued.idempotency_key === current.idempotency_key);

    if (currentIndex !== 0) {
      return snapshot(latest, 'rejected');
    }

    latest.lastReceipt = body;

    if (body.disposition === 'APPLIED' && body.synchronized) {
      latest.queue.shift();
      latest.remoteVersion += 1;
      writeState(latest);
      state = latest;
      continue;
    }

    writeState(latest);
    if (body.disposition === 'HELD') return snapshot(latest, 'held');
    if (body.disposition === 'REJECTED') return snapshot(latest, 'rejected');
    return snapshot(latest, 'pending');
  }

  writeState(state);
  return snapshot(state, state.lastReceipt?.disposition === 'APPLIED' ? 'applied' : 'local');
}
