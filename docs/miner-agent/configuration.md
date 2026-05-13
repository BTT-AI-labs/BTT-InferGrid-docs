---
title: Miner Agent Configuration
sidebar_label: Configuration
---

# Miner Agent Configuration

`miner-agent` is configured with environment variables.

## Required Variables

| Variable | Required | Description |
| --- | --- | --- |
| `MAIN_API_BASE_URL` | yes | Base URL of `main-api`. The agent appends miner API paths to this value. |
| `MINER_PUBLIC_IP` | yes | Public IP reported during registration for inference endpoints. |
| `MINER_TARGET_MODEL` | recommended | Expected served Hugging Face model id. Used when probing runtime model readiness. |

The implementation defaults `MINER_PUBLIC_IP` to `127.0.0.1`, but production deployments should set the real public IP explicitly.

## All Supported Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `LOG_LEVEL` | `info` | Logging level. |
| `MAIN_API_BASE_URL` | empty | Base URL for `main-api`. |
| `MINER_TOKEN` | empty | Shared token for miner API authentication. |
| `MINER_TOKEN_HEADER` | `X-Miner-Token` | Header name used for `MINER_TOKEN`. |
| `MINER_NAME` | hostname | Miner display name sent during registration. |
| `MINER_PUBLIC_IP` | `127.0.0.1` | Public IP reported during registration. |
| `MINER_REGION` | empty | Optional region reported during registration. |
| `MINER_RUNTIME_TYPE` | `vllm` | Runtime type reported during registration. |
| `MINER_VERSION` | package version | Agent version sent to the control plane. |
| `MINER_HOME` | `/root/.miner` | Persistent identity directory. |
| `MINER_HTTP_HOST` | `127.0.0.1` | Bind host for local diagnostics API. |
| `MINER_HTTP_PORT` | `8080` | Bind port for local diagnostics API. |
| `MINER_HEARTBEAT_INTERVAL_SECONDS` | `30` | Background heartbeat interval. |
| `MINER_REQUEST_TIMEOUT_SECONDS` | `10` | HTTP timeout for probes and control-plane calls. |
| `MINER_TARGET_MODEL` | empty | Expected model id served by the runtime. |
| `MINER_VLLM_BASE_URL` | `http://127.0.0.1:8000` | Local model runtime base URL. |
| `MINER_DCGM_METRICS_URL` | `http://dcgm-exporter:9400/metrics` | DCGM metrics endpoint. |
| `MODELDOCK_INFERENCE_BASE_URL` | empty | Fallback for `MINER_VLLM_BASE_URL`. |
| `MODELDOCK_DCGM_EXPORTER_URL` | empty | Fallback for `MINER_DCGM_METRICS_URL`. |
| `MODELDOCK_DEPLOYMENT_NAME` | `local` | Deployment name reported upstream. |

Explicit `MINER_*` probe URLs override `MODELDOCK_*` fallback URLs.

## Docker Sidecar Example

Use this through the `miner_client` block in a `miner-cli` config:

```yaml
miner_client:
  enabled: true
  image: your-registry/miner-agent:latest
  listen_host: 127.0.0.1
  listen_port: 8080
  public_ip: ${your public ip}
  volumes:
    - /data/minerhome:/root/.miner
  environment:
    LOG_LEVEL: info
    MAIN_API_BASE_URL: https://main-api.example.com
    MINER_TOKEN: replace-me
    MINER_TARGET_MODEL: Qwen/Qwen2.5-72B-Instruct
    MINER_HOME: /root/.miner
```

`miner-cli` automatically injects runtime-local defaults such as `MINER_VLLM_BASE_URL` and `MINER_DCGM_METRICS_URL` when the related sidecars are enabled.

## Authentication Header

When `MINER_TOKEN` is set, the agent sends it on every control-plane request:

```text
X-Miner-Token: <MINER_TOKEN>
```

Change the header name with `MINER_TOKEN_HEADER` if your control plane expects a different token header.
