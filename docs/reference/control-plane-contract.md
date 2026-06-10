---
title: Control Plane Contract
sidebar_label: Control Plane Contract
---

# Control Plane Contract

This document describes the control-plane communication contract between `miner-agent` and `main-api`.

:::note
The agent sends signed JSON payloads to `main-api`.
:::

## Outbound Paths

The current client prefixes miner routes with `/api/v1`:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/miner/register` | Register node identity, wallet address, public endpoint, runtime type, and GPU inventory |
| `POST` | `/api/v1/miner/heartbeat` | Report signed host, GPU, runtime, and model status |
| `POST` | `/api/v1/miner/challenge` | Request a challenge for registration or reverification |
| `POST` | `/api/v1/miner/challenge/verify` | Submit a signed challenge answer |

:::warning
The source README refers to the V1 route layout without the `/api/v1` prefix. The implementation currently uses the prefixed paths above.
:::

## Registration Payload

Registration payload contains:

- `node_id`
- `node_public_key` (sent as base64)
- `node_key_type`
- `wallet_address`
- `name`
- `public_ip`
- `agent_version`
- `runtime_type`
- `gpus`
- `timestamp`
- `nonce`
- `sign_result`

`sign_result` is produced by signing the canonical digest with the node Ed25519 private key.

## Heartbeat Payload

Heartbeat payload contains:

- `node_id`
- `timestamp`
- Host metrics
- `gpus`
- `vllm`
- `nonce`
- `sign_result`

The `vllm` object includes:

- Runtime health
- Served models
- Model readiness
- Optional load data
- Probe errors when a probe fails

## Error Behavior

- HTTP failures during registration and heartbeat are stored in agent state and exposed through `/v1/miner/status` and `/readyz`
- If registration returns HTTP `409`, the client treats the node as registered but unverified and enters the challenge path

## Related Documentation

- [Miner Agent Overview](../miner-agent/overview.md)
- [Miner Agent Configuration](../miner-agent/configuration.md)
- [Miner Agent Local API](../miner-agent/local-api.md)
