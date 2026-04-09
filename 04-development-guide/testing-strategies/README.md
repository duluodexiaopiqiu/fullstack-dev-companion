# 测试策略 (Testing Strategies)

## 模块目标
建立全面的测试体系，确保代码质量，减少bug，提高开发效率。

## 核心原则
1. **测试金字塔**：单元测试 > 集成测试 > E2E测试
2. **测试驱动开发**：先写测试，再写实现代码
3. **自动化测试**：测试应该自动运行，无需人工干预
4. **快速反馈**：测试应该快速执行，提供即时反馈

## 测试金字塔

### 1. 单元测试 (Unit Tests)
**目标**：测试最小的代码单元（函数、方法）
**工具**：Jest, Mocha, Vitest
**覆盖率**：70-80%

```javascript
// 示例：测试工具函数
// utils/math.js
export function add(a, b) {
  return a + b;
}

export function divide(a, b) {
  if (b === 0) {
    throw new Error('除数不能为零');
  }
  return a / b;
}

// utils/math.test.js
import { add, divide } from './math';

describe('数学工具函数', () => {
  describe('add函数', () => {
    test('两个正数相加', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('正数和负数相加', () => {
      expect(add(5, -3)).toBe(2);
    });

    test('小数相加', () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });

  describe('divide函数', () => {
    test('正常除法', () => {
      expect(divide(10, 2)).toBe(5);
    });

    test('除数为零时抛出错误', () => {
      expect(() => divide(10, 0)).toThrow('除数不能为零');
    });
  });
});
```

### 2. 集成测试 (Integration Tests)
**目标**：测试多个模块的协作
**工具**：Jest, Supertest, Testing Library
**覆盖率**：15-20%

```javascript
// 示例：测试API端点
// server.js
const express = require('express');
const app = express();
app.use(express.json());

let users = [];

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const user = { id: Date.now(), ...req.body };
  users.push(user);
  res.status(201).json(user);
});

module.exports = app;

// server.test.js
const request = require('supertest');
const app = require('./server');

describe('用户API', () => {
  beforeEach(() => {
    // 每个测试前清空用户数据
    users = [];
  });

  test('GET /api/users 返回空数组', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /api/users 创建新用户', async () => {
    const newUser = { name: '张三', email: 'zhangsan@example.com' };
    
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newUser);
    expect(response.body.id).toBeDefined();
  });

  test('创建用户后GET返回用户列表', async () => {
    const newUser = { name: '李四', email: 'lisi@example.com' };
    
    await request(app).post('/api/users').send(newUser);
    
    const response = await request(app).get('/api/users');
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('李四');
  });
});
```

### 3. E2E测试 (End-to-End Tests)
**目标**：测试完整的用户流程
**工具**：Cypress, Playwright, Puppeteer
**覆盖率**：5-10%

```javascript
// Cypress示例：测试登录流程
// cypress/e2e/login.cy.js
describe('登录功能', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('使用有效凭据成功登录', () => {
    cy.get('[data-testid="email-input"]').type('user@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', '欢迎回来');
  });

  it('使用无效凭据显示错误消息', () => {
    cy.get('[data-testid="email-input"]').type('wrong@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', '邮箱或密码错误');
  });

  it('表单验证：必填字段', () => {
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="email-input"]')
      .invoke('prop', 'validationMessage')
      .should('contain', '请填写此字段');
  });
});
```

## 测试工具选择

### 前端测试工具
| 工具 | 类型 | 特点 | 适用场景 |
|------|------|------|----------|
| **Jest** | 单元/集成 | 零配置、快照测试、覆盖率 | React/Vue/Node.js项目 |
| **Vitest** | 单元/集成 | Vite生态、极速、兼容Jest | Vite项目、需要快速反馈 |
| **Testing Library** | 集成 | 用户行为导向、避免测试实现细节 | React/Vue组件测试 |
| **Cypress** | E2E | 实时重载、时间旅行、调试方便 | 复杂用户流程测试 |
| **Playwright** | E2E | 多浏览器支持、自动等待、截图对比 | 跨浏览器测试 |

