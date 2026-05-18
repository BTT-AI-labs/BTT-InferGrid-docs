---
title: Miner Agent 概览
sidebar_label: 概览
---

# Miner Agent 概览

本文档描述 `miner-agent` 的定位、功能边界和核心概念。

## 定位

`miner-agent` 是去中心化矿工部署中的**节点侧控制面代理**。

它通常运行在模型运行时和 `dcgm-exporter` 旁边。在 `miner-cli` 生成的 Compose 拓扑中，agent 通过 `miner_client` 配置块启用。

## 启动后做什么

`miner-agent` 启动后会：

1. 加载 `${MINER_HOME}/config.json`
2. 如果配置不存在，生成新的节点身份和钱包身份
3. 启动 FastAPI 诊断服务
4. 调用矿工注册接口
5. 发送初始心跳
6. 按固定间隔重复心跳
7. 当注册或心跳响应要求挑战时，拉取并回答挑战

## 心跳收集内容

每次心跳会收集：

- 主机 CPU 和内存快照
- 来自 `nvidia-smi` 的 GPU inventory，失败时回退到 DCGM
- 运行时 `/health`
- 运行时 `/v1/models`
- 可选运行时 `/load`
- 来自 DCGM `/metrics` 的 GPU 指标

## 不做什么

:::danger 重要边界
`miner-agent` 不负责：
- 启动、停止或托管模型运行时（由 `miner-cli` 通过 Docker Compose 管理）
- 调度、计费、收益结算或模型路由
- 仅负责报告本地节点状态并回答控制面验证挑战
:::

## 身份模型

身份持久化路径：`${MINER_HOME}/config.json`

包含字段：

- `node_id`
- `node_key_type`
- `node_public_key`
- `node_private_key`
- `wallet_key_type`
- `wallet_public_key`
- `wallet_private_key`
- `wallet_address`
- `created_at`

### 身份细节

| 项目 | 说明 |
| --- | --- |
| `node_id` | 来自 Ed25519 公钥，使用 libp2p 风格 Peer ID |
| 签名 | 挑战和控制面 payload 使用 Ed25519 节点私钥签名 |
| `wallet_address` | 来自 secp256k1 密钥对，使用 EVM 风格地址 |
| 目录权限 | 尽力设置为 `0700` |
| 文件权限 | 尽力设置为 `0600` |

:::warning 身份持久化
Docker 部署时必须持久化 `${MINER_HOME}`。丢失该文件会生成新的节点身份。
:::

## 后台循环

身份初始化后，agent 会启动一个后台循环。每轮循环：

1. 等待 `MINER_HEARTBEAT_INTERVAL_SECONDS`
2. 如果尚未注册则再次注册
3. 发送心跳
4. 如果控制面要求挑战则处理挑战

HTTP 失败会记录到内存状态，并通过本地 status API 暴露。

## 相关文档

- [Miner Agent 配置](./configuration)
- [Miner Agent 本地 API](./local-api)
- [控制面契约](../reference/control-plane-contract)
