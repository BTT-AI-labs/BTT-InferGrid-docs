---
title: Miner Agent Local API
sidebar_label: Local API
---

# Miner Agent Local API

This document describes the local FastAPI diagnostics API exposed by `miner-agent`.

:::warning Security Recommendation
These endpoints are for local diagnostics and operations. Do not expose them publicly without network controls.
:::

## Basic Information

- **Default address**: `http://127.0.0.1:8080`
- **Port control**: Determined by `miner_client` config

## Endpoint Overview

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/healthz` | Process liveness |
| `GET` | `/readyz` | Readiness based on registration, heartbeat recency, and challenge state |
| `GET` | `/v1/miner/status` | Current settings and in-memory agent state |
| `GET` | `/v1/miner/identity` | Public view of the persisted identity |
| `POST` | `/v1/miner/register` | Trigger one registration attempt |
| `POST` | `/v1/miner/heartbeat` | Trigger one heartbeat attempt |
| `POST` | `/v1/miner/challenge` | Trigger one challenge flow with default purpose `reverify` |

## Liveness Check

Check if the process is running:

```bash
curl http://127.0.0.1:8080/healthz
```

Response:

```json
{
  "status": "ok"
}
```

## Readiness Check

Check if the node is ready:

```bash
curl -i http://127.0.0.1:8080/readyz
```

**Healthy response**:

```json
{
  "status": "ready",
  "registered": true,
  "verified": true,
  "last_error": null
}
```

**Degraded response** (HTTP `503`):

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
# View status
curl http://127.0.0.1:8080/v1/miner/status

# View identity
curl http://127.0.0.1:8080/v1/miner/identity
```

- `status` returns masked settings, registration state, verification state, recent responses, latest probe snapshot, and latest error
- `identity` hides private keys and returns only public identity fields

## Manual Control

Manually trigger registration, heartbeat, or challenge:

```bash
curl -X POST http://127.0.0.1:8080/v1/miner/register
curl -X POST http://127.0.0.1:8080/v1/miner/heartbeat
curl -X POST http://127.0.0.1:8080/v1/miner/challenge
```

## Related Documentation

- [Miner Agent Overview](./overview.md)
- [Miner Agent Configuration](./configuration.md)
- [Troubleshooting](../operations/troubleshooting.md)
