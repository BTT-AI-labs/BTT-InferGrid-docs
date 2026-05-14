---
id: intro
title: BTTInferGrid 文档
sidebar_label: 概览
slug: /
---

# BTTInferGrid 文档

本文档描述 BTTInferGrid 算力网络中的矿工侧组件。

当前项目集由两个核心项目组成：

- `miner-cli`：矿工服务命令行部署工具，用于检查 Linux GPU 主机、渲染 Docker Compose、启动推理运行时并管理生命周期。
- `miner-agent`：矿工节点控制面代理，运行在推理服务内网中，负责注册、心跳、挑战验证和本地诊断。

默认运行形态是单台 NVIDIA GPU 矿工主机上的三容器拓扑：

| 容器 | 职责 |
| --- | --- |
| 大模型运行时 | 运行 `vllm` 或 `sglang`，暴露 OpenAI 兼容 `/v1` API。 |
| `dcgm-exporter` | 通过 `/metrics` 暴露 NVIDIA GPU 指标。 |
| `miner-agent` | 注册节点、签名控制面消息、发送心跳、处理挑战并暴露本地健康 API。 |

## 项目映射

| 项目 | 包名 | 入口命令 | 用途 |
| --- | --- | --- | --- |
| `miner-cli` | `miner-cli` | `miner-cli` | 单机 Docker 化 LLM 部署助手。 |
| `miner-agent` | `miner-agent` | `miner-agent` | FastAPI 控制面 sidecar，处理身份、注册、心跳和挑战。 |

## 典型流程

1. 安装 Python 3.10+，并使用 `uv` 或 `pip` 安装项目。
2. 使用 `miner-cli init` 生成部署 YAML。
3. 运行 `miner-cli doctor`、`miner-cli toolkit verify`、`miner-cli runtime prepare` 检查主机和运行时。
4. 使用 `miner-cli up` 启动模型运行时。
5. 在 YAML 中启用 `dcgm_exporter` 和 `miner_client`，运行指标与代理 sidecar。
6. 通过 agent 本地 API 检查存活、就绪、身份和控制面状态。