---
title: Miner Agent 本地 API
sidebar_label: 本地 API
---

# Miner Agent 本地 API

本文档描述 `miner-agent` 暴露的本地 FastAPI 诊断 API。

:::warning 安全建议
这些端点用于本地诊断和运维。不要在没有网络控制的情况下公开暴露。
:::

## 基础信息

- **默认地址**：`http://127.0.0.1:8080`
- **端口控制**：通过 `miner_client` 配置决定端口是否发布

## 端点概览

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/healthz` | 进程存活 |
| `GET` | `/readyz` | 基于注册、心跳新鲜度和挑战状态的就绪检查 |
| `GET` | `/v1/miner/status` | 当前设置和内存状态 |
| `GET` | `/v1/miner/identity` | 持久化身份的公开视图 |
| `POST` | `/v1/miner/register` | 触发一次注册 |
| `POST` | `/v1/miner/heartbeat` | 触发一次心跳 |
| `POST` | `/v1/miner/challenge` | 使用默认目的 `reverify` 触发一次挑战流程 |

## 存活检查

检查进程是否正常运行：

```bash
curl http://127.0.0.1:8080/healthz
```

响应：

```json
{
  "status": "ok"
}
```

## 就绪检查

检查节点是否就绪：

```bash
curl -i http://127.0.0.1:8080/readyz
```

**健康响应**：

```json
{
  "status": "ready",
  "registered": true,
  "verified": true,
  "last_error": null
}
```

**降级响应**（HTTP `503`）：

```json
{
  "status": "degraded",
  "registered": false,
  "verified": false,
  "last_error": "register failed: ..."
}
```

## 状态与身份

```bash
# 查看状态
curl http://127.0.0.1:8080/v1/miner/status

# 查看身份
curl http://127.0.0.1:8080/v1/miner/identity
```

- `status` 返回脱敏后的 settings、注册状态、验证状态、最近响应、最近探测快照和最近错误
- `identity` 隐藏私钥，只返回公开身份字段

## 手动控制

手动触发注册、心跳或挑战：

```bash
curl -X POST http://127.0.0.1:8080/v1/miner/register
curl -X POST http://127.0.0.1:8080/v1/miner/heartbeat
curl -X POST http://127.0.0.1:8080/v1/miner/challenge
```

## 相关文档

- [Miner Agent 概览](./overview.md)
- [Miner Agent 配置](./configuration.md)
- [故障排查](../operations/troubleshooting.md)
