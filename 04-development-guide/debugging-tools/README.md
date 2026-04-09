# 调试工具 (Debugging Tools)

## 模块目标
掌握高效的调试技巧和工具，快速定位和解决代码问题。

## 核心原则
1. **系统化调试**：有方法地定位问题，而不是盲目尝试
2. **工具化思维**：善用调试工具提高效率
3. **预防性调试**：编写易于调试的代码
4. **知识积累**：记录常见问题和解决方案

## 浏览器开发者工具

### 1. Chrome DevTools 核心功能

#### 元素面板 (Elements)
```javascript
// 快速选择元素
// 控制台输入
$0  // 当前选中的元素
$1  // 之前选中的元素
$$('div')  // 选择所有div元素

// 修改样式实时预览
// 1. 选中元素
// 2. 在Styles面板修改CSS
// 3. 实时看到效果

// 强制状态
// 在Styles面板点击 :hov 按钮
// 可以强制元素处于 :hover, :active, :focus 等状态
```

#### 控制台面板 (Console)
```javascript
// 常用Console API
console.log('普通日志', variable);
console.info('信息日志');
console.warn('警告日志');
console.error('错误日志');
console.table(array);  // 表格形式显示数组/对象
console.dir(object);   // 显示对象的所有属性
console.group('组名'); // 分组日志
console.groupEnd();
console.time('计时器'); // 性能计时
console.timeEnd('计时器');

// 条件日志
console.assert(condition, '消息'); // 条件为false时输出

// 样式化日志
console.log('%c带样式的日志', 'color: red; font-size: 20px;');
```

#### 源代码面板 (Sources)
```javascript
// 断点类型
1. 行断点：点击行号
2. 条件断点：右键行号 -> Add conditional breakpoint
3. DOM断点：Elements面板右键元素 -> Break on
4. 事件监听器断点：Sources面板右侧 Event Listener Breakpoints
5. XHR/Fetch断点：Sources面板右侧 XHR/fetch Breakpoints

// 调试控制
F8: 继续执行
F10: 单步跳过
F11: 单步进入
Shift + F11: 单步跳出
Ctrl + \: 暂停/继续

// 监视表达式
// 在Watch面板添加变量名或表达式
user.name
items.length
calculateTotal(price, quantity)
```

#### 网络面板 (Network)
```javascript
// 过滤请求
- 按类型：XHR, JS, CSS, Img, Media, Font, Doc, WS
- 按域名：输入域名过滤
- 按关键字：输入搜索词

// 请求详情查看
1. Headers: 请求头、响应头
2. Preview: 响应预览
3. Response: 原始响应
4. Timing: 请求时间线

// 模拟慢速网络
1. 点击Online下拉菜单
2. 选择 Slow 3G 或自定义
3. 测试页面在慢速网络下的表现
```

#### 性能面板 (Performance)
```javascript
// 性能分析步骤
1. 点击Record按钮
2. 执行要分析的操作
3. 点击Stop按钮
4. 分析火焰图

// 关键指标
- FPS: 帧率（绿色表示60fps）
- CPU: CPU使用率
- NET: 网络请求
- HEAP: 内存使用

// 内存泄漏检测
1. 切换到Memory面板
2. 选择Heap snapshot
3. 执行操作前后各拍一次快照
4. 对比对象数量变化
```

### 2. 高级调试技巧

#### 使用debugger语句
```javascript
function complexCalculation(data) {
  debugger; // 代码执行到这里会暂停
  
  // 复杂计算逻辑
  const result = data
    .filter(item => item.active)
    .map(item => item.value * 2)
    .reduce((sum, value) => sum + value, 0);
  
  return result;
}

// 条件debugger
if (errorCount > 5) {
  debugger; // 只在错误较多时暂停
}
```

#### 黑盒脚本 (Blackboxing)
```javascript
// 忽略第三方库的调试
// 1. 在Sources面板右键脚本文件
// 2. 选择 "Blackbox script"
// 3. 调试时跳过该脚本的断点

// 或通过设置永久黑盒
// DevTools设置 -> Ignore List -> Add pattern
// 例如: *node_modules*, *jquery*, *lodash*
```

#### 实时表达式 (Live Expressions)
```javascript
// 在Console面板点击 "眼睛" 图标
// 添加要监视的表达式，它会实时更新

// 常用监视表达式
window.scrollY  // 页面滚动位置
document.activeElement  // 当前焦点元素
performance.now()  // 页面运行时间
navigator.onLine  // 网络连接状态
```

## Node.js 调试

### 1. 使用内置调试器
```bash
# 启动调试
node --inspect app.js
# 或指定端口
node --inspect=9229 app.js

# 浏览器打开 chrome://inspect
# 点击 "Open dedicated DevTools for Node"
```

