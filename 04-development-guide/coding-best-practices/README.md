# 编码最佳实践 (Coding Best Practices)

## 模块目标
编写可维护、可扩展、高质量的代码，建立团队统一的编码规范。

## 核心原则
1. **可读性优先**：代码是给人看的，其次才是机器执行
2. **单一职责**：每个函数/模块只做一件事
3. **避免重复**：DRY原则（Don't Repeat Yourself）
4. **防御性编程**：预见并处理可能的错误
5. **渐进式优化**：先写正确的代码，再优化性能

## 代码结构规范

### 1. 文件组织
```
src/
├── components/     # 可复用UI组件
│   ├── Button/
│   │   ├── Button.jsx/Button.tsx
│   │   ├── Button.module.css/Button.scss
│   │   ├── Button.test.js
│   │   └── index.js
│   └── Layout/
│       ├── Header.jsx
│       ├── Footer.jsx
│       └── Sidebar.jsx
├── pages/         # 页面组件
├── hooks/         # 自定义React Hooks
├── utils/         # 工具函数
├── constants/     # 常量定义
├── types/         # TypeScript类型定义
├── services/      # API服务层
├── store/         # 状态管理
└── styles/        # 全局样式
```

### 2. 导入顺序
```javascript
// 1. 第三方库（按字母顺序）
import React from 'react';
import axios from 'axios';
import lodash from 'lodash';

// 2. 绝对路径导入
import { Button } from '@/components/Button';
import { API_URL } from '@/constants/config';

// 3. 相对路径导入
import { formatDate } from '../utils/date';
import styles from './UserCard.module.css';

// 4. 类型导入（TypeScript）
import type { User } from '@/types/user';
```

## 命名规范

### 1. 变量和函数命名
```javascript
// 好的命名
const userList = [];           // 数组用复数或List
const isLoading = false;       // 布尔值用is/has/can开头
const MAX_RETRY_COUNT = 3;     // 常量全大写+下划线
function getUserById(id) {}    // 动词开头，描述动作
function calculateTotal() {}   // 明确表达功能

// 不好的命名
const data = [];              // 太模糊
const flag = false;           // 不知道是什么标志
const num = 10;               // 缩写不明确
function get() {}             // 不知道获取什么
function process() {}         // 不知道处理什么
```

### 2. 组件命名（React/Vue）
```jsx
// React组件：PascalCase
function UserProfile() {
  return <div>用户资料</div>;
}

// 导出组件
export default UserProfile;

// Vue组件：PascalCase文件名
// UserProfile.vue
```

### 3. CSS类名命名
```css
/* BEM命名法（Block Element Modifier） */
.user-card {}              /* Block */
.user-card__header {}      /* Element */
.user-card__title {}       /* Element */
.user-card--active {}      /* Modifier */
.user-card--disabled {}    /* Modifier */

/* 或使用CSS Modules */
.userCard {}
.userCardHeader {}
```

## 函数设计原则

### 1. 单一职责原则
```javascript
// 不好的例子：函数做了太多事
function processUserData(user) {
  // 验证数据
  if (!user.name || !user.email) {
    throw new Error('用户数据不完整');
  }
  
  // 格式化数据
  const formattedUser = {
    name: user.name.trim(),
    email: user.email.toLowerCase(),
    createdAt: new Date().toISOString()
  };
  
  // 保存到数据库
  db.save('users', formattedUser);
  
  // 发送欢迎邮件
  emailService.sendWelcome(formattedUser.email);
  
  return formattedUser;
}

// 好的例子：拆分成多个单一职责函数
function validateUser(user) {
  if (!user.name || !user.email) {
    throw new Error('用户数据不完整');
  }
  return true;
}

function formatUser(user) {
  return {
    name: user.name.trim(),
    email: user.email.toLowerCase(),
    createdAt: new Date().toISOString()
  };
}

async function processUserData(user) {
  validateUser(user);
  const formattedUser = formatUser(user);
  
  await db.save('users', formattedUser);
  await emailService.sendWelcome(formattedUser.email);
  
  return formattedUser;
}
```

