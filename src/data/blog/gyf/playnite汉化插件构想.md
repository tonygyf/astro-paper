---
title: "Playnite汉化插件构想"
author: 郭岩峰
description: 基于VS Code开发Playnite游戏成就汉化插件的完整技术方案，包含环境配置、项目初始化、代码编写和打包流程。
pubDatetime: 2025-02-06T00:00:00Z
slug: playnite-achievement-translation-plugin
tags:
  - Playnite
  - 插件开发
  - C#
  - VS Code
  - 游戏汉化
  - 成就系统
ogImage: ""
featured: true
draft: false
---

最近安装playnite用于多平台游戏管理，主要是pirate游戏可以能弹成就。其中successstory 等众多插件让我发现英语文化code生态中强大的生命力。

可是我使用exophase导入本地成就时，发现大量成就是英文。这使得我观看体验大量下滑。而正版steam导入成就格式正确使用中文。发现中文社区不好，我想到可以在successstory导入本地存储元数据后进行汉化，我又想到了谷歌的页面翻译，可以使用免费的接口和playnite sdk快速开发。但是我不满足于cmd pwn开发，都做到这里了为什么不接着做一个直接拖进去导入的插件呢？先局限于成就，后面做大可以对于一些游戏描述翻译，感觉不难。可是使用c#开发等难住了我，我已经2年不用了，环境臃肿，于是我想出使用vscode+vibecoding开发？
以下是使用 **VS Code** 开发并打包 Playnite 插件的纯命令行/插件化流程：

---

### 1. 环境准备
1.  **安装 .NET SDK**：确保安装了 [.NET SDK](https://dotnet.microsoft.com/download)（建议安装 .NET 6 或更高版本，Playnite 10 插件通常基于 .NET 6/core 架构）。
2.  **VS Code 插件**：在 VS Code 里安装 `C# Dev Kit` 或 `C#` 扩展。
3.  **下载 Playnite Toolbox**：这是官方提供的命令行工具，[点击此处下载](https://playnite.link/docs/master/tutorials/extensions/general.html)。建议将其路径加入环境变量，或者直接把 `Playnite.Toolbox.exe` 放在你的开发文件夹里。

---

### 2. 初始化项目 (通过命令行)
在你想存放项目的文件夹里打开终端，运行：
```bash
# 创建一个名为 SuccessStoryTranslator 的通用插件项目
.\Playnite.Toolbox.exe new GenericPlugin SuccessStoryTranslator
```
这会生成一个文件夹，结构如下：
*   `SuccessStoryTranslator.cs` (核心代码)
*   `extension.yaml` (插件元数据)
*   `SuccessStoryTranslator.csproj` (项目文件)

---

### 3. 使用 VS Code 编写代码
1.  用 VS Code 打开该文件夹。
2.  **添加依赖库**：打开 VS Code 终端，运行以下命令添加翻译库和 JSON 处理库：
    ```bash
    dotnet add package GTranslate
    dotnet add package Newtonsoft.Json
    ```
3.  **修改代码**：将我之前提供的 C# 逻辑写入 `SuccessStoryTranslator.cs`。
    *注意：在 VS Code 中，如果你看到红线，通常是因为缺少 `using` 引用，按 `Ctrl + .` 自动修复即可。*

---

### 4. 打包过程 (严格流程)

打包并不依赖 Visual Studio 的“生成”按钮，而是分为两步：**编译** 和 **打包**。

#### 第一步：编译 (使用 .NET CLI)
在 VS Code 终端运行：
```bash
dotnet build -c Release
```
这会在 `bin/Release/net6.0/`（具体版本取决于配置）目录下生成 `.dll` 文件。

#### 第二步：打包 (使用 Toolbox)
这是生成 `.pext` 的关键步骤。将编译生成的 DLL 文件和 `extension.yaml` 放在一起，然后运行：
```bash
# pack 命令格式：.\Playnite.Toolbox.exe pack <项目文件夹路径> <输出目标路径>
.\Playnite.Toolbox.exe pack "C:\Path\To\YourProject" "C:\Desktop"
```
**注意**：`Playnite.Toolbox` 会自动识别项目文件夹里的文件并打包成 `.pext`。

---

### 5. 为什么说 VS Code 反而更方便？
*   **轻量**：不用为了一个小插件下载几个 GB 的 Visual Studio。
*   **命令行掌控**：通过 `dotnet build` 和 `Playnite.Toolbox pack` 两个命令就能完成所有事，可以写成一个简单的 `.bat` 批处理文件，以后一键打包。

---

### 总结全套方案的“极简配置”：

如果你决定用 VS Code，你只需要：
1.  **代码**：监听 SuccessStory 的 JSON 变动或通过右键菜单触发。
2.  **翻译器**：直接用 `GTranslate` 库调用谷歌翻译接口（免费且逻辑简单）。
3.  **打包脚本**：写一个 `build.bat` 放在根目录：
    ```batch
    dotnet build -c Release
    Playnite.Toolbox.exe pack . .\Output
    echo 打包完成！
    pause
    ```

**这个流程已经是最精简的了。** 只要你把代码写进去，运行一下这个批处理，你的桌面上就会出现一个 `.pext` 安装包。