### 2. VS Code 调试配置
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "启动程序",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/app.js",
      "console": "integratedTerminal"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "附加到进程",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "type": "node",
      "request": "launch",
      "name": "当前文件测试",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["${file}"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 3. 调试Express应用
```javascript
// app.js
const express = require('express');
const app = express();

// 添加调试中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// 错误处理中间件（便于调试）
app.use((err, req, res, next) => {
  console.error('错误:', err);
  console.error('错误堆栈:', err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});
```

## 日志系统

### 1. 结构化日志
```javascript
// utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// 使用
logger.info('用户登录', { userId: 123, ip: '192.168.1.1' });
logger.error('数据库连接失败', { error: err.message, stack: err.stack });
```

### 2. 请求ID追踪
```javascript
// middleware/requestLogger.js
const { v4: uuidv4 } = require('uuid');

function requestLogger(req, res, next) {
  const requestId = uuidv4();
  req.requestId = requestId;
  
  // 记录请求开始
  const startTime = Date.now();
  
  // 记录响应完成
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('请求完成', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent')
    });
  });
  
  next();
}

// 在日志中包含requestId
logger.info('处理用户请求', { 
  requestId: req.requestId,
  userId: req.user?.id 
});
```

## 性能分析工具

### 1. Chrome Performance API
```javascript
// 测量函数执行时间
function measurePerformance(fn, ...args) {
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  
  console.log(`函数 ${fn.name} 执行时间: ${(end - start).toFixed(2)}ms`);
  return result;
}

// 使用
const heavyResult = measurePerformance(heavyCalculation, data);

// 用户计时API
performance.mark('task-start');
// 执行任务...
performance.mark('task-end');
performance.measure('task-duration', 'task-start', 'task-end');

const measure = performance.getEntriesByName('task-duration')[0];
console.log(`任务耗时: ${measure.duration}ms`);
```

### 2. 内存分析
```javascript
// 检查内存使用
function checkMemoryUsage() {
  const used = process.memoryUsage();
  
  console.log('内存使用情况:');
  for (let key in used) {
    console.log(`${key}: ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }
}

// 检测内存泄漏
const leakedObjects = new Set();

function trackObject(obj) {
  leakedObjects.add(obj);
  
  // 定期检查
  setInterval(() => {
    console.log(`跟踪对象数量: ${leakedObjects.size}`);
  }, 5000);
}

// 使用WeakMap避免内存泄漏
const cache = new WeakMap();

function getExpensiveData(key) {
  if (!cache.has(key)) {
    const data = calculateExpensiveData(key);
    cache.set(key, data);
  }
  return cache.get(key);
}
```

## 错误监控

### 1. 前端错误捕获
```javascript
// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
  
  // 发送到错误监控服务
  sendToErrorService({
    message: event.error.message,
    stack: event.error.stack,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    userAgent: navigator.userAgent,
    url: window.location.href
  });
  
  // 阻止默认错误处理（谨慎使用）
  // event.preventDefault();
});

// Promise错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
  
  sendToErrorService({
    type: 'unhandledrejection',
    reason: event.reason?.message || String(event.reason),
    stack: event.reason?.stack
  });
});

// 资源加载错误
window.addEventListener('load', () => {
  const resources = performance.getEntriesByType('resource');
  
  resources.forEach(resource => {
    if (resource.initiatorType === 'script' || resource.initiatorType === 'css') {
      // 检查资源是否加载成功
      if (resource.duration === 0) {
        console.warn('资源可能加载失败:', resource.name);
      }
    }
  });
});
```

### 2. 后端错误监控
```javascript
// 错误监控中间件
function errorMonitoring(req, res, next) {
  try {
    next();
  } catch (error) {
    // 记录错误
    logger.error('请求处理错误', {
      requestId: req.requestId,
      method: req.method,
      url: req.url,
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
      ip: req.ip
    });
    
    // 发送到外部监控服务
    if (process.env.NODE_ENV === 'production') {
      sendToSentry(error, {
        requestId: req.requestId,
        userId: req.user?.id
      });
    }
    
    // 返回错误响应
    res.status(500).json({
      error: '服务器内部错误',
      requestId: req.requestId
    });
  }
}
```

## 调试工作流

### 1. 问题定位流程
```
1. 重现问题
   - 在什么条件下出现？
   - 是否稳定重现？
   - 最小化重现步骤

2. 收集信息
   - 错误消息
   - 控制台日志
   - 网络请求
   - 用户操作步骤

3. 假设验证
   - 提出可能的原因
   - 设计实验验证
   - 使用断点或日志验证

4. 修复验证
   - 实施修复
   - 测试是否解决问题
   - 确保没有引入新问题
