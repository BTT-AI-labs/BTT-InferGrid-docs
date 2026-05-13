---
title: Miner CLI Configuration
sidebar_label: Configuration
---

# Miner CLI Configuration

`miner-cli` deployments are described by a YAML file. The config is parsed into `DeploymentConfig` before rendering Docker Compose.

## Core Fields

| Field | Required | Default | Description |
| --- | --- | --- | --- |
| `name` | yes | none | Deployment name and Compose service name. |
| `engine` | yes | none | `vllm` or `sglang`. |
| `model` | yes | none | Hugging Face model id or engine model path. |
| `image` | no | engine default | Runtime Docker image. Pin this for reproducible deployments. |
| `host` | no | `0.0.0.0` | Runtime bind host inside the container. |
| `port` | no | `8000` | Runtime API port. |
| `tensor_parallel` | no | `1` | Tensor parallel degree and expected GPU shard count. |
| `gpu_ids` | no | `all` | Docker GPU selector. |
| `trust_remote_code` | no | `true` | Adds the runtime trust flag. |
| `dtype` | no | `bfloat16` | Runtime dtype. |
| `max_model_len` | no | none | Maximum model context length. |
| `api_key` | no | none | Optional runtime API key. |
| `hf_token_env` | no | `HF_TOKEN` | Host environment variable copied into deployment `.env`. |
| `hf_cache` | no | `/data/huggingface` | Host path for model cache persistence. |
| `shm_size` | no | `16g` | Container shared memory size. |
| `extra_args` | no | `[]` | Extra engine CLI arguments. |
| `env` | no | `{}` | Extra runtime container environment variables. |
| `extra_services` | no | `{}` | Additional Compose services appended under `services`. |

## Example Config

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

Enable `dcgm_exporter` to expose GPU metrics:

```yaml
dcgm_exporter:
  enabled: true
  gpus: all
```

Default service behavior:

| Setting | Default |
| --- | --- |
| Image | `nvcr.io/nvidia/k8s/dcgm-exporter:3.3.9-3.6.1-ubuntu22.04` |
| Service name | `dcgm-exporter` |
| Port mapping | `9400:9400` |
| Capability | `SYS_ADMIN` |

The agent reads metrics from:

```text
http://dcgm-exporter:9400/metrics
```

## Miner Agent Sidecar

Enable `miner_client` to run the `miner-agent` sidecar:

```yaml
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

When enabled, `miner-cli` injects defaults unless you override them:

| Environment variable | Default |
| --- | --- |
| `MODELDOCK_DEPLOYMENT_NAME` | deployment `name` |
| `MINER_RUNTIME_TYPE` | config `engine` |
| `MINER_HTTP_HOST` | `listen_host` |
| `MINER_HTTP_PORT` | `listen_port` |
| `MINER_PUBLIC_IP` | `miner_client.public_ip` |
| `MINER_VLLM_BASE_URL` | `http://<deployment-name>:<port>` |
| `MINER_DCGM_METRICS_URL` | `http://dcgm-exporter:9400/metrics` when DCGM is enabled |

`miner_client.image` and `miner_client.public_ip` are required when `miner_client.enabled=true`.

## Backward Compatibility

`custom_service` is still accepted as a legacy alias for `miner_client`. Do not set both fields in the same config.
