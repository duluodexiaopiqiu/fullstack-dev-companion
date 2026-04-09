# 版本管理 (Version Management)

## 模块目标
建立规范的版本控制流程，确保代码安全、协作高效。

## 核心原则
1. **提交即文档**：每次提交都有清晰的目的描述
2. **分支即功能**：每个功能/修复使用独立分支
3. **合并有策略**：使用合适的合并策略保持历史清晰
4. **发布有版本**：遵循语义化版本控制规范

## Git基础配置

### 1. 用户配置
```bash
# 设置全局用户名和邮箱
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"

# 设置默认编辑器（推荐VS Code）
git config --global core.editor "code --wait"

# 设置换行符处理（跨平台协作）
git config --global core.autocrlf input  # macOS/Linux
git config --global core.autocrlf true   # Windows

# 启用颜色输出
git config --global color.ui auto
```

### 2. 别名配置（提高效率）
```bash
# 添加到 ~/.gitconfig 或执行以下命令
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

### 3. 忽略文件配置 (.gitignore)
创建项目级的 `.gitignore` 文件：

```gitignore
# 依赖目录
node_modules/
.vendor/
bower_components/

# 构建输出
dist/
build/
.out/
.next/
.nuxt/

# 环境变量文件
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 日志文件
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 运行时数据
*.pid
*.seed
*.pid.lock

# 编辑器目录
.vscode/
.idea/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 测试覆盖率
coverage/
.nyc_output/

# 生产文件
*.prod.js
*.min.js

# 本地数据库文件
*.db
*.sqlite
```

## Git工作流策略

### 1. 功能分支工作流（推荐中小团队）
```
main (或 master) ── 稳定版本分支
    │
    ├── develop ── 开发集成分支
    │       │
    │       ├── feature/login ── 登录功能分支
    │       ├── feature/payment ── 支付功能分支
    │       └── hotfix/urgent-bug ── 紧急修复分支
    │
    └── release/v1.0.0 ── 发布分支
```

#### 操作流程
```bash
# 1. 从develop创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication

# 2. 开发功能，定期提交
git add .
git commit -m "feat: 添加用户登录界面"
git commit -m "feat: 实现JWT认证逻辑"
git commit -m "fix: 修复登录状态持久化问题"

# 3. 推送到远程
git push -u origin feature/user-authentication

# 4. 创建Pull Request/Merge Request
# （在GitHub/GitLab界面操作）

# 5. 合并到develop
git checkout develop
git pull origin develop
git merge --no-ff feature/user-authentication
git push origin develop

# 6. 删除本地分支
git branch -d feature/user-authentication
```

### 2. Git Flow工作流（推荐企业级项目）
```bash
# 安装git-flow工具
# macOS
brew install git-flow

# Linux
apt-get install git-flow

# Windows (通过Git Bash)
# 或使用Sourcetree等GUI工具

