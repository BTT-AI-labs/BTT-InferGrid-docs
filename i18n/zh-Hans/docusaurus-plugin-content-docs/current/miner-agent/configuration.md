---
title: Miner Agent 配置
sidebar_label: 配置
---

# Miner Agent 配置

本文档描述 `miner-agent` 的配置方式。Agent 通过**环境变量**进行配置。

## 必要变量

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `MAIN_API_BASE_URL` | 是 | `main-api` 基础 URL，agent 会追加矿工 API path |
| `MINER_PUBLIC_IP` | 是 | 注册时上报的推理入口公网 IP |
| `MINER_TARGET_MODEL` | 建议 | 期望运行时服务的 Hugging Face model id |

:::warning
实现中 `MINER_PUBLIC_IP` 默认是 `127.0.0.1`，生产环境应显式设置真实公网 IP。
:::

## 支持变量

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `LOG_LEVEL` | `info` | 日志级别 |
| `MAIN_API_BASE_URL` | 空 | `main-api` 基础 URL |
| `MINER_TOKEN` | 空 | 矿工 API 共享 token |
| `MINER_TOKEN_HEADER` | `X-Miner-Token` | `MINER_TOKEN` 使用的 header 名 |
| `MINER_NAME` | hostname | 注册时上报的矿工展示名 |
| `MINER_PUBLIC_IP` | `127.0.0.1` | 注册时上报的公网 IP |
| `MINER_REGION` | 空 | 可选 region |
| `MINER_RUNTIME_TYPE` | `vllm` | 注册时上报的运行时类型 |
| `MINER_VERSION` | 包版本 | 上报的 agent 版本 |
| `MINER_HOME` | `/root/.miner` | 容器内的持久化身份目录 |
| `MINER_HTTP_HOST` | `127.0.0.1` | 本地诊断 API 绑定地址 |
| `MINER_HTTP_PORT` | `8080` | 本地诊断 API 端口 |
| `MINER_HEARTBEAT_INTERVAL_SECONDS` | `30` | 后台心跳间隔 |
| `MINER_REQUEST_TIMEOUT_SECONDS` | `10` | 探测和控制面请求超时 |
| `MINER_TARGET_MODEL` | 空 | 期望运行时服务的模型 id |
| `MINER_VLLM_BASE_URL` | `http://127.0.0.1:8000` | 本地模型运行时 base URL |
| `MINER_DCGM_METRICS_URL` | `http://dcgm-exporter:9400/metrics` | DCGM 指标地址 |
| `MODELDOCK_INFERENCE_BASE_URL` | 空 | `MINER_VLLM_BASE_URL` 回退值 |
| `MODELDOCK_DCGM_EXPORTER_URL` | 空 | `MINER_DCGM_METRICS_URL` 回退值 |
| `MODELDOCK_DEPLOYMENT_NAME` | `local` | 上报的部署名 |

:::note
显式 `MINER_*` 探测 URL 优先于 `MODELDOCK_*` 回退 URL。
:::

## Docker Sidecar 示例

在 `miner-cli` 配置的 `miner_client` 块中使用：

```yaml
miner_client:
  enabled: true
  image: bttinfergrid/miner-client:latest
  listen_host: 127.0.0.1
  listen_port: 8080
  public_ip: miner.example.com
  volumes:
    - /data/minerhome:/root/.miner
  environment:
    LOG_LEVEL: info
    MAIN_API_BASE_URL: https://main-api.example.com
    MINER_TOKEN: replace-me
    MINER_TARGET_MODEL: Qwen/Qwen2.5-72B-Instruct
    MINER_HOME: /root/.miner
```

`volumes` 左侧的宿主机目录应使用 `/data/minerhome` 这类稳定、由运维账号管理的目录，不建议使用 `/root`。右侧容器内路径可以保持 `/root/.miner`，这是镜像内默认的 `MINER_HOME`。

:::tip
当相关 sidecar 启用时，`miner-cli` 会自动注入 `MINER_VLLM_BASE_URL` 和 `MINER_DCGM_METRICS_URL` 等运行时本地默认值。
:::

## 鉴权 Header

设置 `MINER_TOKEN` 后，agent 会在每次控制面请求中发送：

```http
X-Miner-Token: <MINER_TOKEN>
```

如果控制面需要不同 header 名，可通过 `MINER_TOKEN_HEADER` 修改。

## 相关文档

- [Miner Agent 概览](./overview.md)
- [Miner Agent 本地 API](./local-api.md)
- [控制面契约](../reference/control-plane-contract.md)