```

### 2. 常见问题模式库
```javascript
// 创建问题模式文档
const problemPatterns = {
  '内存泄漏': {
    symptoms: ['页面越来越卡', '内存使用持续增长'],
    causes: ['未清理的定时器', '未解绑的事件监听器', '闭包引用'],
    solutions: ['使用WeakMap', '及时清理资源', '使用Chrome Memory面板分析']
  },
  '渲染性能问题': {
    symptoms: ['页面卡顿', 'FPS下降'],
    causes: ['频繁重渲染', '复杂DOM操作', '大量图片加载'],
    solutions: ['使用React.memo', '虚拟滚动', '图片懒加载']
  },
  'API请求失败': {
    symptoms: ['网络错误', 'CORS错误', '超时'],
    causes: ['服务器问题', '网络问题', '配置错误'],
    solutions: ['检查网络连接', '验证API配置', '添加重试机制']
  }
};
```

## 实用调试脚本

### 1. 自动错误报告
```javascript
// utils/errorReporter.js
class ErrorReporter {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
  }
  
  report(error, context = {}) {
    const errorReport = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    this.errors.push(errorReport);
    
    // 保持错误数量在限制内
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
    
    // 发送到服务器（生产环境）
    if (process.env.NODE_ENV === 'production') {
      this.sendToServer(errorReport);
    }
    
    console.error('错误报告:', errorReport);
  }
  
  sendToServer(report) {
    // 使用navigator.sendBeacon确保在页面卸载时也能发送
    const blob = new Blob([JSON.stringify(report)], { type: 'application/json' });
    navigator.sendBeacon('/api/error-report', blob);
  }
  
  getErrors() {
    return this.errors;
  }
  
  clear() {
    this.errors = [];
  }
}

// 全局实例
window.errorReporter = new ErrorReporter();
```

### 2. 性能监控脚本
```javascript
// utils/performanceMonitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      fcp: null,  // First Contentful Paint
      lcp: null,  // Largest Contentful Paint
      fid: null,  // First Input Delay
      cls: null   // Cumulative Layout Shift
    };
    
    this.observePerformance();
  }
  
  observePerformance() {
    // 使用PerformanceObserver API
    if ('PerformanceObserver' in window) {
      // 观察绘制性能
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      
      // 观察布局偏移
      const layoutShiftObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            this.metrics.cls = (this.metrics.cls || 0) + entry.value;
          }
        }
      });
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    }
    
    // 测量首次输入延迟
    let firstInputTime;
    let firstInputDelay;
    
    const firstInputHandler = (event) => {
      firstInputTime = event.timeStamp;
      firstInputDelay = event.processingStart - event.startTime;
      
      this.metrics.fid = firstInputDelay;
      
      // 移除监听器
      event.target.removeEventListener(event.type, firstInputHandler, { once: true });
    };
    
    // 监听首次用户输入
    ['click', 'keydown', 'mousedown', 'pointerdown'].forEach(eventType => {
      window.addEventListener(eventType, firstInputHandler, { once: true, capture: true });
    });
  }
  
  getMetrics() {
    return this.metrics;
  }
  
  logMetrics() {
    console.group('性能指标');
    console.log('首次内容绘制 (FCP):', this.metrics.fcp?.toFixed(2), 'ms');
    console.log('首次输入延迟 (FID):', this.metrics.fid?.toFixed(2), 'ms');
    console.log('累积布局偏移 (CLS):', this.metrics.cls?.toFixed(4));
    console.groupEnd();
  }
}

// 使用
const perfMonitor = new PerformanceMonitor();

// 页面加载完成后查看指标
window.addEventListener('load', () => {
  setTimeout(() => {
    perfMonitor.logMetrics();
  }, 1000);
});
```

## 调试检查清单

### 遇到问题时
- [ ] 是否查看了浏览器控制台？
- [ ] 是否检查了网络请求？
- [ ] 是否添加了断点或console.log？
- [ ] 是否尝试了最小化重现？
- [ ] 是否搜索了类似问题？

### 解决问题后
- [ ] 是否记录了解决方案？
- [ ] 是否添加了相关测试？
- [ ] 是否修复了根本原因？
- [ ] 是否检查了类似代码？
- [ ] 是否更新了文档？

## 下一步行动

1. **熟悉调试工具**：掌握Chrome DevTools核心功能
2. **建立调试流程**：制定系统化的问题定位方法
3. **配置监控系统**：设置错误监控和性能监控
4. **积累调试经验**：记录常见问题和解决方案
5. **分享调试技巧**：与团队成员分享有效的调试方法

---

**提示**：调试不仅是解决问题的过程，更是理解系统运行机制的机会。每次调试都应该让你对代码有更深的理解，而不仅仅是修复了一个bug。