# 初始化git-flow
git flow init
# 接受默认分支名称或自定义
```

#### 主要分支
- `master` - 生产代码
- `develop` - 开发集成代码
- `feature/*` - 功能开发分支
- `release/*` - 发布准备分支
- `hotfix/*` - 生产环境紧急修复

#### 常用命令
```bash
# 开始新功能
git flow feature start login-system

# 完成功能开发
git flow feature finish login-system

# 开始发布
git flow release start v1.2.0

# 完成发布
git flow release finish v1.2.0

# 开始热修复
git flow hotfix start critical-bug

# 完成热修复
git flow hotfix finish critical-bug
```

## 提交规范

### 1. 约定式提交 (Conventional Commits)
```
<类型>[可选范围]: <描述>

[可选正文]

[可选脚注]
```

#### 提交类型
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具变动
- `perf`: 性能优化
- `ci`: CI/CD配置

#### 示例
```bash
# 功能提交
git commit -m "feat(auth): 添加OAuth2第三方登录支持"

# 修复提交
git commit -m "fix(api): 修复用户列表分页参数错误"

# 文档提交
git commit -m "docs(readme): 更新项目安装指南"

# 重构提交
git commit -m "refactor(utils): 重构日期格式化函数"

# 性能优化
git commit -m "perf(db): 优化用户查询索引"
```

### 2. 提交信息模板
创建 `.gitmessage` 文件：

```
# <类型>(<范围>): <简短描述>
# |<----  最多50个字符  ---->|
#
# 详细描述（可选）
# |<----  最多72个字符每行  ---->|
#
# 解决的问题（可选）
# Fixes: #123
# Related: #456, #789
#
# --- 提交类型说明 ---
# feat:     新功能
# fix:      修复bug
# docs:     文档更新
# style:    代码格式调整
# refactor: 代码重构
# test:     测试相关
# chore:    构建过程或辅助工具
# perf:     性能优化
# ci:       CI/CD配置
```

设置模板：
```bash
git config --global commit.template ~/.gitmessage
```

## 分支命名规范

### 1. 功能分支
```
feature/<简短描述>
feature/user-profile
feature/payment-integration
feature/chat-real-time
```

### 2. 修复分支
```
fix/<问题描述>
fix/login-validation
fix/api-timeout
fix/mobile-responsive
```

### 3. 发布分支
```
release/<版本号>
release/v1.2.0
release/2023-10-update
```

### 4. 热修复分支
```
hotfix/<紧急问题>
hotfix/security-vulnerability
hotfix/critical-bug
```

### 5. 实验分支
```
experiment/<实验名称>
experiment/new-ui-design
experiment/ai-feature
```

## 协作最佳实践

### 1. 定期同步
```bash
# 每天开始工作前
git fetch origin
git rebase origin/develop  # 或 git merge origin/develop

# 推送前确保本地是最新
git pull --rebase origin develop
```

### 2. 解决冲突
```bash
# 发生冲突时
git status  # 查看冲突文件
# 手动解决冲突
git add <解决的文件>
git rebase --continue  # 或 git commit

# 如果rebase过程中想取消
git rebase --abort
```

### 3. 代码审查
```bash
# 创建Pull Request前
# 1. 确保代码通过测试
npm test

# 2. 确保代码风格一致
npm run lint

# 3. 添加有意义的PR描述
# 包括：做了什么、为什么做、测试方法、相关issue
```

## 版本标签管理

### 1. 语义化版本 (SemVer)
```
主版本号.次版本号.修订号
MAJOR.MINOR.PATCH

- MAJOR: 不兼容的API修改
- MINOR: 向下兼容的功能性新增
- PATCH: 向下兼容的问题修正
```

### 2. 创建标签
```bash
# 创建轻量标签
git tag v1.0.0

# 创建附注标签（推荐）
git tag -a v1.0.0 -m "版本1.0.0发布：包含用户管理核心功能"

# 查看标签
git tag
git show v1.0.0

# 推送标签到远程
git push origin v1.0.0
git push origin --tags  # 推送所有标签
```

### 3. 发布流程
```bash
# 1. 更新版本号
npm version patch  # 或 minor, major
# 这会自动：更新package.json、创建git tag、提交

# 2. 推送标签
git push origin --tags

# 3. 生成变更日志（使用工具）
npx conventional-changelog -p angular -i CHANGELOG.md -s
```

## 高级技巧

### 1. 交互式rebase整理提交历史
```bash
# 整理最近3次提交
git rebase -i HEAD~3

# 在编辑器中：
# pick - 保留提交
# reword - 修改提交信息
# edit - 修改提交内容
# squash - 合并到前一个提交
# fixup - 合并并丢弃提交信息
# drop - 删除提交
```

### 2. 暂存更改
```bash
# 临时保存工作区更改
git stash
git stash save "正在开发的功能，临时保存"

# 查看暂存列表
git stash list

# 恢复暂存
git stash pop  # 恢复并删除
git stash apply  # 恢复但不删除

# 删除暂存
git stash drop stash@{0}
```

### 3. 查找问题提交
```bash
# 使用git bisect二分查找引入bug的提交
git bisect start
git bisect bad HEAD  # 当前版本有问题
git bisect good v1.0.0  # 这个版本没问题

# 测试当前版本，然后标记
git bisect good  # 或 git bisect bad

# 完成后重置
git bisect reset
```

## 自动化脚本

### 1. 预提交钩子 (.git/hooks/pre-commit)
```bash
#!/bin/bash
# 检查代码风格
npm run lint

# 运行测试
npm test

# 如果测试失败，阻止提交
if [ $? -ne 0 ]; then
  echo "❌ 测试失败，提交被阻止"
  exit 1
fi
```

### 2. 提交信息验证 (.git/hooks/commit-msg)
```bash
#!/bin/bash
# 验证提交信息格式
commit_msg=$(cat "$1")

if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|perf|ci)(\(.+\))?: .{1,50}$"; then
  echo "❌ 提交信息格式错误"
  echo "格式应为: <类型>(<范围>): <描述>"
  echo "类型: feat, fix, docs, style, refactor, test, chore, perf, ci"
  exit 1
fi
```

### 3. 使用Husky自动化Git钩子
```bash
# 安装Husky
npm install husky --save-dev

# 初始化Husky
npx husky init

# 添加预提交钩子
npx husky add .husky/pre-commit "npm test && npm run lint"

# 添加提交信息钩子
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

## 常见问题解决

### 1. 提交了错误文件
```bash
# 撤销最后一次提交但保留更改
git reset --soft HEAD~1

# 撤销最后一次提交并丢弃更改
git reset --hard HEAD~1

# 撤销特定文件的提交
git checkout HEAD~1 -- path/to/file
```

### 2. 提交信息写错了
```bash
# 修改最后一次提交信息
git commit --amend -m "新的提交信息"

# 修改更早的提交（使用交互式rebase）
git rebase -i HEAD~3
# 将需要修改的提交前的pick改为reword
```

### 3. 分支合并错了
```bash
# 撤销合并
git merge --abort  # 合并过程中
git reset --hard ORIG_HEAD  # 合并后立即撤销
git revert -m 1 <合并提交的hash>  # 已推送的合并
```

## 检查清单

### 提交前检查
- [ ] 代码通过测试
- [ ] 代码风格一致
- [ ] 提交信息符合规范
- [ ] 没有提交敏感信息
- [ ] 分支是最新状态

### 合并前检查
- [ ] 代码审查通过
- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] 变更日志已更新

## 下一步行动

1. **配置Git环境**：设置用户名、邮箱、别名
2. **选择工作流**：根据团队规模选择合适的工作流
3. **建立规范**：制定提交、分支、合并规范
4. **自动化流程**：配置Git钩子和CI/CD集成

---

**提示**：版本管理是团队协作的基础，花时间建立好规范可以避免很多后续问题。如果刚开始不确定，可以从简单的功能分支工作流开始，随着项目复杂度增加再逐步完善。