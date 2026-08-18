# Comfort Compass Progressive Updates

Paws & Potjie adapts live, but it does not invent a private synchronization protocol.

The Comfort Compass consumes the canonical KPGS contract pinned from:

```text
RobynAwesome/Introduction-to-MCP
@ 6eeb285d0775a7e74ceadc06e32b4068fcfbc595

Adaptive Progressive Updates (APU)
  -> Progressive Update
  -> #NB
  -> bounded CRUD
  -> SWFUS
```

## What changes progressively

Only the visitor's explicit Comfort Compass choice is admitted:

```json
{
  "mood": "slow | sunny | bold",
  "energy": "nap | stroll | zoomies",
  "selected_by": "human"
}
```

This state is a `non_authoritative` preference. It is not restaurant truth, veterinary advice, user identity, or constitutional KPGS state.

Device capability inference remains local runtime telemetry in `src/lib/experience.ts`. WebGL, Save-Data, reduced motion, CPU/memory hints and viewport shape influence presentation but are not promoted into SWFUS user preference records.

## Offline-first behavior

A button press follows:

```text
human click
  -> update React view immediately
  -> persist locally
  -> append immutable Progressive Update to FIFO queue
  -> if offline/no endpoint: stop here safely
  -> if connected: POST exact queued update
  -> validate kpgs.swfus.receipt.v1
  -> APPLIED + synchronized=true: dequeue
  -> HELD: preserve queue + disclose held state
  -> REJECTED: preserve queue + disclose blocked state
```

A refresh may retry an existing queue. A refresh does **not** manufacture a new Progressive Update.

## Idempotency

Every queued update receives a unique update ID and idempotency key. Once created, that request is not rewritten. A retry sends the exact same governed content so the canonical Hub adapter can return the original receipt without repeating the effect.

A later human click is a new update rather than a mutation of an older in-flight request.

## Optimistic versions

The local record tracks only the number of updates that received an admitted synchronized receipt. The first mutation is `CREATE`; later mutations are `UPDATE` with `expected_version`.

If the remote non-authoritative projection is newer, missing, restarted, or otherwise disagrees, the client does not silently repair history. It preserves the queue and surfaces `HELD`/pending state until a governed reconciliation path exists.

## Browser authority boundary

The browser may construct `kpgs.progressive-update.v1` because the human explicitly selected a bounded preference. It may **not** construct a fake `kpgs.swfus.receipt.v1`.

Only a returned receipt that passes the exact schema/stage validation and matches the queued update ID, node ID and operation can clear the queue.

```text
local availability != synchronized
synchronized != canonical authority
interaction != product claim
```

## Deployment configuration

The synchronization endpoint is optional:

```text
VITE_KPGS_PROGRESSIVE_UPDATE_ENDPOINT=
```

Leaving it empty produces a fully functional local-first challenge experience. A configured deployment can point it at the Sovereign Hub canonical adapter path, for example the deployed equivalent of:

```text
POST /kpgs/progressive-updates
```

No live endpoint is hard-coded because deployment evidence and DNS routing remain separate from source-code proof.
