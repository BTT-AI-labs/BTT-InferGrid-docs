---
title: Miner CLI Overview
sidebar_label: Overview
---

# Miner CLI Overview

This document describes the positioning, capabilities, and deployment file structure of `miner-cli`.

## Positioning

`miner-cli` is a **Docker-based deployment helper** for running large language models on a single NVIDIA GPU Linux host.

It is intentionally narrow:

- No scheduler
- No cluster control plane
- No multi-tenant platform
- Config → Compose → container → health check only

## Core Capabilities

`miner-cli` can:

- Check whether the machine is ready for GPU containers
- Generate a starter YAML config
- Render Docker Compose deployment files
- Start `vllm` or `sglang` containers
- Run GPU and runtime smoke tests
- Wait for `/v1/models` to become ready
- Manage logs, status, stop, restart, remove, and list
- Add `dcgm-exporter` and `miner-agent` sidecars when configured

## Artifact Layout

Deployment files are rendered into:

```text
~/.miner-cli/deployments/<name>/
```

| File | Purpose |
| --- | --- |
| `config.yaml` | Copy of the source deployment config |
| `compose.yaml` | Rendered Docker Compose file |
| `.env` | Environment file containing configured Hugging Face token |

## Supported Engines

Currently supported:

- `vllm` (**Current focus**)
- `sglang` (Future support)

## Image Tag Policy

The CLI supports `stable` and `latest` image policies when generating configs:

| Engine | Default image |
| --- | --- |
| `vllm` | `vllm/vllm-openai:latest` |

:::warning Production Recommendation
When a `vllm` image uses a floating `latest` tag, `miner-cli` warns during `init`, `runtime prepare`, and `up`. Production deployments should explicitly pin `image`.
:::

## Related Documentation

- [miner-cli Commands](./commands)
- [miner-cli Configuration](./configuration)
- [Quick Start](../getting-started/quick-start)
