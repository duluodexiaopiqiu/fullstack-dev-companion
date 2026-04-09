# 项目模板 (Project Templates)

## 模块目标
快速创建标准化的项目结构，避免从零开始的配置工作。

## 核心原则
1. **按需选择**：根据项目类型选择最合适的模板
2. **最小化模板**：避免过度设计，保持模板简洁
3. **可扩展性**：模板支持自定义修改
4. **最佳实践**：内置行业最佳实践和配置

## 模板分类

### 1. 静态网站模板（1-5个页面）
**适用场景**：产品介绍页、个人简历、活动页面、简单展示网站

#### 纯HTML/CSS/JavaScript模板
```bash
# 创建项目目录
mkdir my-static-site && cd my-static-site

# 基础文件结构
touch index.html style.css script.js README.md

# 快速启动模板内容
```

**index.html** (基础模板):
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的网站</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <!-- 字体图标库（可选） -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">我的网站</div>
            <ul class="nav-links">
                <li><a href="#home">首页</a></li>
                <li><a href="#about">关于</a></li>
                <li><a href="#services">服务</a></li>
                <li><a href="#contact">联系</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <section id="home" class="hero">
            <h1>欢迎来到我的网站</h1>
            <p>这是一个使用纯HTML/CSS/JavaScript构建的现代化网站</p>
            <a href="#about" class="cta-button">了解更多</a>
        </section>

        <section id="about">
            <h2>关于我们</h2>
            <p>这里可以添加关于页面的内容...</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2023 我的网站. 保留所有权利.</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>
```

**style.css** (现代化CSS):
```css
/* 重置和基础样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #4361ee;
    --secondary-color: #3a0ca3;
    --accent-color: #f72585;
    --text-color: #333;
    --light-bg: #f8f9fa;
    --dark-bg: #212529;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --transition: all 0.3s ease;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--light-bg);
}

/* 导航栏样式 */
header {
    background-color: white;
    box-shadow: var(--box-shadow);
    position: sticky;
    top: 0;
    z-index: 1000;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--primary-color);
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
    transition: var(--transition);
}

