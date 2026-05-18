---
id: intro
title: BTT InferGrid 文档
sidebar_label: 概览
slug: /
---

# BTT InferGrid 文档

本文档描述 BTT InferGrid 算力网络中的**矿工侧组件**，面向需要在 NVIDIA GPU 主机上部署和管理推理服务的开发者与运维人员。

:::tip 前置知识
建议熟悉 Linux 命令行、Docker 容器和 GPU 推理概念后再阅读。
:::

## 核心项目

当前项目集由两个核心组件构成：

| 项目 | 用途 | 入口命令 |
| --- | --- | --- |
| `miner-cli` | 矿工服务命令行部署工具 | `miner-cli` |
| `miner-agent` | 节点控制面代理 | `miner-agent` |

### miner-cli

单机 Docker 化 LLM 部署助手，负责：

- 检查 Linux GPU 主机环境
- 渲染 Docker Compose 配置
- 启动推理运行时并管理生命周期

### miner-agent

运行在推理服务内网中的 FastAPI sidecar，负责：

- 节点注册与心跳
- 挑战验证
- 本地诊断 API

## 典型部署拓扑

默认运行形态是单台 NVIDIA GPU 矿工主机上的三容器拓扑：

| 容器 | 职责 |
| --- | --- |
| 大模型运行时 | 运行 `vllm` 或 `sglang`，暴露 OpenAI 兼容 `/v1` API |
| `dcgm-exporter` | 通过 `/metrics` 暴露 NVIDIA GPU 指标 |
| `miner-agent` | 注册节点、签名控制面消息、发送心跳、处理挑战并暴露本地健康 API |

## 快速上手流程

1. 安装 Python 3.10+，并使用 `uv` 或 `pip` 安装项目
2. 使用 `miner-cli init` 生成部署 YAML
3. 运行 `miner-cli doctor` 检查主机
4. 运行 `miner-cli toolkit verify` 验证 GPU 容器支持
5. 运行 `miner-cli runtime prepare` 准备运行时
6. 使用 `miner-cli up` 启动模型运行时
7. 通过 agent 本地 API 检查存活、就绪、身份和控制面状态

:::info 相关文档
- 详细命令参考：[miner-cli 命令参考](./miner-cli/commands)
- 配置说明：[miner-cli 配置](./miner-cli/configuration)
- 故障排查：[操作指南](./operations/troubleshooting)
:::