### 2. 纯函数
```javascript
// 纯函数：相同输入总是得到相同输出，无副作用
function add(a, b) {
  return a + b;
}

function formatUserName(user) {
  return `${user.firstName} ${user.lastName}`.trim();
}

// 非纯函数：有副作用
let counter = 0;
function increment() {
  counter++;  // 修改外部状态
  return counter;
}

function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));  // 副作用
}
```

### 3. 函数参数设计
```javascript
// 不好的设计：参数过多
function createUser(name, email, password, age, gender, address, phone) {
  // ...
}

// 好的设计：使用对象参数
function createUser(userData) {
  const { name, email, password, age, gender, address, phone } = userData;
  // ...
}

// 更好的设计：使用配置对象，带默认值
function createUser({
  name,
  email,
  password,
  age = 18,
  gender = 'unknown',
  address = '',
  phone = ''
} = {}) {
  // ...
}

// 使用
createUser({
  name: '张三',
  email: 'zhangsan@example.com',
  password: '123456'
});
```

## 错误处理

### 1. 使用try-catch处理异步错误
```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    // 记录错误日志
    console.error('获取用户数据失败:', error);
    
    // 返回友好的错误信息
    return {
      success: false,
      error: '无法获取用户数据，请稍后重试',
      originalError: error.message
    };
  }
}
```

### 2. 自定义错误类
```javascript
class AppError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }
}

class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 'VALIDATION_ERROR', 400);
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} 未找到`, 'NOT_FOUND', 404);
    this.resource = resource;
  }
}

