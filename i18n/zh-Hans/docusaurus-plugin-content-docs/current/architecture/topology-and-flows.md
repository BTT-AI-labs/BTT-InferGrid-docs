---
title: 拓扑与流程
sidebar_label: 拓扑与流程
---

# 拓扑与流程

矿工节点使用由 `miner-cli` 生成的三容器拓扑。

```mermaid
flowchart LR
  operator["操作者"]
  cli["miner-cli"]
  compose["Docker Compose 部署"]
  runtime["vllm"]
  dcgm["dcgm-exporter"]
  agent["miner-agent"]
  api["platform"]

  operator --> cli
  cli --> compose
  compose --> runtime
  compose --> dcgm
  compose --> agent
  agent --> runtime
  agent --> dcgm
  agent --> api
```

推理运行时负责服务模型并暴露 OpenAI 兼容端点。`dcgm-exporter` 提供 GPU 指标。`miner-agent` 读取运行时和指标状态，并把签名后的注册、心跳和挑战数据发送给平台。

## Agent 职责

`miner-agent` 不负责管理模型进程生命周期。它负责：

- 从 `${MINER_HOME}/config.json` 加载或生成身份（如需自定义身份，需挂载该目录并自定义config.json文件）
- 注册节点
- 按固定间隔发送签名心跳
- 在控制面要求时拉取并回答挑战
- 通过 `/metrics` 探测运行时
- 从 `dcgm-exporter` 读取 GPU 指标
- 暴露本地健康、就绪、身份和控制 API

## 启动流程

```mermaid
sequenceDiagram
  participant CLI as miner-cli
  participant Compose as Docker Compose
  participant Runtime as vllm/sglang
  participant Agent as miner-agent
  participant API as platform

  CLI->>Compose: 渲染 config 和 compose.yaml
  CLI->>Compose: docker compose up -d
  Compose->>Runtime: 启动推理运行时
  Compose->>Agent: 启动 miner-agent
  Agent->>Agent: 加载或生成身份
  Agent->>API: POST /api/v1/miner/register
  Agent->>Runtime: 探测 /health 和 /v1/models
  Agent->>API: POST /api/v1/miner/heartbeat
  API-->>Agent: 可选 challenge_required=true
  Agent->>API: POST /api/v1/miner/challenge
  Agent->>API: POST /api/v1/miner/challenge/verify
```

## 就绪模型

`/readyz` 在以下场景返回 `503`：

- 节点尚未注册
- `3 * MINER_HEARTBEAT_INTERVAL_SECONDS` 内没有成功心跳
- 仍有待处理挑战

这个就绪检查描述的是 agent 控制面状态，不等同于模型是否有足够业务容量。
