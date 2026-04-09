# 数据库选项

## 概述
数据库技术选型指南，帮助您根据数据特性、查询需求和业务场景选择最合适的数据库。涵盖关系型、文档型、键值型等主流数据库，以及数据建模、性能优化等关键决策。

## 目标用户
- 开发新手需要数据库选型指导
- 全栈开发者需要数据库技术建议
- 技术负责人需要数据架构决策支持
- 产品人员需要了解数据存储成本

## 数据库选型框架

### 1. 决策维度
选择数据库时考虑以下维度：
- **数据结构**：结构化 vs 半结构化 vs 非结构化
- **查询模式**：简单查询 vs 复杂关联 vs 聚合分析
- **数据量级**：小型数据集 vs 大数据量 vs 海量数据
- **读写比例**：读多写少 vs 写多读少 vs 读写均衡
- **一致性要求**：强一致性 vs 最终一致性
- **扩展需求**：垂直扩展 vs 水平扩展
- **团队技能**：SQL经验 vs NoSQL经验
- **成本预算**：开源免费 vs 商业授权 vs 云服务

### 2. 数据库类型对比

#### 关系型数据库 (SQL)
**适合场景**：
- 数据结构固定，关系明确
- 需要复杂查询和事务支持
- 数据一致性要求高
- 团队有SQL经验

**主流选择**：
- **MySQL**：最流行，开源免费，生态丰富
- **PostgreSQL**：功能最强大，扩展性好，推荐新项目
- **SQLite**：嵌入式，零配置，适合本地开发和小型应用
- **MariaDB**：MySQL分支，完全兼容

**特点**：
- ACID事务保证
- 结构化数据，Schema严格
- SQL标准查询语言
- 支持复杂关联查询

#### 文档型数据库 (NoSQL)
**适合场景**：
- 数据结构灵活，经常变化
- 读写性能要求高
- 不需要复杂关联查询
- 水平扩展需求

**主流选择**：
- **MongoDB**：最流行，文档模型，查询灵活
- **CouchDB**：多主复制，冲突解决机制
- **Firestore**：云原生，实时同步

**特点**：
- 文档存储，JSON格式
- Schema灵活，可动态修改
- 水平扩展容易
- 最终一致性模型

#### 键值型数据库
**适合场景**：
- 简单键值存储
- 缓存场景
- 会话存储
- 配置存储

**主流选择**：
- **Redis**：内存存储，性能极高，数据结构丰富
- **Memcached**：简单键值缓存
- **DynamoDB**：AWS托管，自动扩展

**特点**：
- 简单键值对
- 超高性能
- 通常用作缓存层
- 数据可能丢失（内存数据库）

#### 其他类型
- **时序数据库**：InfluxDB、TimescaleDB，适合时间序列数据
- **图数据库**：Neo4j、Dgraph，适合关系网络数据
- **列式数据库**：ClickHouse、Cassandra，适合分析查询
- **搜索引擎**：Elasticsearch、MeiliSearch，全文搜索

### 3. 技术栈推荐矩阵

#### 场景1：电商网站
```
推荐：PostgreSQL + Redis
理由：
- PostgreSQL：商品、订单、用户关系复杂，需要事务
- Redis：购物车、会话、商品缓存，性能要求高
- 组合：关系型保证数据一致性，缓存提升性能
```

#### 场景2：内容管理系统（CMS）
```
推荐：MongoDB
理由：
- 内容结构灵活，经常增减字段
- 不需要复杂关联查询
- 读写性能要求高
- 水平扩展方便
```

#### 场景3：实时分析系统
```
推荐：PostgreSQL + TimescaleDB
或 ClickHouse
理由：
- 时间序列数据存储优化
- 聚合查询性能好
- 支持实时数据流
```

#### 场景4：社交网络
```
推荐：PostgreSQL + Redis + Neo4j
理由：
- PostgreSQL：用户基本信息、帖子内容
- Redis：好友动态、消息推送、会话
- Neo4j：好友关系、推荐算法
```

#### 场景5：物联网（IoT）
```
推荐：InfluxDB + Redis
理由：
- InfluxDB：时间序列数据存储优化
- Redis：设备状态缓存、实时数据
```

### 4. 数据库版本选择

#### 稳定版本推荐（2024）
- **PostgreSQL**: 15.x 或 16.x
- **MySQL**: 8.0.x
- **MongoDB**: 7.0.x
- **Redis**: 7.2.x
- **SQLite**: 3.45.x

#### 版本选择原则
1. **LTS版本优先**：长期支持版本更稳定
2. **避免最新版**：等3-6个月生态跟上
3. **考虑兼容性**：与ORM、驱动版本兼容
4. **安全更新**：选择有安全支持的版本

### 5. 数据建模指南

#### 关系型数据库建模
```sql
-- 规范化设计示例
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引设计
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
```

