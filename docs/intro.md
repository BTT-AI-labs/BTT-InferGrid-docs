---
id: intro
title: BTT InferGrid Documentation
sidebar_label: Overview
slug: /
---

# BTT InferGrid Documentation

This documentation describes the **miner-side components** in the BTT InferGrid compute network, for developers and operators who need to deploy and manage inference services on NVIDIA GPU hosts.

:::tip Prerequisites
Familiarity with Linux command line, Docker containers, and GPU inference concepts is recommended before reading.
:::

## Core Projects

The current repository set consists of two core components:

| Project | Purpose | Entry Command |
| --- | --- | --- |
| `miner-cli` | Miner service command-line deployment tool | `miner-cli` |
| `miner-agent` | Node control-plane agent | `miner-agent` |

### miner-cli

Docker-based LLM deployment helper for single Linux hosts, responsible for:

- Checking Linux GPU host environment
- Rendering Docker Compose configurations
- Starting inference runtime and managing lifecycle

### miner-agent

FastAPI sidecar running in the inference service network, responsible for:

- Node registration and heartbeat
- Challenge verification
- Local diagnostics API

## Typical Deployment Topology

The default operating model is a three-container topology on a single NVIDIA GPU miner host:

| Container | Responsibility |
| --- | --- |
| LLM runtime | Runs `vllm` or `sglang`, exposes OpenAI-compatible `/v1` API |
| `dcgm-exporter` | Exposes NVIDIA GPU metrics on `/metrics` |
| `miner-agent` | Registers node, signs control-plane messages, sends heartbeats, handles challenges, exposes local health API |

## Quick Start Flow

1. Install Python 3.10+ and use `uv` or `pip` to install the project
2. Use `miner-cli init` to generate a deployment YAML
3. Run `miner-cli doctor` to check the host
4. Run `miner-cli toolkit verify` to validate GPU container support
5. Run `miner-cli runtime prepare` to prepare the runtime
6. Use `miner-cli up` to start the model runtime
7. Check liveness, readiness, identity, and control-plane state via the agent local API

:::info Related Documentation
- Detailed command reference: [miner-cli Commands](./miner-cli/commands)
- Configuration: [miner-cli Configuration](./miner-cli/configuration)
- Troubleshooting: [Operations Guide](./operations/troubleshooting)
:::
