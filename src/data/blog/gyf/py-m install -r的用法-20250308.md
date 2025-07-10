---
title: py-m install -r的用法-20250308
author: 郭岩峰
description: 介绍 py -m 和 pip install -r 的用法，讲解 Python 包管理、虚拟环境、依赖批量安装等常见开发技巧。
pubDatetime: 2025-03-08T00:00:00Z
slug: py-m-install-r-usage-20250308
tags:
  - Python
  - 包管理
  - pip
  - 虚拟环境
  - 依赖安装
ogImage: ""
featured: false
draft: false
---

`py -m` 是 **Python 解释器** 的一种用法，它的作用是 **以模块的方式运行 Python 包或模块**，类似于 `python -m`，但 `py -m` 在 Windows 上更通用，能够自动匹配正确的 Python 版本。

------

## **📌 `py -m` 作用**

```sh
py -m module_name
```

- `py` 是 Windows 下的 Python 启动器（Python Launcher）。
- `-m` 让 Python **以模块的方式运行** `module_name`，而不是手动找到 `.py` 文件运行。

------

## **✅ 常见用法**

### **1️⃣ 运行 `pip`**

```sh
py -m pip install requests
```

**等同于**：

```sh
python -m pip install requests
```

**作用**：
 ✅ 确保使用的是正确的 Python 解释器，即使系统里安装了多个 Python 版本。

------

### **2️⃣ 运行 `http.server`（快速启动本地 HTTP 服务器）**

```sh
py -m http.server 8080
```

🔹 **作用**：启动一个本地 Web 服务器，访问 `http://localhost:8080` 直接查看当前目录下的文件。

------

### **3️⃣ 运行 `venv`（创建虚拟环境）**

```sh
py -m venv myenv
```

🔹 **作用**：创建一个名为 `myenv` 的 Python 虚拟环境。

------

### **4️⃣ 运行 `unittest`（执行单元测试）**

```sh
py -m unittest test_script.py
```

🔹 **作用**：执行 Python 测试脚本 `test_script.py` 里的单元测试。

------

## **🚀 为什么用 `py -m` 而不是 `python -m`？**

- `py` **自动匹配** 你安装的 Python 版本，而 `python` 可能需要手动指定。
- **避免 Python 版本冲突**：如果你安装了多个 Python 版本（比如 `Python 3.8` 和 `Python 3.10`），使用 `py -m` 运行可以确保 `pip` 和其他工具用的是正确的 Python 版本。

------

## **🔹 总结**

| **命令**                | **作用**                             |
| ----------------------- | ------------------------------------ |
| `py -m pip install xxx` | 安装 Python 包，确保使用正确的 `pip` |
| `py -m http.server`     | 启动本地 HTTP 服务器                 |
| `py -m venv myenv`      | 创建 Python 虚拟环境                 |
| `py -m unittest`        | 运行单元测试                         |

你可以试试看 `py -m pip install requests`，看看是否能成功运行！🔥

------

在 Python 中，`install -r` 通常用于 `pip`，表示 **从一个文件（通常是 `requirements.txt`）中批量安装依赖**。

### **完整命令**

```sh
pip install -r requirements.txt
```

### **作用**

- `-r` 参数表示 **从文件读取包列表**，然后 `pip` 会 **自动安装** 该文件中列出的所有依赖。
- `requirements.txt` 是一个文本文件，里面包含了该项目所需的所有 Python 依赖包。

------

### **示例**

假设 `requirements.txt` 内容如下：

```
numpy==1.21.0
requests>=2.25.1
Flask
```

执行：

```sh
pip install -r requirements.txt
```

等同于：

```sh
pip install numpy==1.21.0 requests>=2.25.1 Flask
```

它会安装 `numpy` 版本 `1.21.0`，`requests` 版本 `2.25.1` 或更高，以及 `Flask` 最新版本。

------

### **如何生成 `requirements.txt`**

如果你想把当前环境的所有已安装包保存到 `requirements.txt`，可以使用：

```sh
pip freeze > requirements.txt
```

然后，你可以在另一台机器上运行：

```sh
pip install -r requirements.txt
```

这样就能**快速安装相同的依赖环境**。

------

### **总结**

- `pip install -r requirements.txt` 是 **批量安装 Python 依赖包** 的常用方法。
- `-r` 让 `pip` 从文件读取依赖，而不是一个个手动安装。
- 可以用 `pip freeze > requirements.txt` 生成 `requirements.txt` 以备份环境。

你可以试试看，有什么问题随时问我！🚀