### 后端测试工具
| 工具 | 类型 | 特点 | 适用场景 |
|------|------|------|----------|
| **Jest** | 单元/集成 | 同上，也适用于Node.js | Express/Nest.js项目 |
| **Mocha + Chai** | 单元/集成 | 灵活、可扩展、社区成熟 | 需要高度定制的测试 |
| **Supertest** | 集成 | 专门测试HTTP服务器 | Express/Koa API测试 |
| **Jest + Prisma** | 集成 | 数据库集成测试 | 使用Prisma ORM的项目 |

## 测试驱动开发 (TDD)

### TDD流程：红-绿-重构
1. **红**：先写一个失败的测试
2. **绿**：写最简单的代码让测试通过
3. **重构**：优化代码，保持测试通过

### 示例：实现一个购物车
```javascript
// 步骤1：写一个失败的测试
// cart.test.js
import { ShoppingCart } from './cart';

describe('购物车', () => {
  test('新建购物车应该是空的', () => {
    const cart = new ShoppingCart();
    expect(cart.isEmpty()).toBe(true);
    expect(cart.getTotalItems()).toBe(0);
  });
});

// 步骤2：写最简单的实现让测试通过
// cart.js
export class ShoppingCart {
  isEmpty() {
    return true;
  }
  
  getTotalItems() {
    return 0;
  }
}

// 步骤3：添加更多测试
// cart.test.js
test('添加商品到购物车', () => {
  const cart = new ShoppingCart();
  cart.addItem({ id: 1, name: '商品A', price: 100 });
  
  expect(cart.isEmpty()).toBe(false);
  expect(cart.getTotalItems()).toBe(1);
});

// 步骤4：更新实现
// cart.js
export class ShoppingCart {
  constructor() {
    this.items = [];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  getTotalItems() {
    return this.items.length;
  }
  
  addItem(item) {
    this.items.push(item);
  }
}

// 步骤5：继续循环...
```

## 测试最佳实践

### 1. 测试命名规范
```javascript
// 好的测试命名
describe('UserService', () => {
  describe('createUser', () => {
    test('当提供有效数据时创建用户成功', () => {});
    test('当邮箱已存在时抛出错误', () => {});
    test('当密码太短时验证失败', () => {});
  });
  
  describe('updateUser', () => {
    test('更新用户基本信息', () => {});
    test('更新不存在的用户时抛出错误', () => {});
  });
});

// 使用BDD风格（Given-When-Then）
test('给定一个空购物车，当添加一件商品时，那么购物车应该有一件商品', () => {
  // Given
  const cart = new ShoppingCart();
  
  // When
  cart.addItem({ id: 1, name: '商品' });
  
  // Then
  expect(cart.getTotalItems()).toBe(1);
});
```

### 2. 测试隔离
```javascript
// 使用jest.mock模拟依赖
// userService.js
import { apiClient } from './apiClient';

export async function getUser(id) {
  return apiClient.get(`/users/${id}`);
}

// userService.test.js
import { getUser } from './userService';
import { apiClient } from './apiClient';

jest.mock('./apiClient');

describe('getUser', () => {
  test('成功获取用户', async () => {
    // 模拟API响应
    const mockUser = { id: 1, name: '张三' };
    apiClient.get.mockResolvedValue(mockUser);
    
    const user = await getUser(1);
    
    expect(apiClient.get).toHaveBeenCalledWith('/users/1');
    expect(user).toEqual(mockUser);
  });
  
  test('API错误时抛出异常', async () => {
    apiClient.get.mockRejectedValue(new Error('网络错误'));
    
    await expect(getUser(1)).rejects.toThrow('网络错误');
  });
});
```

