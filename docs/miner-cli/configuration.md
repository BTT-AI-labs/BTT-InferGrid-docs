---
title: Miner CLI Configuration
sidebar_label: Configuration
---

# Miner CLI Configuration

This document describes the YAML configuration format for `miner-cli`. The config is parsed into `DeploymentConfig` before rendering Docker Compose.

## Core Fields

| Field | Required | Default | Description |
| --- | --- | --- | --- |
| `name` | Yes | none | Deployment name and Compose service name |
| `engine` | Yes | none | `vllm` or `sglang` |
| `model` | Yes | none | Hugging Face model id or engine model path |
| `image` | No | engine default | Runtime Docker image |
| `host` | No | `0.0.0.0` | Runtime bind host inside the container |
| `port` | No | `8000` | Runtime API port |
| `tensor_parallel` | No | `1` | Tensor parallel degree |
| `gpu_ids` | No | `all` | Docker GPU selector |
| `trust_remote_code` | No | `true` | Adds the runtime trust flag |
| `dtype` | No | `bfloat16` | Runtime dtype |
| `max_model_len` | No | none | Maximum context length |
| `api_key` | No | none | Optional runtime API key |
| `hf_token_env` | No | `HF_TOKEN` | Host environment variable for Hugging Face token |
| `hf_cache` | No | `/data/huggingface` | Model cache path |
| `shm_size` | No | `16g` | Container shared memory size |
| `extra_args` | No | `[]` | Extra engine CLI arguments |
| `env` | No | `{}` | Extra runtime container environment variables |
| `extra_services` | No | `{}` | Additional Compose services |

## Example Configuration

```yaml
name: qwen72b
engine: vllm
model: Qwen/Qwen2.5-72B-Instruct
image: vllm/vllm-openai:latest
host: 0.0.0.0
port: 8000
tensor_parallel: 8
gpu_ids: all
trust_remote_code: true
dtype: bfloat16
max_model_len: 32768
hf_token_env: HF_TOKEN
hf_cache: /data/huggingface
shm_size: 16g
extra_args:
  - --max-num-seqs
  - "16"
env: {}
```

## DCGM Exporter Sidecar

```yaml
dcgm_exporter:
  enabled: true
  gpus: all
```

Default metrics endpoint: `http://dcgm-exporter:9400/metrics`

## Miner Agent Sidecar

Enable `miner_client` to run the `miner-agent` sidecar:

```yaml
miner_client:
  enabled: true
  image: bttinfergrid/miner-client:latest
  listen_host: 127.0.0.1
  listen_port: 8080
  public_ip: miner.example.com
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
When enabled, `miner-cli` injects default environment variables including `MODELDOCK_DEPLOYMENT_NAME`, `MINER_RUNTIME_TYPE`, `MINER_HTTP_HOST`, `MINER_HTTP_PORT`, `MINER_PUBLIC_IP`, `MINER_VLLM_BASE_URL`, and `MINER_DCGM_METRICS_URL` when DCGM is enabled.
:::

:::warning Required Fields
`miner_client.image` and `miner_client.public_ip` are required when `miner_client.enabled=true`.
:::

## Backward Compatibility

`custom_service` is still accepted as a legacy alias for `miner_client`. Do not set both fields in the same config.

## Related Documentation

- [miner-cli Overview](./overview.md)
- [miner-cli Commands](./commands.md)
- [Troubleshooting](../operations/troubleshooting.md)