#### 文档型数据库建模
```javascript
// MongoDB文档设计示例
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "user_id": 12345,
  "email": "user@example.com",
  "profile": {
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "Software developer"
  },
  "posts": [
    {
      "post_id": 1,
      "title": "Hello World",
      "content": "My first post",
      "created_at": ISODate("2024-01-01T00:00:00Z")
    }
  ],
  "created_at": ISODate("2024-01-01T00:00:00Z")
}

// 索引设计
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "created_at": -1 });
```

### 6. 性能优化策略

#### 查询优化
```sql
-- 避免SELECT *
SELECT id, name, email FROM users WHERE active = true;

-- 使用EXPLAIN分析查询计划
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;

-- 批量操作代替循环
-- 不好：循环插入
-- 好：批量插入
INSERT INTO users (name, email) VALUES 
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com');
```

#### 索引策略
```sql
-- 复合索引设计
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- 覆盖索引
CREATE INDEX idx_users_email_name ON users(email, name);

-- 部分索引（PostgreSQL）
CREATE INDEX idx_active_users ON users(email) WHERE active = true;
```

#### 连接池配置
```javascript
// Node.js + PostgreSQL连接池示例
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'mydb',
  user: 'myuser',
  password: 'mypassword',
  max: 20,                    // 最大连接数
  idleTimeoutMillis: 30000,   // 空闲连接超时
  connectionTimeoutMillis: 2000, // 连接超时
});
```

### 7. 迁移和备份

#### 数据库迁移工具
- **Node.js**：Prisma Migrate、TypeORM Migrations、Knex
- **Python**：Alembic（SQLAlchemy）、Django Migrations
- **Go**：golang-migrate、sql-migrate

#### 迁移文件示例
```sql
-- migrations/001_create_users_table.sql
-- up migration
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- down migration
DROP TABLE IF EXISTS users;
```

#### 备份策略
```bash
# PostgreSQL备份
pg_dump -U username -d dbname -f backup.sql

# MongoDB备份
mongodump --db mydb --out /backup/

# 自动备份脚本示例
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres mydb > $BACKUP_DIR/mydb_$DATE.sql
# 保留最近7天备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

### 8. 开发环境配置

#### 本地开发数据库
```bash
# 使用Docker启动数据库
docker run --name postgres -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres:15
docker run --name redis -d -p 6379:6379 redis:7-alpine
docker run --name mongo -d -p 27017:27017 mongo:7

# 或使用SQLite（零配置）
# 适合小型项目或原型开发
```

#### 环境变量配置
```env
# .env文件
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
REDIS_URL=redis://localhost:6379
MONGODB_URI=mongodb://localhost:27017/mydb

# 测试环境
TEST_DATABASE_URL=postgresql://user:password@localhost:5432/mydb_test
```

#### ORM配置示例
```typescript
// Prisma配置 (Node.js)
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}
```

## 实践练习

### 练习1：为你的项目选择数据库
1. 分析数据类型、查询模式和扩展需求
2. 选择主数据库和辅助数据库（如缓存）
3. 设计数据模型和表结构
4. 规划索引策略和性能优化

### 练习2：设计数据迁移方案
1. 设计数据库Schema版本管理
2. 编写初始迁移脚本
3. 设计数据备份和恢复策略
4. 规划生产环境数据库部署

### 练习3：性能测试和优化
1. 设计性能测试用例
2. 分析慢查询和瓶颈
3. 优化索引和查询语句
4. 设计缓存策略

## 常见误区

### 误区1：过度规范化
**错误**：所有数据都拆分成小表，关联复杂
**正确**：适度反规范化，平衡查询性能和存储

### 误区2：忽视索引
**错误**：没有索引或索引设计不合理
**正确**：根据查询模式设计合适索引

### 误区3：所有数据放一个数据库
**错误**：用关系型数据库存储所有类型数据
**正确**：根据数据类型使用专门数据库

### 误区4：没有备份策略
**错误**：开发完才考虑备份
**正确**：从项目开始就设计备份方案

## 检查清单

### 数据库选型检查
- [ ] 分析数据类型和查询需求
- [ ] 选择主数据库类型（SQL/NoSQL）
- [ ] 选择具体数据库产品
- [ ] 设计数据模型和Schema
- [ ] 规划索引策略
- [ ] 设计缓存层（如果需要）
- [ ] 规划备份和恢复策略
- [ ] 设计迁移和版本管理

### 开发环境检查
- [ ] 安装和配置本地数据库
- [ ] 设置开发、测试、生产环境配置
- [ ] 配置ORM和数据访问层
- [ ] 编写初始迁移脚本
- [ ] 设置数据库连接池
- [ ] 配置查询日志和监控
- [ ] 设计数据种子脚本

### 生产环境检查
- [ ] 选择云数据库或自建数据库
- [ ] 配置数据库高可用方案
- [ ] 设置自动备份策略
- [ ] 配置监控和告警
- [ ] 设计容量规划方案
- [ ] 制定灾难恢复计划
- [ ] 规划数据归档策略

---

**下一步**：完成本模块练习后，您可以：
1. 进入 `frontend-options` 选择前端技术
2. 进入 `backend-options` 选择后端技术
3. 进入 `03-project-setup` 开始项目搭建
4. 基于数据库选型结果开始实际开发