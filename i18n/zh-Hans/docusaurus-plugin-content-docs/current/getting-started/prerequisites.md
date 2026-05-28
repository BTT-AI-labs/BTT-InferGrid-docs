---
title: 前置条件
sidebar_label: 前置条件
---

# 前置条件

本文档描述部署 BTT InferGrid 矿工侧组件的前置条件。矿工侧栈面向一台带 NVIDIA GPU 的 Linux 主机。

## 主机要求

| 要求 | 说明 |
| --- | --- |
| Linux x86_64 | 主机操作系统 |
| NVIDIA 驱动 | 已安装并可用 |
| `nvidia-smi` | GPU 驱动管理工具 |
| Docker | 当前操作者可使用 |
| NVIDIA Container Toolkit | Docker GPU 支持 |
| Python | 3.10+ |
| `uv` | 推荐作为源码开发和运行工具 |

:::note
`miner-cli` 不讨论安装完整 NVIDIA 驱动。驱动安装和基础 GPU 可见性由主机管理员负责。
:::

## 安装 uv

`uv` 是快速的 Python 包管理工具：

```bash
# 方式一：官方安装脚本
curl -LsSf https://astral.sh/uv/install.sh | sh

# 方式二：pip 安装
pip install uv
```

验证安装：

```bash
uv --version
```

## 使用 miner-cli

### 方式一：从源码运行

```bash
cd miner-cli
uv sync
uv run miner-cli doctor
```

### 方式二：安装到当前 Python 环境

```bash
cd miner-cli
pip install .
miner-cli doctor
```

## 开发检查

两个项目都使用 Python package entrypoint 和 pytest 测试：

```bash
# 安装开发依赖并运行测试
uv sync --extra dev
uv run pytest

# 代码检查
uv run --extra dev ruff check .
```

:::tip
请在对应项目目录下运行上述命令。
:::

## 下一步

环境验证通过后，开始[快速开始](./quick-start.md)。
