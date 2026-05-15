---
title: Miner CLI Overview
sidebar_label: Overview
---

# Miner CLI Overview

`miner-cli` is a Docker-based deployment helper for running large language models on a single Linux host with NVIDIA GPUs.

It is intentionally narrow:

- no scheduler
- no cluster control plane
- no multi-tenant platform
- config to Compose to container to health check

## What It Does

`miner-cli` can:

- check whether the machine is ready for GPU containers
- generate a starter YAML config
- render Docker Compose deployment files
- start `vllm` or `sglang` containers
- run GPU and runtime smoke tests
- wait for `/v1/models` to become ready
- manage logs, status, stop, restart, remove, and list commands
- add `dcgm-exporter` and `miner-agent` sidecars when configured

## Artifact Layout

Deployment files are rendered into:

```text
~/.miner-cli/deployments/<name>/
```

The directory contains:

| File | Purpose |
| --- | --- |
| `config.yaml` | Copy of the source deployment config. |
| `compose.yaml` | Rendered Docker Compose file. |
| `.env` | Environment file containing the configured Hugging Face token variable. |

## Supported Engines

The config parser accepts:

- `vllm`
- `sglang` (future support)

The current focus is `vllm`.

## Image Tag Policy

The CLI supports `stable` and `latest` image policies when generating configs. The current default images are:

| Engine | Default image |
| --- | --- |
| `vllm` | `vllm/vllm-openai:latest` |
| `sglang` | `lmsysorg/sglang:latest` |

When a `vllm` image uses a floating `latest` tag, `miner-cli` warns during `init`, `runtime prepare`, and `up`. Pin `image` in the YAML config for production deployments.