// 使用
function getUser(id) {
  if (!id) {
    throw new ValidationError('用户ID不能为空', 'id');
  }
  
  const user = db.findUser(id);
  if (!user) {
    throw new NotFoundError('用户');
  }
  
  return user;
}
```

### 3. 错误边界（React）
```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // 可以在这里记录错误到监控系统
    console.error('组件错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>出错了</h2>
          <p>{this.state.error?.message || '未知错误'}</p>
          <button onClick={() => window.location.reload()}>
            刷新页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 使用
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

## 代码注释规范

### 1. JSDoc注释（函数/类）
```javascript
/**
 * 计算订单总价
 * @param {Array<OrderItem>} items - 订单项数组
 * @param {number} discount - 折扣率（0-1之间）
 * @param {boolean} [includeTax=true] - 是否包含税费
 * @returns {number} 订单总价
 * @throws {ValidationError} 当折扣率无效时抛出
 * @example
 * const total = calculateOrderTotal(items, 0.1);
 */
function calculateOrderTotal(items, discount, includeTax = true) {
  if (discount < 0 || discount > 1) {
    throw new ValidationError('折扣率必须在0-1之间', 'discount');
  }
  
  // 计算逻辑...
}
```

### 2. 行内注释
```javascript
// 不好的注释：描述代码在做什么（代码本身应该清晰）
// 循环遍历用户数组
for (let i = 0; i < users.length; i++) {
  // 发送邮件给每个用户
  sendEmail(users[i]);
}

// 好的注释：解释为什么这么做
// 使用for循环而不是forEach，因为需要break提前退出
for (let i = 0; i < users.length; i++) {
  if (users[i].unsubscribed) {
    break; // 遇到退订用户后停止发送
  }
  sendEmail(users[i]);
}

// 好的注释：解释复杂的业务逻辑
// 这里需要特殊处理，因为API返回的时间戳是UTC格式
// 需要转换为本地时间显示
const localTime = utcToLocal(apiTimestamp);
```

### 3. TODO和FIXME注释
```javascript
// TODO: 性能优化 - 这里可以添加缓存机制
function getExpensiveData() {
  // 当前实现每次都会重新计算
  return calculateExpensiveResult();
}

// FIXME: 临时解决方案，需要重构
// 当前使用同步调用，应该改为异步
function processData(data) {
  // 同步处理，会阻塞主线程
  return heavyProcessing(data);
}

// NOTE: 重要提醒
// 这个函数依赖于外部API，如果API变化需要更新
async function fetchExternalData() {
  // ...
}
```

## 性能优化技巧

### 1. 避免不必要的渲染（React）
```jsx
import React, { memo, useMemo, useCallback } from 'react';

// 使用React.memo避免不必要的重新渲染
const UserItem = memo(function UserItem({ user, onSelect }) {
  return (
    <li onClick={() => onSelect(user.id)}>
      {user.name}
    </li>
  );
});

// 使用useMemo缓存计算结果
function UserList({ users, searchTerm }) {
  const filteredUsers = useMemo(() => {
    console.log('过滤用户列表');
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]); // 依赖项变化时才重新计算

  // 使用useCallback缓存函数
  const handleSelect = useCallback((userId) => {
    console.log('选择用户:', userId);
  }, []); // 空依赖数组，函数只创建一次

  return (
    <ul>
      {filteredUsers.map(user => (
        <UserItem 
          key={user.id} 
          user={user} 
          onSelect={handleSelect}
        />
      ))}
    </ul>
  );
}
```

### 2. 懒加载和代码分割
```javascript
// React懒加载组件
import React, { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <div>
      <Suspense fallback={<div>加载中...</div>}>
        <HeavyComponent />
      </Suspense>
    </div>
  );
}

// 动态导入（ES2020）
async function loadFeature() {
  if (userNeedsFeature()) {
    const { initializeFeature } = await import('./feature.js');
    initializeFeature();
  }
}

// Webpack魔法注释（代码分割）
const LoginPage = lazy(() => import(
  /* webpackChunkName: "login" */ './pages/Login'
));
const DashboardPage = lazy(() => import(
  /* webpackChunkName: "dashboard" */ './pages/Dashboard'
));
```

### 3. 防抖和节流
```javascript
// 防抖：连续触发时，只执行最后一次
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流：连续触发时，每隔一段时间执行一次
function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 使用示例
const searchInput = document.getElementById('search');
const handleSearch = debounce((query) => {
  console.log('搜索:', query);
  // 执行搜索API调用
}, 300);

searchInput.addEventListener('input', (e) => {
  handleSearch(e.target.value);
});
```

## 代码审查清单

### 提交前自检
- [ ] 代码是否通过所有测试？
- [ ] 是否有未使用的导入或变量？
- [ ] 函数和变量命名是否清晰？
- [ ] 代码注释是否恰当？
- [ ] 错误处理是否完善？
- [ ] 性能是否有明显问题？
- [ ] 安全性是否有隐患？

### 代码审查要点
- **功能正确性**：代码是否实现了需求？
- **代码可读性**：其他人能否理解这段代码？
- **测试覆盖率**：是否有足够的测试？
- **性能影响**：是否会影响应用性能？
- **安全性**：是否有安全漏洞？
- **兼容性**：是否兼容所有目标环境？

## 实用工具和配置

### 1. ESLint配置 (.eslintrc.js)
```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    // 自定义规则
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'react/prop-types': 'off', // TypeScript项目中可以关闭
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### 2. Prettier配置 (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### 3. EditorConfig (.editorconfig)
```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.{js,jsx,ts,tsx}]
max_line_length = 80

[*.{json,yml,yaml}]
indent_size = 2

[*.{html,css,scss}]
indent_size = 2
```

## 下一步行动

1. **建立编码规范**：根据项目特点制定团队规范
2. **配置代码检查工具**：设置ESLint、Prettier等
3. **代码审查实践**：建立代码审查流程
4. **持续学习改进**：定期回顾和优化编码实践

---

**提示**：编码最佳实践不是一成不变的，应该根据项目特点、团队习惯和技术发展不断调整。关键是建立一致的规范并坚持执行。