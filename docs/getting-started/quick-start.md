---
title: Quick Start
sidebar_label: Quick Start
---

# Quick Start

This flow starts from `miner-cli` and adds `miner-agent` as a sidecar through the deployment YAML.

## 1. Generate a Deployment Config

```bash
uv run miner-cli init qwen72b \
  --engine vllm \
  --model Qwen/Qwen2.5-72B-Instruct \
  --tp 8 \
  --port 8000
```

The generated file is `qwen72b.yaml`. For `vllm`, the default generated image is currently `vllm/vllm-openai:latest`. The CLI warns when a floating `latest` tag is used because upstream CUDA or driver requirements can change.

## 2. Check the Host

```bash
uv run miner-cli doctor
```

If Docker or NVIDIA container support is missing, prepare the host toolkit:

```bash
uv run miner-cli toolkit install
uv run miner-cli toolkit verify --smoke-test
```

## 3. Prepare Runtime Images

For private Hugging Face models, export the token expected by the YAML config:

```bash
export HF_TOKEN=hf_xxx
```

Then validate the runtime:

```bash
uv run miner-cli runtime prepare --engine vllm -f qwen72b.yaml --smoke-test
```

## 4. Enable Metrics and Agent Sidecars

Edit the YAML config and enable `dcgm_exporter` plus `miner_client`:

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

The volume mounted at `/root/.miner` persists node identity and wallet identity across container restarts.

## 5. Start the Deployment

```bash
uv run miner-cli up -f qwen72b.yaml
```

Skip the deployment-time GPU smoke test only when you have already verified Docker GPU access:

```bash
uv run miner-cli up -f qwen72b.yaml --skip-smoke-test
```

The runtime endpoint is exposed at:

```text
http://127.0.0.1:8000/v1
```

## 6. Operate the Deployment

```bash
uv run miner-cli status qwen72b
uv run miner-cli logs qwen72b -f
uv run miner-cli stop qwen72b
uv run miner-cli rm qwen72b --purge-files
```

The rendered deployment files are stored under:

```text
~/.miner-cli/deployments/<deployment-name>/
```
