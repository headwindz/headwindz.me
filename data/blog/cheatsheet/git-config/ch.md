---
title: 我的 Git 配置
summary: 我的 Git 配置，以及每项设置的作用。
---

## 我的 Git 配置

```shell
[branch]
  sort = -committerdate
[tag]
  sort = version:refname
[diff]
  algorithm = histogram
  colorMoved = plain
  mnemonicPrefix = true
  renames = true
[push]
  default = simple
  autoSetupRemote = true
  followTags = true
[init]
  defaultBranch = main
[pull]
  rebase = true
[core]
  editor = vim
[user]
  name = headwindz
  email = zhengjianhua.michael@gmail.com
[commit]
  verbose = true
[merge]
  conflictstyle = zdiff3
```

## 分支设置

```shell
[branch]
  sort = -committerdate
```

**`sort = -committerdate`**：列出分支时（例如运行 `git branch`），按最近提交日期排序。减号表示降序，最近有提交的分支会排在最上面，方便找到活跃分支。

## 标签设置

```shell
[tag]
  sort = version:refname
```

**`sort = version:refname`**：按版本号排序标签。例如，`v1.2.0` 会排在 `v1.10.0` 前面，后面才是 `v2.0.0`，而不是按字母顺序把 `v1.10.0` 排到 `v1.2.0` 前面。

## 差异比较设置

```shell
[diff]
  algorithm = histogram
  colorMoved = plain
  mnemonicPrefix = true
  renames = true
```

**`algorithm = histogram`**：使用 histogram 算法生成差异。它对齐文本的方式可能与默认的 Myers 算法不同。可以先用自己的改动比较两种输出，再选更适合的一种。

**`colorMoved = plain`**：用不同的颜色标出差异中被移动的行。代码只是换了位置时，Git 会加上视觉提示，方便审查重构。

**`mnemonicPrefix = true`**：在差异中使用含义更明确的前缀。例如，使用 `i/`（索引）、`w/`（工作树）、`c/`（提交）或 `o/`（对象）代替 `a/` 和 `b/`，便于判断文件来自哪里。

**`renames = true`**：检测文件重命名，并在差异中显示为重命名，便于追踪文件历史。

## 推送设置

```shell
[push]
  default = simple
  autoSetupRemote = true
  followTags = true
```

**`default = simple`**：运行未指定分支的 `git push` 时，将当前分支推送到上游分支，并要求两者同名。这是现代 Git 默认采用的保守选项。

**`autoSetupRemote = true`**：首次推送新的本地分支时自动设置上游分支。直接运行 `git push` 即可，省去手动执行 `git push -u origin branch-name`。

**`followTags = true`**：推送远端缺少的附注标签，前提是这些标签指向的提交可从本次推送的引用到达。轻量标签不包含在内。参见 [Git push 文档](https://git-scm.com/docs/git-push#Documentation/git-push.txt---follow-tags)。

## 初始化设置

```shell
[init]
  defaultBranch = main
```

**`defaultBranch = main`**：新建仓库时，默认分支名设为 `main`，符合当前常用的 Git 分支命名惯例。

## 拉取设置

```shell
[pull]
  rebase = true
```

**`rebase = true`**：默认使用 `git pull --rebase`。把本地提交逐个重放到抓取的提交之上，可以保持线性历史并避免不必要的合并提交。效果相当于先运行 `git fetch`，再运行 `git rebase`。

## 编辑器设置

```shell
[core]
  editor = vim
```

**`editor = vim`**：将 `vim` 设为 Git 默认编辑器，用于编写提交信息、交互式变基和处理合并冲突等操作。也可以换成 `nano`、`code` 或自己习惯的编辑器。

## 作者信息

```shell
[user]
  name = headwindz
  email = zhengjianhua.michael@gmail.com
```

**`name`**：设置提交作者信息中显示的姓名。

**`email`**：设置提交作者信息中显示的邮箱。若希望 GitHub 或 GitLab 将提交关联到你的账号，请使用与账号关联的邮箱。

## 提交设置

```shell
[commit]
  verbose = true
```

**`verbose = true`**：在提交信息编辑器中显示改动的差异，方便在编写提交信息时直接检查改动，无需切换窗口。

## 合并设置

```shell
[merge]
  conflictstyle = zdiff3
```

**`conflictstyle = zdiff3`**：使用 zdiff3 冲突格式，展示原始共同祖先代码以及发生冲突的两侧内容。相比默认的 `merge` 格式，它给出了更多上下文，有助于理解冲突的来源。
