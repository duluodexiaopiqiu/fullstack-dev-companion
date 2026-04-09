# 全栈开发伴侣 - 安装和使用指南

## 📦 安装方法

### 方法1：直接使用（推荐）
```bash
# 克隆仓库
git clone https://github.com/yourusername/fullstack-dev-companion.git
cd fullstack-dev-companion

# 运行工具
node scripts/main.js
# 或
npm start
```

### 方法2：作为全局工具安装
```bash
# 克隆并链接
git clone https://github.com/yourusername/fullstack-dev-companion.git
cd fullstack-dev-companion
npm link

# 全局使用
fullstack-dev-companion
# 或
fdc
```

### 方法3：在opencode中使用
将本技能目录复制到opencode技能目录：
```bash
# Windows
copy fullstack-dev-companion %USERPROFILE%\.opencode\skills\

# macOS/Linux
cp -r fullstack-dev-companion ~/.opencode/skills/
```

然后在opencode中通过技能名称调用：
```
用户: "我需要全栈开发指导"
opencode: 加载fullstack-dev-companion技能
```

## 🚀 快速开始

### 基本使用
```bash
# 显示导航菜单
npm run menu

# 引导式路径推荐
npm run guide

# 交互模式
npm run interactive

# 直接运行（默认引导模式）
npm start
```

### 命令行参数
```bash
# 显示帮助
node scripts/main.js --help

# 显示菜单
node scripts/main.js menu

# 引导模式
node scripts/main.js guide

# 交互模式
node scripts/main.js interactive
```

## 📁 目录结构说明

```
fullstack-dev-companion/
├── SKILL.md                    # 主技能文件（opencode使用）
├── INSTALL.md                  # 安装指南（本文件）
├── package.json                # Node.js项目配置
├── scripts/                    # 脚本目录
│   ├── main.js                # 主入口脚本
│   ├── navigation.js          # 导航系统
│   └── test-navigation.js     # 测试脚本
├── templates/                  # 模板文件
│   └── quick-start-guide.md   # 快速开始指南
└── 各阶段模块目录/
    ├── 01-idea-clarification/     # 想法澄清阶段
    │   ├── product-thinking/      # 产品思维工具包
    │   └── market-analysis/       # 市场分析工具
    ├── 02-tech-selection/         # 技术选型阶段
    │   ├── frontend-options/      # 前端技术选项
    │   ├── backend-options/       # 后端技术选项
    │   └── database-options/      # 数据库选项
    ├── 03-project-setup/          # 项目搭建阶段
    │   ├── env-configuration/     # 环境配置
    │   ├── project-templates/     # 项目模板
    │   └── version-management/    # 版本管理
    ├── 04-development-guide/      # 开发指导阶段
    │   ├── coding-best-practices/ # 编码最佳实践
    │   ├── testing-strategies/    # 测试策略
    │   └── debug-tools/           # 调试工具
    ├── 05-deployment/             # 部署阶段
    │   ├── server-options/        # 服务器选项
    │   ├── domain-config/         # 域名配置
    │   └── monitoring-tools/      # 监控工具
    └── 06-maintenance/            # 维护阶段
        ├── performance-optimization/ # 性能优化
        ├── security-checklist/    # 安全检查
        └── scaling-strategies/    # 扩展策略
```

## 🎯 使用场景示例

### 场景1：开发新手想建电商网站
```bash
# 1. 启动工具
npm start

# 2. 选择身份：开发新手
# 3. 选择项目类型：电商网站
# 4. 获取推荐路径
# 5. 按推荐进入各阶段学习
```

### 场景2：产品人员想了解技术实现
```bash
# 1. 进入技术选型阶段
# 直接查看前端、后端、数据库选项文档
cat 02-tech-selection/frontend-options/README.md

# 2. 或使用交互模式
npm run interactive
# 输入：02-tech-selection
```

### 场景3：创业者验证想法
```bash
# 1. 进入想法澄清阶段
# 查看产品思维和市场分析工具
cat 01-idea-clarification/product-thinking/README.md
cat 01-idea-clarification/market-analysis/README.md

# 2. 使用模板进行市场分析
# 按照README中的练习进行操作
```