.nav-links a:hover {
    color: var(--primary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
    nav {
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-links {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }
}
```

**package.json** (可选，用于构建工具):
```json
{
  "name": "my-static-site",
  "version": "1.0.0",
  "description": "现代化静态网站",
  "scripts": {
    "dev": "live-server --port=3000",
    "build": "npm run optimize-images && npm run minify",
    "optimize-images": "npx imagemin images/* --out-dir=dist/images",
    "minify": "npx html-minifier --input-dir . --output-dir dist --file-ext html --collapse-whitespace"
  },
  "devDependencies": {
    "live-server": "^1.2.2",
    "imagemin-cli": "^7.0.0",
    "html-minifier": "^4.0.0"
  }
}
```

### 2. React应用模板

#### 使用Vite创建React项目
```bash
# 创建React + TypeScript项目
npm create vite@latest my-react-app -- --template react-ts

# 进入项目目录
cd my-react-app

# 安装依赖
npm install

# 安装常用库
npm install react-router-dom axios @tanstack/react-query
npm install -D @types/react @types/react-dom eslint prettier

# 启动开发服务器
npm run dev
```

#### 项目结构
```
my-react-app/
├── src/
│   ├── components/     # 可复用组件
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   └── index.ts
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Sidebar.tsx
│   ├── pages/         # 页面组件
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── hooks/         # 自定义Hook
│   ├── utils/         # 工具函数
│   ├── types/         # TypeScript类型定义
│   ├── App.tsx
│   └── main.tsx
├── public/            # 静态资源
├── .eslintrc.js       # ESLint配置
├── .prettierrc        # Prettier配置
├── tsconfig.json      # TypeScript配置
├── vite.config.ts     # Vite配置
└── package.json
```

### 3. Vue.js应用模板

#### 使用Vite创建Vue项目
```bash
# 创建Vue 3 + TypeScript项目
npm create vue@latest my-vue-app

# 选择配置选项
# √ 添加TypeScript? Yes
# √ 添加JSX支持? No
# √ 添加Vue Router? Yes
# √ 添加Pinia状态管理? Yes
# √ 添加Vitest测试? Yes
# √ 添加ESLint代码检查? Yes
# √ 添加Prettier代码格式化? Yes

cd my-vue-app
npm install
npm run dev
```

#### 项目结构
```
my-vue-app/
├── src/
│   ├── components/     # 可复用组件
│   │   └── HelloWorld.vue
│   ├── views/         # 页面组件
│   │   ├── HomeView.vue
│   │   └── AboutView.vue
│   ├── router/        # 路由配置
│   │   └── index.ts
│   ├── stores/        # Pinia状态管理
│   │   └── counter.ts
│   ├── App.vue
│   └── main.ts
├── tests/             # 测试文件
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── vite.config.ts
└── package.json
```

### 4. Node.js后端API模板

#### Express.js + TypeScript模板
```bash
# 创建项目目录
mkdir my-api-server && cd my-api-server

# 初始化项目
npm init -y

# 安装依赖
npm install express cors dotenv
npm install -D typescript @types/node @types/express @types/cors ts-node-dev

# 初始化TypeScript配置
npx tsc --init
```

#### 项目结构
```
my-api-server/
├── src/
│   ├── controllers/   # 控制器
│   │   └── userController.ts
│   ├── routes/        # 路由定义
│   │   └── userRoutes.ts
│   ├── middleware/    # 中间件
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── models/        # 数据模型
│   │   └── User.ts
│   ├── services/      # 业务逻辑
│   │   └── userService.ts
│   ├── utils/         # 工具函数
│   │   ├── logger.ts
│   │   └── validation.ts
│   ├── app.ts         # Express应用配置
│   └── server.ts      # 服务器入口
├── .env               # 环境变量
├── .env.example       # 环境变量示例
├── tsconfig.json
├── package.json
└── README.md
```

#### 基础Express应用 (src/app.ts)
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import errorHandler from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API路由
app.use('/api/users', userRoutes);

// 错误处理中间件
app.use(errorHandler);

export default app;
```

### 5. 全栈应用模板 (Next.js)

#### Next.js全栈项目
```bash
# 创建Next.js项目
npx create-next-app@latest my-next-app

# 选择配置
# √ TypeScript? Yes
# √ ESLint? Yes
# √ Tailwind CSS? Yes
# √ src/ directory? Yes
# √ App Router? Yes
# √ import alias? @/*

cd my-next-app
npm install prisma @prisma/client next-auth
npm install -D @types/node

# 初始化Prisma (数据库ORM)
npx prisma init
```

#### 项目结构
```
my-next-app/
├── src/
│   ├── app/           # App Router页面
│   │   ├── api/       # API路由
│   │   │   └── auth/[...nextauth]/
│   │   ├── (auth)/    # 认证相关页面组
│   │   ├── (dashboard)/ # 仪表板页面组
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/    # 可复用组件
│   ├── lib/          # 工具库
│   │   ├── prisma.ts
│   │   └── auth.ts
│   └── types/        # TypeScript类型
├── prisma/           # Prisma数据库配置
│   └── schema.prisma
├── public/           # 静态资源
├── .env.local        # 本地环境变量
├── next.config.js    # Next.js配置
├── tailwind.config.js # Tailwind配置
└── package.json
```

## 模板生成脚本

创建 `create-template.js` 快速生成项目：

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const templates = {
  'static': '静态网站模板',
  'react': 'React应用模板',
  'vue': 'Vue.js应用模板',
  'express': 'Node.js后端API模板',
  'nextjs': 'Next.js全栈模板',
};

const args = process.argv.slice(2);
const templateType = args[0];
const projectName = args[1] || 'my-project';

if (!templateType || !templates[templateType]) {
  console.log('用法: node create-template.js <template-type> [project-name]');
  console.log('\n可用模板:');
  Object.entries(templates).forEach(([key, desc]) => {
    console.log(`  ${key.padEnd(10)} - ${desc}`);
  });
  process.exit(1);
}

console.log(`创建 ${templates[templateType]}：${projectName}`);

// 根据模板类型创建项目
switch (templateType) {
  case 'static':
    createStaticTemplate(projectName);
    break;
  case 'react':
    createReactTemplate(projectName);
    break;
  case 'vue':
    createVueTemplate(projectName);
    break;
  case 'express':
    createExpressTemplate(projectName);
    break;
  case 'nextjs':
    createNextJSTemplate(projectName);
    break;
}

function createStaticTemplate(name) {
  const projectPath = path.join(process.cwd(), name);
  
  if (fs.existsSync(projectPath)) {
    console.error(`目录 ${name} 已存在`);
    process.exit(1);
  }
  
  fs.mkdirSync(projectPath, { recursive: true });
  
  // 创建基础文件
  const files = {
    'index.html': `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>欢迎来到 ${name}</h1>
    <p>这是一个现代化的静态网站</p>
    <script src="script.js"></script>
</body>
</html>`,
    
    'style.css': `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

h1 {
    color: #4361ee;
    margin-bottom: 1rem;
}`,
    
    'script.js': `console.log('${name} 项目已启动！');

// 添加交互功能
document.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('h1');
    if (h1) {
        h1.addEventListener('click', () => {
            h1.style.color = h1.style.color === 'red' ? '#4361ee' : 'red';
        });
    }
});`,
    
    'README.md': `# ${name}

这是一个使用纯HTML/CSS/JavaScript构建的静态网站。

## 快速开始

1. 直接双击 \`index.html\` 在浏览器中打开
2. 或使用Live Server等工具进行开发

## 开发

- \`index.html\` - 主页面
- \`style.css\` - 样式文件
- \`script.js\` - JavaScript逻辑

## 构建

如需优化，可安装构建工具：
\`\`\`bash
npm init -y
npm install -D live-server
\`\`\`

然后运行 \`npm run dev\` 启动开发服务器。`,
    
    'package.json': JSON.stringify({
      name: name,
      version: '1.0.0',
      description: '现代化静态网站',
      scripts: {
        dev: 'live-server --port=3000',
      },
      devDependencies: {
        'live-server': '^1.2.2'
      }
    }, null, 2)
  };
  
  Object.entries(files).forEach(([filename, content]) => {
    fs.writeFileSync(path.join(projectPath, filename), content);
  });
  
  console.log(`✅ 静态网站模板创建成功：${projectPath}`);
  console.log(`📁 进入目录：cd ${name}`);
  console.log(`🚀 启动开发：npm install && npm run dev`);
}

// 其他模板创建函数类似，这里省略...
```

## 模板选择指南

| 项目类型 | 推荐模板 | 开发时间 | 适合人群 |
|---------|---------|---------|---------|
| 产品介绍页 | 静态网站模板 | 1-3天 | 所有人 |
| 个人博客 | Next.js模板 | 1-2周 | 有React基础 |
| 企业官网 | Vue.js模板 | 2-4周 | 前端开发者 |
| 后台管理系统 | React模板 | 3-6周 | 全栈开发者 |
| 移动端H5 | Vue.js模板 | 2-4周 | 前端开发者 |
| API服务 | Express模板 | 1-2周 | 后端开发者 |

## 下一步行动

1. **选择模板**：根据项目需求选择合适的模板
2. **生成项目**：使用模板生成脚本或手动创建
3. **自定义配置**：修改模板以适应具体需求
4. **进入开发**：开始编写业务代码

---

**提示**：如果模板不符合需求，可以：
1. 从最接近的模板开始修改
2. 组合多个模板的特性
3. 在版本管理模块中学习如何管理自定义模板