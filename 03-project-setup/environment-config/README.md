# 环境配置 (Environment Configuration)

## 模块目标
快速配置开发环境，避免"环境问题"导致的开发障碍。

## 核心原则
1. **最小化安装**：只安装必要的工具
2. **版本管理**：使用版本管理工具避免冲突
3. **一键配置**：提供脚本简化配置过程
4. **跨平台兼容**：支持Windows、macOS、Linux

## 开发环境检查清单

### 基础工具（必须）
```bash
# 检查Node.js
node --version  # 推荐: 18.x, 20.x LTS版本

# 检查npm/yarn/pnpm
npm --version   # 或 yarn --version, pnpm --version

# 检查Git
git --version

# 检查代码编辑器（至少安装一个）
# - VS Code (推荐)
# - WebStorm
# - Sublime Text
```

### 前端开发环境
```bash
# 浏览器开发工具
# - Chrome + DevTools (必须)
# - Firefox Developer Edition (可选)

# 构建工具
npm install -g vite          # 现代前端构建工具
npm install -g create-react-app  # React项目创建工具
npm install -g @vue/cli      # Vue项目创建工具

# 代码质量工具
npm install -g eslint        # JavaScript代码检查
npm install -g prettier      # 代码格式化
```

### 后端开发环境
```bash
# Node.js后端
npm install -g nodemon       # 开发时自动重启
npm install -g pm2           # 生产环境进程管理

# Python后端
python --version             # 推荐: Python 3.8+
pip --version                # Python包管理
pip install virtualenv       # 虚拟环境管理

# Java后端
java --version               # 推荐: Java 11+
mvn --version                # Maven构建工具
```

### 数据库环境
```bash
# MySQL
mysql --version              # 或使用Docker运行MySQL

# MongoDB
mongod --version             # 或使用MongoDB Atlas云服务

# PostgreSQL
psql --version               # 或使用Docker运行PostgreSQL

# SQLite (无需安装，Node.js自带)
```

## 一键配置脚本

### Windows (PowerShell)
```powershell
# 保存为 setup-dev-env.ps1
Write-Host "开始配置开发环境..." -ForegroundColor Green

# 检查Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js未安装，请访问 https://nodejs.org 下载安装" -ForegroundColor Yellow
} else {
    Write-Host "Node.js已安装: $(node --version)" -ForegroundColor Green
}

# 检查Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git未安装，请访问 https://git-scm.com 下载安装" -ForegroundColor Yellow
} else {
    Write-Host "Git已安装: $(git --version)" -ForegroundColor Green
}

# 安装全局工具
Write-Host "安装全局开发工具..." -ForegroundColor Cyan
npm install -g vite create-react-app @vue/cli eslint prettier nodemon

Write-Host "环境检查完成！" -ForegroundColor Green
```

### macOS/Linux (Bash)
```bash
#!/bin/bash
echo "开始配置开发环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js未安装，请使用nvm安装:"
    echo "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "nvm install --lts"
else
    echo "Node.js已安装: $(node --version)"
fi

# 检查Git
if ! command -v git &> /dev/null; then
    echo "Git未安装，请使用包管理器安装:"
    echo "macOS: brew install git"
    echo "Ubuntu: sudo apt install git"
else
    echo "Git已安装: $(git --version)"
fi

# 安装全局工具
echo "安装全局开发工具..."
npm install -g vite create-react-app @vue/cli eslint prettier nodemon

echo "环境检查完成！"
```

## 环境变量配置

### 项目级环境变量 (.env文件)
```env
# 开发环境
NODE_ENV=development
PORT=3000
DATABASE_URL=mysql://user:password@localhost:3306/dev_db
API_KEY=your_dev_api_key

# 生产环境 (.env.production)
NODE_ENV=production
PORT=80
DATABASE_URL=mysql://user:password@production-db:3306/prod_db
API_KEY=your_prod_api_key
```

### 系统级环境变量
```bash
# Windows (PowerShell)
[System.Environment]::SetEnvironmentVariable("NODE_ENV", "development", "User")

# macOS/Linux
echo 'export NODE_ENV=development' >> ~/.bashrc
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

## Docker开发环境（可选）

### docker-compose.yml
```yaml
version: '3.8'
services:
  # 前端开发服务器
  frontend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./frontend:/app
    ports:
      - "3000:3000"
    command: npm run dev
    environment:
      - NODE_ENV=development

  # 后端API服务器
  backend:
    image: node:18-alpine
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "3001:3001"
    command: npm run dev
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mysql://root:password@db:3306/dev_db

  # MySQL数据库
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: dev_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 常见问题解决

### 1. 端口被占用
```bash
# 查看占用端口的进程
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# 杀死进程
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### 2. 权限问题
```bash
# macOS/Linux: 修复npm全局安装权限
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# 或使用nvm避免权限问题
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### 3. 网络问题（国内用户）
```bash
# 设置npm淘宝镜像
npm config set registry https://registry.npmmirror.com

# 设置yarn淘宝镜像
yarn config set registry https://registry.npmmirror.com

# 设置pnpm淘宝镜像
pnpm config set registry https://registry.npmmirror.com
```

### 4. 版本冲突
```bash
# 使用nvm管理Node.js版本
nvm install 18.17.0  # 安装指定版本
nvm use 18.17.0      # 使用指定版本
nvm alias default 18.17.0  # 设置默认版本

# 使用pyenv管理Python版本（macOS/Linux）
brew install pyenv
pyenv install 3.9.0
pyenv global 3.9.0
```

## 快速验证脚本

创建 `check-env.js` 验证环境是否就绪：

```javascript
const { execSync } = require('child_process');

console.log('🔍 检查开发环境...\n');

const checks = [
  { name: 'Node.js', cmd: 'node --version', minVersion: 'v18.0.0' },
  { name: 'npm', cmd: 'npm --version', minVersion: '8.0.0' },
  { name: 'Git', cmd: 'git --version' },
  { name: 'Docker', cmd: 'docker --version', optional: true },
];

checks.forEach(({ name, cmd, minVersion, optional }) => {
  try {
    const output = execSync(cmd, { encoding: 'utf8' }).trim();
    console.log(`✅ ${name}: ${output}`);
    
    if (minVersion) {
      const version = output.match(/\d+\.\d+\.\d+/)?.[0];
      if (version && compareVersions(version, minVersion) < 0) {
        console.log(`   ⚠️  版本过低，推荐升级到 ${minVersion}+`);
      }
    }
  } catch (error) {
    if (optional) {
      console.log(`⚠️  ${name}: 未安装（可选）`);
    } else {
      console.log(`❌ ${name}: 未安装`);
      console.log(`   安装命令: 请参考上方安装指南`);
    }
  }
});

console.log('\n🎉 环境检查完成！');

// 简单的版本比较函数
function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 !== p2) return p1 - p2;
  }
  return 0;
}
```

## 下一步行动

1. **运行环境检查**：执行上面的验证脚本
2. **安装缺失工具**：根据检查结果安装必要工具
3. **配置项目环境**：创建项目目录和配置文件
4. **进入下一模块**：选择项目模板或配置版本管理

---

**提示**：如果遇到任何环境配置问题，可以：
1. 查看[常见问题解决](#常见问题解决)部分
2. 使用Docker简化环境配置
3. 在项目模板模块中使用预配置的模板