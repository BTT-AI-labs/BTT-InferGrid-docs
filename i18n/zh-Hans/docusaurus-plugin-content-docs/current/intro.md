---
id: intro
title: 开源 DePIN 矿工文档
sidebar_label: 概览
slug: /
---

# 开源 DePIN 矿工文档

本文档描述去中心化 AI 算力网络中的矿工侧开源组件。

当前项目集由两个核心 Python 项目组成：

- `miner-cli`：矿工主机部署工具，用于检查 Linux GPU 主机、渲染 Docker Compose、启动推理运行时并管理生命周期。
- `miner-agent`：矿工节点控制面代理，运行在推理服务旁边，负责注册、心跳、挑战验证和本地诊断。

默认运行形态是单台 NVIDIA GPU 矿工主机上的三容器拓扑：

| 容器 | 职责 |
| --- | --- |
| 推理运行时 | 运行 `vllm` 或 `sglang`，暴露 OpenAI 兼容 `/v1` API。 |
| `dcgm-exporter` | 通过 `/metrics` 暴露 NVIDIA GPU 指标。 |
| `miner-agent` | 注册节点、签名控制面消息、发送心跳、处理挑战并暴露本地健康 API。 |

V1 不做集群调度和多租户编排。目标是形成稳定的矿工节点闭环：准备 GPU 主机，部署模型运行时，挂载指标与身份，然后持续向控制面上报签名状态。

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

## 文档范围

这些页面基于 `miner-agent` 和 `miner-cli` 当前 README 以及相邻实现契约整理，描述 V1 代码已经具备的能力和边界：

- 不包含集群调度器
- `miner-cli` 不安装完整 NVIDIA 驱动
- `miner-agent` 不启动或停止模型进程
- 这两个矿工侧包不包含结算、收益或路由逻辑