### 3. 测试数据工厂
```javascript
// test/factories/userFactory.js
export function createUser(overrides = {}) {
  const defaultUser = {
    id: 1,
    name: '测试用户',
    email: 'test@example.com',
    age: 25,
    isActive: true,
    createdAt: new Date('2023-01-01'),
  };
  
  return { ...defaultUser, ...overrides };
}

// 使用
import { createUser } from '../factories/userFactory';

test('用户年龄验证', () => {
  const adultUser = createUser({ age: 30 });
  const childUser = createUser({ age: 15 });
  
  expect(isAdult(adultUser)).toBe(true);
  expect(isAdult(childUser)).toBe(false);
});
```

## 测试覆盖率

### 配置Jest覆盖率
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts",
      "!src/**/*.stories.{js,jsx,ts,tsx}",
      "!src/**/*.test.{js,jsx,ts,tsx}"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

### 覆盖率报告解读
```
File          | % Stmts | % Branch | % Funcs | % Lines 
--------------|---------|----------|---------|---------
All files     |   85.23 |    72.34 |   80.12 |   84.56 
 src/         |   90.12 |    80.45 |   85.67 |   89.23 
  utils.js    |  100.00 |   100.00 |  100.00 |  100.00 
  service.js  |   85.34 |    75.23 |   80.45 |   84.12 
  component.js|   75.45 |    60.12 |   70.34 |   74.89 
```

## CI/CD中的测试

### GitHub Actions配置
```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run unit tests
      run: npm test
    
    - name: Run integration tests
      run: npm run test:integration
      env:
        DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        token: ${{ secrets.CODECOV_TOKEN }}
```

## 常见测试问题解决

### 1. 测试速度慢
```javascript
// 使用jest.setTimeout增加超时时间
jest.setTimeout(10000); // 10秒

// 使用jest.useFakeTimers模拟时间
test('定时器测试', () => {
  jest.useFakeTimers();
  
  const callback = jest.fn();
  setTimeout(callback, 1000);
  
  jest.advanceTimersByTime(1000);
  
  expect(callback).toHaveBeenCalled();
  
  jest.useRealTimers();
});
```

### 2. 测试环境问题
```javascript
// 使用环境变量区分测试环境
if (process.env.NODE_ENV === 'test') {
  // 使用内存数据库或模拟数据
  db = new MemoryDatabase();
} else {
  db = new RealDatabase();
}

// 测试前设置环境变量
// package.json
{
  "scripts": {
    "test": "NODE_ENV=test jest"
  }
}
```

### 3. 异步测试
```javascript
// 使用async/await
test('异步获取数据', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// 测试Promise
test('Promise拒绝', async () => {
  await expect(Promise.reject(new Error('错误'))).rejects.toThrow('错误');
});

// 测试回调函数
test('回调函数', (done) => {
  function callback(error, data) {
    try {
      expect(error).toBeNull();
      expect(data).toBe('success');
      done();
    } catch (error) {
      done(error);
    }
  }
  
  asyncFunction(callback);
});
```

## 测试检查清单

### 编写测试前
- [ ] 理解需求：测试什么功能？
- [ ] 确定测试类型：单元、集成还是E2E？
- [ ] 准备测试数据：需要哪些输入数据？
- [ ] 预期结果：期望的输出是什么？

### 测试完成后
- [ ] 测试是否通过？
- [ ] 测试是否独立？（不依赖其他测试）
- [ ] 测试是否清晰？（其他人能看懂）
- [ ] 测试是否覆盖了边界情况？
- [ ] 测试是否快速执行？

## 下一步行动

1. **选择测试工具**：根据项目需求选择合适的测试框架
2. **建立测试结构**：创建测试目录和配置文件
3. **编写核心测试**：从最重要的功能开始编写测试
4. **集成到CI/CD**：配置自动化测试流程
5. **监控测试覆盖率**：定期检查并提高覆盖率

---

**提示**：测试不是一次性的工作，而是持续的过程。随着代码的变化，测试也需要不断更新和维护。好的测试套件是项目健康的重要指标。