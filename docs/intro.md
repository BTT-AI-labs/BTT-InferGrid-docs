---
id: intro
title: BTTInferGrid Documentation
sidebar_label: Overview
slug: /
---

# BTTInferGrid Documentation

This documentation describes the miner-side components in the BTTInferGrid compute network.

The current repository set contains two core projects:

- `miner-cli` is the miner service command-line deployment tool. It checks a Linux GPU host, renders Docker Compose, starts the inference runtime, and manages the deployment lifecycle.
- `miner-agent` is the miner node control-plane agent. It runs inside the inference service network and handles registration, heartbeat, challenge verification, and local diagnostics.

The default operating model is a single miner host with NVIDIA GPUs and three cooperating containers:

| Container | Responsibility |
| --- | --- |
| LLM runtime | Runs `vllm` or `sglang` and exposes an OpenAI-compatible `/v1` API. |
| `dcgm-exporter` | Exposes NVIDIA GPU metrics on `/metrics`. |
| `miner-agent` | Registers the node, signs control-plane messages, sends heartbeats, handles challenges, and exposes local health APIs. |

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
