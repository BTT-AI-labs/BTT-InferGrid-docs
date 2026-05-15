---
title: Prerequisites
sidebar_label: Prerequisites
---

# Prerequisites

The miner-side stack is designed for one Linux host with NVIDIA GPUs.

## Host Requirements

- Linux x86_64 host
- NVIDIA driver installed and working on the host
- `nvidia-smi` GPU driver management tool
- Docker available to the current operator
- NVIDIA Container Toolkit configured for Docker GPU access
- Python 3.10+
- `uv` for the recommended development and execution workflow

This `miner-cli` documentation does not cover full NVIDIA driver installation. Driver installation and basic GPU visibility remain host administrator responsibilities.

## Install uv

Install `uv` before working from source:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv --version
```

You can also install it through `pip`:

```bash
pip install uv
```

## Use `miner-cli` From Source

For `miner-cli`:

```bash
cd miner-cli
uv sync
uv run miner-cli doctor
```

Or install it into the current Python environment:

```bash
cd miner-cli
pip install .
miner-cli doctor
```

## Development Checks

Both projects use Python package entrypoints and pytest-based tests.

```bash
uv sync --extra dev
uv run pytest
uv run --extra dev ruff check .
```

Run the commands from each project directory.
