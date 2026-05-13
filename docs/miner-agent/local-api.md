---
title: Miner Agent Local API
sidebar_label: Local API
---

# Miner Agent Local API

`miner-agent` exposes a local FastAPI diagnostics API. The default bind is:

```text
http://127.0.0.1:8080
```

When deployed through `miner-cli`, the sidecar can expose or publish this port based on the `miner_client` config.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/healthz` | Process liveness. |
| `GET` | `/readyz` | Readiness based on registration, heartbeat recency, and challenge state. |
| `GET` | `/v1/miner/status` | Current settings and in-memory agent state. |
| `GET` | `/v1/miner/identity` | Public view of the persisted identity. |
| `POST` | `/v1/miner/register` | Trigger one registration attempt. |
| `POST` | `/v1/miner/heartbeat` | Trigger one heartbeat attempt. |
| `POST` | `/v1/miner/challenge` | Trigger one challenge flow with the default purpose `reverify`. |

## Liveness

```bash
curl http://127.0.0.1:8080/healthz
```

Response:

```json
{
  "status": "ok"
}
```

## Readiness

```bash
curl -i http://127.0.0.1:8080/readyz
```

Healthy response:

```json
{
  "status": "ready",
  "registered": true,
  "verified": true,
  "last_error": null
}
```

Degraded response uses HTTP `503` and includes the current state:

```json
{
  "status": "degraded",
  "registered": false,
  "verified": false,
  "last_error": "register failed: ..."
}
```

## Status

```bash
curl http://127.0.0.1:8080/v1/miner/status
```

The response includes:

- public settings, with `MINER_TOKEN` masked
- registration state
- verification state
- last registration response
- last heartbeat response
- last challenge response
- last probe snapshot
- last error

## Identity

```bash
curl http://127.0.0.1:8080/v1/miner/identity
```

The response intentionally omits private keys:

```json
{
  "identity": {
    "node_id": "12D3Koo...",
    "node_key_type": "ed25519",
    "node_public_key": "...",
    "wallet_key_type": "secp256k1",
    "wallet_public_key": "...",
    "wallet_address": "0x...",
    "created_at": 1730000000
  }
}
```

## Manual Control Actions

Trigger one registration attempt:

```bash
curl -X POST http://127.0.0.1:8080/v1/miner/register
```

Trigger one heartbeat:

```bash
curl -X POST http://127.0.0.1:8080/v1/miner/heartbeat
```

Trigger one challenge flow:

```bash
curl -X POST http://127.0.0.1:8080/v1/miner/challenge
```

These endpoints are intended for local diagnostics and operations. Avoid exposing them publicly without network controls.
