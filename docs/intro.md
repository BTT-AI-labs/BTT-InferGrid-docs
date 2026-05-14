---
id: intro
title: Open DePIN Miner Documentation
sidebar_label: Overview
slug: /
---

# BTTInferGrid Documentation

This documentation describes the open-source miner-side components for a decentralized AI compute network.

The current repository set is intentionally small:

- `miner-cli` is the host deployment helper. It checks a Linux GPU host, renders Docker Compose files, starts the inference runtime, and manages lifecycle commands.
- `miner-agent` is the node-side control-plane agent. It runs beside the inference runtime and reports registration, heartbeat, challenge, and local diagnostic state to `main-api`.

The default operating model is a single miner host with NVIDIA GPUs and three cooperating containers:

| Container | Responsibility |
| --- | --- |
| Inference runtime | Runs `vllm` or `sglang` and exposes an OpenAI-compatible `/v1` API. |
| `dcgm-exporter` | Exposes NVIDIA GPU metrics on `/metrics` for collection by the agent. |
| `miner-agent` | Registers the node, signs control-plane messages, sends heartbeats, handles challenges, and exposes local health APIs. |

The V1 design avoids cluster scheduling and multi-tenant orchestration. The target is a reproducible miner-node loop: prepare a GPU host, deploy a model runtime, attach metrics and identity, then keep the control plane updated with signed status.

## Repository Map

| Project | Package | Primary entrypoint | Purpose |
| --- | --- | --- | --- |
| `miner-cli` | `miner-cli` | `miner-cli` | Docker-based deployment helper for single Linux hosts. |
| `miner-agent` | `miner-agent` | `miner-agent` | FastAPI control-plane sidecar for miner identity, registration, heartbeat, and challenge flow. |

## Typical Operator Flow

1. Install Python 3.10+ and `uv` or install the package with `pip`.
2. Use `miner-cli init` to generate a deployment YAML file.
3. Run `miner-cli doctor`, `miner-cli toolkit verify`, and `miner-cli runtime prepare` to validate host and runtime readiness.
4. Start the model runtime with `miner-cli up`.
5. Enable `dcgm_exporter` and `miner_client` in the YAML config to run the metrics exporter and agent sidecars.
6. Use the agent local API to inspect liveness, readiness, identity, and recent control-plane state.

## Documentation Scope

These docs are generated from the current `README.md` files and nearby implementation contracts in `miner-cli` and `miner-agent`. They document what the V1 code does today, including known boundaries:

- no cluster scheduler
- no full NVIDIA driver installation by the CLI
- no automatic model process management inside `miner-agent`
- no settlement or revenue logic in these two miner-side packages
