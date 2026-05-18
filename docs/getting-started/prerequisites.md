---
title: Prerequisites
sidebar_label: Prerequisites
---

# Prerequisites

This document describes the prerequisites for deploying the BTT InferGrid miner-side components. The miner-side stack is designed for one Linux host with NVIDIA GPUs.

## Host Requirements

| Requirement | Description |
| --- | --- |
| Linux x86_64 | Host operating system |
| NVIDIA driver | Installed and working |
| `nvidia-smi` | GPU driver management tool |
| Docker | Available to the current operator |
| NVIDIA Container Toolkit | Docker GPU support |
| Python | 3.10+ |
| `uv` | Recommended development and execution tool |

:::note
This documentation does not cover full NVIDIA driver installation. Driver installation and basic GPU visibility remain the host administrator's responsibility.
:::

## Install uv

`uv` is a fast Python package manager:

```bash
# Method 1: Official install script
curl -LsSf https://astral.sh/uv/install.sh | sh

# Method 2: pip install
pip install uv
```

Verify installation:

```bash
uv --version
```

## Use miner-cli

### Method 1: Run from source

```bash
cd miner-cli
uv sync
uv run miner-cli doctor
```

### Method 2: Install to current Python environment

```bash
cd miner-cli
pip install .
miner-cli doctor
```

## Development Checks

Both projects use Python package entrypoints and pytest-based tests:

```bash
# Install dev dependencies and run tests
uv sync --extra dev
uv run pytest

# Code linting
uv run --extra dev ruff check .
```

:::tip
Run these commands from each project's directory.
:::

## Next Steps

Once the environment is verified, proceed to [Quick Start](./quick-start).