## 🔧 环境要求

### 基础要求
- Node.js 18.0.0 或更高版本
- npm 8.0.0 或更高版本（推荐使用pnpm）
- Git（用于版本管理）

### 推荐工具
- **代码编辑器**：VSCode（推荐）、WebStorm、Sublime Text
- **终端工具**：Windows Terminal、iTerm2（macOS）、GNOME Terminal（Linux）
- **数据库工具**：DBeaver、TablePlus、MongoDB Compass
- **API测试**：Postman、Insomnia、Thunder Client

## 📚 学习路径

### 路径A：完整学习（推荐新手）
1. **阶段1**：想法澄清（1-2周）
   - 产品思维工具包
   - 市场分析工具
2. **阶段2**：技术选型（1周）
   - 前端、后端、数据库选项
3. **阶段3**：项目搭建（3-5天）
   - 环境配置和项目模板
4. **阶段4**：开发指导（2-3周）
   - 编码、测试、调试
5. **阶段5**：部署上线（1周）
   - 服务器、域名、监控
6. **阶段6**：维护优化（持续）
   - 性能、安全、扩展

### 路径B：快速实践（有经验者）
1. 直接进入需要的阶段模块
2. 使用模板快速开始
3. 参考最佳实践优化
4. 按需学习其他模块

### 路径C：交叉学习
- **开发人员**：重点学习阶段1（产品思维）
- **产品人员**：重点学习阶段2-3（技术实现）
- **创业者**：重点学习阶段1、2、5（想法、技术、部署）

## 🛠️ 自定义配置

### 创建EXTEND.md配置文件
在项目根目录创建 `.fullstack-dev-companion/EXTEND.md`：
```markdown
# 自定义配置

## 技术栈偏好
frontend: vue
backend: nodejs
database: postgresql

## 公司规范
coding_style: standard
git_workflow: gitflow
deployment_platform: aliyun

## 项目模板
default_template: ecommerce
```

### 环境变量配置
创建 `.env` 文件：
```env
# 开发环境配置
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/dev
REDIS_URL=redis://localhost:6379

# API密钥
STRIPE_KEY=sk_test_xxx
SENDGRID_KEY=SG.xxx
```

## 🔍 故障排除

### 常见问题

#### 问题1：Node.js版本不兼容
```
错误：Node.js版本需要18.0.0或更高
解决：使用nvm安装正确版本
nvm install 18
nvm use 18
```

#### 问题2：权限问题
```
错误：EACCES权限被拒绝
解决：使用sudo或修复权限
sudo npm install
# 或
sudo chown -R $(whoami) ~/.npm
```

#### 问题3：依赖安装失败
```
错误：网络问题或包不存在
解决：使用国内镜像或检查网络
npm config set registry https://registry.npmmirror.com
# 或使用pnpm
npm install -g pnpm
pnpm install
```

### 获取帮助
1. 查看对应模块的README文档
2. 运行测试脚本检查功能：`npm test`
3. 查看GitHub Issues
4. 联系维护者

## 📈 进阶使用

### 集成到现有项目
```javascript
// 在你的项目中引入导航系统
const { navigation } = require('./fullstack-dev-companion/scripts/navigation.js');

// 获取推荐路径
const userType = 'developer';
const recommendations = navigation.getUserRecommendations(userType);
console.log('推荐阶段:', recommendations);
```

### 创建自定义模块
1. 在对应阶段目录创建新模块
2. 按照现有模块格式编写README.md
3. 更新navigation.js中的模块配置
4. 测试新模块功能

### 贡献代码
1. Fork仓库
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 📞 支持与反馈

### 报告问题
- GitHub Issues: https://github.com/duluodexiaopiqiu/fullstack-dev-companion/issues
- 邮件支持: 2430486030@qq.com

### 功能请求
1. 描述需要的功能
2. 说明使用场景
3. 提供示例或参考

### 贡献指南
1. 阅读CONTRIBUTING.md（如有）
2. 遵循代码规范
3. 编写测试用例
4. 更新文档

---

**开始使用**：现在运行 `npm start` 开始你的全栈开发之旅！