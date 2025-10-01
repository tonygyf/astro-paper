---
title: "GitHub Actions 自动合并更新脚本"
author: 郭岩峰
description: 配置 GitHub Actions 实现 fork 仓库与上游仓库的自动同步合并，确保代码库保持最新。
pubDatetime: 2025-10-01T00:00:00Z
slug: github-actions-auto-merge-script
tags:
  - GitHub Actions
  - 自动化
  - Git
  - Fork
ogImage: ""
featured: false
draft: false
---

这是一个用于 GitHub Actions 的 Workflow，旨在帮助你自动同步 fork 仓库与上游仓库的更新。

**目标仓库**：`tonygyf/tvbox` (fork 仓库)
**上游仓库**：`qist/tvbox`
**同步分支**：`master`

请在你的 fork 仓库中创建文件：`.github/workflows/auto-sync.yml`，并粘贴以下内容：

```yaml
name: Auto Sync Fork

on:
  schedule:
    - cron: '0 16 * * *'   # 每天北京时间 0 点执行 (UTC+8 → cron 要写 16点)
  workflow_dispatch:        # 也可以手动触发

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0   # 必须完整历史，才能合并

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

      - name: Add upstream
        run: |
          git remote add upstream https://github.com/qist/tvbox.git || true
          git fetch upstream

      - name: Merge upstream changes
        run: |
          git checkout master
          git merge upstream/master --no-edit || true

      - name: Push changes
        run: |
          git push origin master
```

------

## 🚀 在 GitHub 网页上新建 Workflow 文件

1. 打开你的 fork 仓库 **`tonygyf/tvbox`**。

2. 进入仓库后，点击上方的 **`Add file` → `Create new file`**。

3. 在新文件名输入框里，输入：

   ```
   .github/workflows/auto-sync.yml
   ```

   > ⚠️ 一定要写对路径：`.github/workflows/` 文件夹下才会被 GitHub 识别为 Actions workflow。

4. 在大编辑框里，把我给你的 **YAML 配置** 粘贴进去（就是前面那段 `name: Auto Sync Fork ...` 的内容）。

5. 滚到页面底部，填写 commit 信息（比如 `add auto sync workflow`）。

6. 点击 **Commit new file**。

这样 workflow 文件就新建好了 🎉

------

## 🔧 验证 & 启动

- 新建完成后，进入仓库的 **Actions** 标签页，你会看到 `Auto Sync Fork` 的 workflow。
- GitHub 默认会 **自动启用**，每天定时跑一次。
- 你也可以点开 workflow，手动点 **Run workflow** 来立即测试。

------

⚠️ 小提醒：

- 第一次运行时，你可以点 **Run workflow** 测试一下，确认能自动合并并 push。
- 如果以后发现冲突，它会失败；如果你想无论如何保持和上游一致，我可以帮你改成 **强制覆盖** 模式。

### 📌 说明：

1.  **自动执行时间**：每天北京时间 0 点运行（UTC 16 点）。
2.  **上游仓库**：`https://github.com/qist/tvbox.git`
3.  **同步分支**：`master`。如果上游仓库的分支名称发生变化（例如改为 `main`），你需要相应地更新 Workflow 文件中的分支名称。
4.  **冲突处理**：如果上游更新与你的 fork 仓库存在冲突，Workflow 将会跳过合并操作，不会导致 Workflow 失败。在这种情况下，你需要手动解决冲突。

### ⚠️ 强制覆盖同步版本（可选）

如果你希望无论如何都保持与上游仓库完全一致，即使存在冲突也强制覆盖你的更改，可以使用以下“强制覆盖同步”版本。**请谨慎使用此版本，因为它会丢失你在 fork 仓库中的任何本地修改。**

```yaml
name: Auto Sync Fork (Force Push)

on:
  schedule:
    - cron: '0 16 * * *'   # 每天北京时间 0 点执行 (UTC+8 → cron 要写 16点)
  workflow_dispatch:        # 也可以手动触发

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0   # 必须完整历史，才能合并

      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

      - name: Add upstream
        run: |
          git remote add upstream https://github.com/qist/tvbox.git || true
          git fetch upstream

      - name: Force Push upstream changes
        run: |
          git push origin upstream/master:master --force
```

### 📌 强制覆盖同步说明：

此版本会直接将上游仓库的 `master` 分支强制推送到你的 fork 仓库的 `master` 分支，覆盖所有本地更改。适用于你完全不关心 fork 仓库本地修改，只希望与上游保持绝对同步的场景。