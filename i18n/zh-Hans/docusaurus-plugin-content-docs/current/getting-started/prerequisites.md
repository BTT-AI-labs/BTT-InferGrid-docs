---
title: 前置条件
sidebar_label: 前置条件
---

# 前置条件

矿工侧栈面向一台带 NVIDIA GPU 的 Linux 主机。

## 主机要求

- Linux x86_64 主机
- 已安装并可用的 NVIDIA 驱动
- `nvidia-smi` GPU驱动管理工具
- 当前操作者可使用 Docker
- Docker 已配置 NVIDIA Container Toolkit
- Python 3.10+
- 推荐使用 `uv` 作为源码开发和运行工具

`miner-cli` 本文档不讨论安装完整 NVIDIA 驱动。驱动安装和基础 GPU 可见性仍由主机管理员负责。

## 安装 uv

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv --version
```

也可以使用：

```bash
pip install uv
```

## 从源码使用`miner-cli`

`miner-cli`：

```bash
cd miner-cli
uv sync
uv run miner-cli doctor
```

或安装到当前 Python 环境：

```bash
cd miner-cli
pip install .
miner-cli doctor
```

## 开发检查

两个项目都使用 Python package entrypoint 和 pytest 测试。

```bash
uv sync --extra dev
uv run pytest
uv run --extra dev ruff check .
```

请在对应项目目录下运行。
