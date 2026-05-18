---
title: Quick Start
sidebar_label: Quick Start
---

# Quick Start

This document shows the complete flow from `miner-cli` to completed deployment.

## Flow Overview

1. Generate deployment config
2. Check the host
3. Prepare runtime
4. Enable metrics and Agent Sidecar
5. Start deployment
6. Operations commands

## 1. Generate Deployment Config

```bash
uv run miner-cli init qwen72b \
  --engine vllm \
  --model Qwen/Qwen2.5-72B-Instruct \
  --tp 8 \
  --port 8000
```

The generated file is `qwen72b.yaml`. For `vllm`, the default image is currently `vllm/vllm-openai:latest`.

:::warning Floating Tags
The CLI warns when a floating `latest` tag is used because upstream CUDA or driver requirements can change. Production deployments should pin the image version.
:::

## 2. Check the Host

```bash
uv run miner-cli doctor
```

If Docker or NVIDIA container support is missing:

```bash
# Install tools
uv run miner-cli toolkit install

# Verify installation
uv run miner-cli toolkit verify --smoke-test
```

## 3. Prepare Runtime

For private Hugging Face models, export the token first:

```bash
export HF_TOKEN=hf_xxx
```

Validate the runtime:

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

## 4. Enable Metrics and Agent Sidecar

Edit the YAML and enable `dcgm_exporter` and `miner_client`:

```yaml
dcgm_exporter:
  enabled: true
  gpus: all

miner_client:
  enabled: true
  image: your-registry/miner-agent:latest
  listen_host: 127.0.0.1
  listen_port: 8080
  public_ip: ${your public ip}
  gpus: all
  volumes:
    - /data/minerhome:/root/.miner
  environment:
    LOG_LEVEL: info
    MAIN_API_BASE_URL: https://main-api.example.com
    MINER_TOKEN: replace-me
    MINER_TARGET_MODEL: Qwen/Qwen2.5-72B-Instruct
    MINER_HOME: /root/.miner
    MINER_RUNTIME_TYPE: vllm
```

:::tip
The `/root/.miner` mounted volume persists node identity and wallet identity.
:::

## 5. Start Deployment

```bash
uv run miner-cli up -f qwen72b.yaml
```

Skip the GPU smoke test if Docker GPU access is already verified:

```bash
uv run miner-cli up -f qwen72b.yaml --skip-smoke-test
```

Runtime endpoint:

```text
http://127.0.0.1:8000/v1
```

## 6. Operations Commands

| Command | Purpose |
| --- | --- |
| `miner-cli status qwen72b` | View deployment status |
| `miner-cli logs qwen72b -f` | View logs in real-time |
| `miner-cli stop qwen72b` | Stop deployment |
| `miner-cli rm qwen72b --purge-files` | Delete deployment and clean up files |

Rendered deployment files are stored at:

```text
~/.miner-cli/deployments/<deployment-name>/
```

## Related Documentation

- [miner-cli Commands](../miner-cli/commands)
- [miner-cli Configuration](../miner-cli/configuration)
- [Troubleshooting](../operations/troubleshooting)
