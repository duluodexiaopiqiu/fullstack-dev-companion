# 服务器选项 (Server Options)

## 模块目标
选择合适的服务器部署方案，平衡成本、性能和易用性。

## 核心原则
1. **按需选择**：根据项目规模选择合适方案
2. **成本控制**：从免费方案开始，随需求升级
3. **易用性优先**：选择易于管理和扩展的方案
4. **备份策略**：确保数据安全和可恢复性

## 部署方案对比

### 1. 静态网站托管（免费/低成本）
**适用场景**：HTML/CSS/JS静态网站、博客、产品介绍页

| 平台 | 免费额度 | 特点 | 适合项目 |
|------|---------|------|----------|
| **GitHub Pages** | 无限 | 与GitHub集成、自动部署、自定义域名 | 个人项目、文档、博客 |
| **Vercel** | 无限 | 极速部署、Serverless函数、预览环境 | Next.js、React、Vue项目 |
| **Netlify** | 无限 | 表单处理、身份验证、CMS集成 | Jamstack网站、企业官网 |
| **Cloudflare Pages** | 无限 | 全球CDN、边缘计算、D1数据库 | 高性能静态站点 |

#### GitHub Pages部署示例
```bash
# 1. 创建GitHub仓库
# 2. 推送代码到main分支
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/repo-name.git
git push -u origin main

# 3. 启用GitHub Pages
# 仓库设置 -> Pages -> 选择分支 -> 保存

# 4. 添加自定义域名（可选）
# 在仓库根目录创建CNAME文件
echo "www.yourdomain.com" > CNAME
```

#### Vercel部署示例
```bash
# 1. 安装Vercel CLI
npm i -g vercel

# 2. 登录Vercel
vercel login

# 3. 部署项目
vercel

# 4. 生产环境部署
vercel --prod

# 或通过GitHub集成自动部署
# 连接GitHub仓库 -> 自动部署每次推送
```

### 2. 云服务器（VPS）
**适用场景**：全栈应用、需要自定义环境的项目

| 提供商 | 起步价格 | 特点 | 适合项目 |
|--------|---------|------|----------|
| **阿里云ECS** | ¥30/月 | 国内访问快、备案支持、中文支持 | 国内用户为主的项目 |
| **腾讯云CVM** | ¥30/月 | 微信生态集成、学生优惠 | 小程序、微信相关项目 |
| **DigitalOcean** | $6/月 | 简单易用、文档优秀、社区活跃 | 国际项目、初创公司 |
| **Linode** | $5/月 | 性能稳定、网络质量好 | 企业应用、API服务 |
| **Vultr** | $2.5/月 | 价格最低、全球节点 | 个人项目、测试环境 |

#### 云服务器部署流程
```bash
# 1. 购买服务器（以阿里云为例）
# - 选择地域：根据用户分布选择
# - 选择配置：1核2G起步
# - 选择系统：Ubuntu 20.04 LTS

# 2. 连接服务器
ssh root@your-server-ip

# 3. 基础环境配置
# 更新系统
apt update && apt upgrade -y

# 安装Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 安装Nginx
apt install -y nginx

# 安装PM2（进程管理）
npm install -g pm2

# 4. 配置防火墙
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# 5. 部署应用
cd /var/www
git clone https://github.com/username/your-app.git
cd your-app
npm install
npm run build

# 6. 使用PM2启动应用
pm2 start npm --name "your-app" -- start
pm2 save
pm2 startup

# 7. 配置Nginx反向代理
nano /etc/nginx/sites-available/your-app
```

#### Nginx配置示例
```nginx
# /etc/nginx/sites-available/your-app
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 启用gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/javascript application/xml+rss 
               application/json image/svg+xml;
}

# 启用站点
ln -s /etc/nginx/sites-available/your-app /etc/nginx/sites-enabled/
nginx -t  # 测试配置
systemctl reload nginx
```

### 3. 容器化部署（Docker）
**适用场景**：微服务架构、需要环境一致性、快速扩展

#### Docker部署流程
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/mydb
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - app-network

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres-data:

networks:
  app-network:
    driver: bridge
```

#### 部署到Docker平台
```bash
# 1. 构建镜像
docker build -t your-app .

# 2. 推送到Docker Hub
docker tag your-app username/your-app:latest
docker push username/your-app:latest

# 3. 在服务器上拉取并运行
docker pull username/your-app:latest
docker-compose up -d

# 4. 查看日志
docker-compose logs -f app
```

### 4. Serverless/无服务器
**适用场景**：事件驱动、流量波动大、不想管理服务器

| 平台 | 免费额度 | 特点 | 适合项目 |
|------|---------|------|----------|
| **Vercel** | 100GB带宽 | 前端优化、边缘函数 | 前端应用、API网关 |
| **AWS Lambda** | 100万请求/月 | 生态完整、集成AWS服务 | 企业级应用、数据处理 |
| **Google Cloud Functions** | 200万请求/月 | 与GCP生态集成 | 数据分析、机器学习 |
| **阿里云函数计算** | 100万请求/月 | 国内访问快、中文支持 | 国内业务、小程序后端 |

#### Serverless部署示例（Vercel）
```javascript
// api/hello.js
export default function handler(req, res) {
  res.status(200).json({ 
    message: 'Hello from Serverless Function',
    timestamp: new Date().toISOString()
  });
}

