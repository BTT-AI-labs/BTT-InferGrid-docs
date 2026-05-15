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

Degraded responses use HTTP `503`:

```json
{
  "status": "degraded",
  "registered": false,
  "verified": false,
  "last_error": "register failed: ..."
}
```

## Status and Identity

```bash
curl http://127.0.0.1:8080/v1/miner/status
curl http://127.0.0.1:8080/v1/miner/identity
```

`status` returns masked settings, registration state, verification state, recent responses, the latest probe snapshot, and the latest error. `identity` hides private keys and returns only public identity fields.

## Manual Control

```bash
curl -X POST http://127.0.0.1:8080/v1/miner/register
curl -X POST http://127.0.0.1:8080/v1/miner/heartbeat
curl -X POST http://127.0.0.1:8080/v1/miner/challenge
```

These endpoints are intended for local diagnostics and operations. Avoid exposing them publicly without network controls.
