---
title: Miner CLI 配置
sidebar_label: 配置
---

# Miner CLI 配置

`miner-cli` 使用 YAML 描述部署。配置会被解析为 `DeploymentConfig` 后再渲染 Docker Compose。

## 核心字段

| 字段 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `name` | 是 | 无 | 部署名和 Compose service 名。 |
| `engine` | 是 | 无 | `vllm` 或 `sglang`。 |
| `model` | 是 | 无 | Hugging Face model id 或 engine 模型路径。 |
| `image` | 否 | engine 默认 | 运行时 Docker 镜像。生产建议固定。 |
| `host` | 否 | `0.0.0.0` | 容器内运行时绑定地址。 |
| `port` | 否 | `8000` | 运行时 API 端口。 |
| `tensor_parallel` | 否 | `1` | Tensor parallel 度数。 |
| `gpu_ids` | 否 | `all` | Docker GPU 选择器。 |
| `trust_remote_code` | 否 | `true` | 添加运行时 trust flag。 |
| `dtype` | 否 | `bfloat16` | 运行时 dtype。 |
| `max_model_len` | 否 | 无 | 最大上下文长度。 |
| `api_key` | 否 | 无 | 可选运行时 API key。 |
| `hf_token_env` | 否 | `HF_TOKEN` | 写入部署 `.env` 的宿主机环境变量名。 |
| `hf_cache` | 否 | `/data/huggingface` | 模型缓存路径。 |
| `shm_size` | 否 | `16g` | 容器共享内存大小。 |
| `extra_args` | 否 | `[]` | 额外 engine CLI 参数。 |
| `env` | 否 | `{}` | 额外运行时容器环境变量。 |
| `extra_services` | 否 | `{}` | 追加到 Compose `services` 下的服务。 |

## 示例配置

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

默认指标地址：

```text
http://dcgm-exporter:9400/metrics
```

## Miner Agent Sidecar

通过 `miner_client` 启用 `miner-agent` sidecar：

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

启用后，`miner-cli` 会注入默认环境变量，包括 `MODELDOCK_DEPLOYMENT_NAME`、`MINER_RUNTIME_TYPE`、`MINER_HTTP_HOST`、`MINER_HTTP_PORT`、`MINER_PUBLIC_IP`、`MINER_VLLM_BASE_URL`，以及启用 DCGM 时的 `MINER_DCGM_METRICS_URL`。

`miner_client.enabled=true` 时必须设置 `miner_client.image` 和 `miner_client.public_ip`。

## 兼容性

`custom_service` 仍作为 `miner_client` 的历史别名被接受。同一配置中不要同时设置两者。