// 部署：推送到GitHub，Vercel自动部署
```

#### AWS Lambda示例
```javascript
// lambda.js
exports.handler = async (event) => {
  console.log('事件:', JSON.stringify(event, null, 2));
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Hello from Lambda!',
      input: event,
    }),
  };
};

// 部署
# 安装AWS CLI
aws configure  # 配置凭证

# 创建部署包
zip -r function.zip lambda.js

# 创建Lambda函数
aws lambda create-function \
  --function-name my-function \
  --runtime nodejs18.x \
  --handler lambda.handler \
  --zip-file fileb://function.zip \
  --role arn:aws:iam::account-id:role/lambda-role
```

## 部署策略选择指南

### 项目类型 vs 部署方案
| 项目类型 | 用户规模 | 推荐方案 | 预估月成本 |
|----------|---------|----------|-----------|
| 个人博客 | < 1000 | GitHub Pages + 自定义域名 | ¥0-50 |
| 企业官网 | 1万-10万 | Vercel/Netlify + CDN | ¥0-200 |
| SaaS应用 | 1万-10万 | 云服务器 + 负载均衡 | ¥200-1000 |
| 电商平台 | 10万+ | 云服务器集群 + 数据库集群 | ¥1000+ |
| 内部工具 | < 100 | Docker + 私有服务器 | ¥100-500 |

### 成本优化策略
1. **利用免费额度**：多个平台组合使用免费服务
2. **按需付费**：使用Serverless避免闲置资源
3. **预留实例**：长期使用可购买预留实例节省30-60%
4. **自动缩放**：根据流量自动调整资源
5. **CDN缓存**：减少源站压力，降低带宽成本

## 部署检查清单

### 部署前准备
- [ ] 代码已通过所有测试
- [ ] 环境变量已配置
- [ ] 数据库已备份（如有）
- [ ] 域名已解析到服务器IP
- [ ] SSL证书已准备

### 部署过程
- [ ] 备份当前版本
- [ ] 执行数据库迁移（如有）
- [ ] 更新代码到服务器
- [ ] 重启服务
- [ ] 验证服务是否正常

### 部署后验证
- [ ] 网站可以正常访问
- [ ] API接口正常工作
- [ ] 静态资源加载正常
- [ ] SSL证书有效
- [ ] 性能监控正常

## 自动化部署脚本

### 使用GitHub Actions自动部署
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
      env:
        NODE_ENV: production
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        script: |
          cd /var/www/your-app
          git pull origin main
          npm ci --only=production
          npm run build
          pm2 restart your-app
```

### 使用PM2部署脚本
```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'your-app',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }],

  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'git@github.com:username/your-app.git',
      path: '/var/www/your-app',
      'post-deploy': 'npm ci --only=production && npm run build && pm2 reload ecosystem.config.js --env production',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
```

```bash
# 首次部署
pm2 deploy ecosystem.config.js production setup

# 后续部署
pm2 deploy ecosystem.config.js production
```

## 故障恢复方案

### 1. 快速回滚
```bash
# 使用Git回滚到上一个版本
git log --oneline -5  # 查看最近提交
git checkout <previous-commit-hash>
npm install
npm run build
pm2 restart your-app

# 或使用PM2回滚
pm2 deploy ecosystem.config.js production revert 1
```

### 2. 数据库备份恢复
```bash
# 备份数据库
pg_dump -U username -d dbname -f backup_$(date +%Y%m%d).sql

# 恢复数据库
psql -U username -d dbname -f backup_20231001.sql

# 自动备份脚本
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${DATE}.sql"

pg_dump -U postgres -d mydb > "${BACKUP_DIR}/${FILENAME}"

# 保留最近7天备份
find "${BACKUP_DIR}" -name "backup_*.sql" -mtime +7 -delete
```

### 3. 监控告警配置
```bash
# 使用pm2-monit监控
pm2 monit

# 设置告警（使用pm2 + 邮件）
pm2 install pm2-slack
pm2 set pm2-slack:slack_url https://hooks.slack.com/services/...
pm2 set pm2-slack:username pm2
pm2 set pm2-slack:channel alerts

# 关键指标监控
# - CPU使用率 > 80%
# - 内存使用率 > 80%
# - 进程重启次数 > 5次/小时
# - 响应时间 > 2秒
```

## 下一步行动

1. **选择部署方案**：根据项目需求和预算选择
2. **准备部署环境**：配置服务器、域名、SSL证书
3. **自动化部署流程**：设置CI/CD流水线
4. **监控和告警**：配置系统监控和故障告警
5. **制定回滚计划**：准备故障恢复方案

---

**提示**：部署不是一次性的任务，而是持续的过程。随着业务增长，部署策略也需要不断调整和优化。建议从最简单的方案开始，根据实际需求逐步升级。