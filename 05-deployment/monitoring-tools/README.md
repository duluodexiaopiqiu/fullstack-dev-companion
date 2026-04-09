# 监控工具 (Monitoring Tools)

## 模块目标
建立全面的监控体系，实时掌握应用状态，快速发现和解决问题。

## 核心原则
1. **全面监控**：覆盖应用、服务器、业务等各个层面
2. **实时告警**：问题发生时立即通知
3. **趋势分析**：通过历史数据预测问题
4. **根因分析**：快速定位问题原因

## 监控体系架构

### 1. 监控层次
```
┌─────────────────────────────────────┐
│          业务监控 (Business)         │
│  - 关键业务指标 (订单、用户、收入)    │
│  - 转化率、留存率、用户满意度        │
├─────────────────────────────────────┤
│          应用监控 (Application)      │
│  - 应用性能 (响应时间、错误率)       │
│  - 用户行为 (页面浏览、点击)         │
│  - 前端性能 (加载时间、JS错误)       │
├─────────────────────────────────────┤
│          系统监控 (System)           │
│  - 服务器资源 (CPU、内存、磁盘)      │
│  - 网络状态 (带宽、延迟、丢包)       │
│  - 服务状态 (进程、端口、日志)       │
├─────────────────────────────────────┤
│          基础设施监控 (Infrastructure)│
│  - 数据库性能 (查询时间、连接数)     │
│  - 缓存状态 (命中率、内存使用)       │
│  - 消息队列 (积压、消费速率)         │
└─────────────────────────────────────┘
```

### 2. 监控工具选择
| 监控类型 | 开源方案 | 商业方案 | 自建方案 |
|----------|----------|----------|----------|
| **系统监控** | Prometheus + Grafana | Datadog, New Relic | Zabbix, Nagios |
| **应用性能** | Jaeger, SkyWalking | AppDynamics, Dynatrace | 自定义埋点 |
| **日志监控** | ELK Stack (Elasticsearch, Logstash, Kibana) | Splunk, Sumo Logic | Graylog |
| **前端监控** | Sentry (开源版) | Sentry (商业版), LogRocket | 自定义JS监控 |
| **业务监控** | 自定义指标 + Grafana | Amplitude, Mixpanel | 数据仓库 + BI |

## 系统监控 (Prometheus + Grafana)

### 1. Prometheus 安装配置
```bash
# 使用Docker安装Prometheus
docker run -d \
  --name=prometheus \
  -p 9090:9090 \
  -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml \
  prom/prometheus

# prometheus.yml 配置
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']
  
  - job_name: 'node_exporter'
    static_configs:
      - targets: ['node-exporter:9100']
  
  - job_name: 'app_metrics'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
```

### 2. Node Exporter (服务器监控)
```bash
# 安装Node Exporter
docker run -d \
  --name=node_exporter \
  -p 9100:9100 \
  -v "/proc:/host/proc:ro" \
  -v "/sys:/host/sys:ro" \
  -v "/:/rootfs:ro" \
  --net="host" \
  prom/node-exporter

# 关键监控指标
- node_cpu_seconds_total: CPU使用时间
- node_memory_MemTotal_bytes: 总内存
- node_memory_MemAvailable_bytes: 可用内存
- node_filesystem_size_bytes: 磁盘空间
- node_filesystem_avail_bytes: 可用磁盘空间
- node_network_receive_bytes_total: 网络接收
- node_network_transmit_bytes_total: 网络发送
```

### 3. Grafana 仪表板配置
```bash
# 安装Grafana
docker run -d \
  --name=grafana \
  -p 3000:3000 \
  grafana/grafana

# 配置数据源
1. 访问 http://localhost:3000
2. 默认账号: admin/admin
3. 添加数据源 -> Prometheus
4. URL: http://prometheus:9090
5. 保存并测试

# 导入预置仪表板
# Node Exporter仪表板ID: 1860
# 或创建自定义仪表板
```

### 4. 告警规则配置
```yaml
# alert_rules.yml
groups:
  - name: server_alerts
    rules:
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "高CPU使用率"
          description: "实例 {{ $labels.instance }} CPU使用率超过80% (当前值: {{ $value }}%)"
      
      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "高内存使用率"
          description: "实例 {{ $labels.instance }} 内存使用率超过85%"
      
      - alert: LowDiskSpace
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes * 100) < 20
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "磁盘空间不足"
          description: "实例 {{ $labels.instance }} 磁盘空间不足20%"
```

## 应用性能监控 (APM)

### 1. 使用Sentry监控错误
```javascript
// 前端集成Sentry
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "https://your-dsn@sentry.io/your-project",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0, // 性能监控采样率
  environment: process.env.NODE_ENV,
  release: "your-app@1.0.0",
});

// 手动捕获错误
try {
  riskyOperation();
} catch (error) {
  Sentry.captureException(error, {
    tags: { feature: "user-profile" },
    extra: { userId: 123 }
  });
}

// 设置用户上下文
Sentry.setUser({
  id: "12345",
  email: "user@example.com",
  username: "user123"
});

// 性能监控
const transaction = Sentry.startTransaction({ name: "load-user-data" });
// 执行操作...
transaction.finish();
```

### 2. Node.js应用监控
```javascript
// 使用Prometheus客户端
const promClient = require('prom-client');

// 创建指标
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP请求持续时间',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const activeRequests = new promClient.Gauge({
  name: 'active_requests',
  help: '当前活跃请求数'
});

// Express中间件
app.use((req, res, next) => {
  activeRequests.inc();
  
  const end = httpRequestDurationMicroseconds.startTimer();
  
  res.on('finish', () => {
    end({ 
      method: req.method, 
      route: req.route?.path || req.path,
      code: res.statusCode 
    });
    activeRequests.dec();
  });
  
  next();
});

// 暴露metrics端点
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

// 业务指标
const ordersCounter = new promClient.Counter({
  name: 'orders_total',
  help: '总订单数',
  labelNames: ['status']
});

// 在创建订单时增加
ordersCounter.inc({ status: 'created' });
```

## 日志监控 (ELK Stack)

### 1. Elasticsearch + Logstash + Kibana 部署
```yaml
# docker-compose.yml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.5.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.5.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf
    ports:
      - "5000:5000"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:8.5.0
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  elasticsearch-data:
```

### 2. Logstash配置
```ruby
# logstash.conf
input {
  # 文件输入
  file {
    path => "/var/log/app/*.log"
    start_position => "beginning"
    sincedb_path => "/dev/null"
  }
  
  # TCP输入（Node.js应用发送日志）
  tcp {
    port => 5000
    codec => json_lines
  }
}

filter {
  # 解析JSON日志
  if [message] =~ /^{.*}$/ {
    json {
      source => "message"
    }
  }
  
  # 解析时间戳
  date {
    match => [ "timestamp", "ISO8601" ]
  }
  
  # 添加地理信息（根据IP）
  geoip {
    source => "client_ip"
  }
  
  # 用户代理解析
  useragent {
    source => "user_agent"
    target => "user_agent_info"
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"
  }
  
  # 调试输出
  stdout {
    codec => rubydebug
  }
}
```

## 前端性能监控

### 1. 使用Web Vitals监控核心指标
```javascript
// 安装web-vitals库
// npm install web-vitals

import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // 'good', 'needs-improvement', 'poor'
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType
  };

  // 发送到监控服务
  fetch('/api/web-vitals', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  });
}

// 监控所有核心Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
getFCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 2. 错误监控和用户行为追踪
```javascript
// 全局错误监控
window.addEventListener('error', (event) => {
  const errorInfo = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString()
  };
  
  sendToMonitoring('/api/error', errorInfo);
});

// Promise错误
window.addEventListener('unhandledrejection', (event) => {
  sendToMonitoring('/api/promise-error', {
    reason: event.reason?.message || String(event.reason),
    stack: event.reason?.stack
  });
});

// 用户行为追踪
function trackUserAction(action, data = {}) {
  const actionData = {
    action,
    ...data,
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    referrer: document.referrer,
    screenSize: `${window.innerWidth}x${window.innerHeight}`
  };
  
  // 使用sendBeacon确保在页面卸载时也能发送
  navigator.sendBeacon('/api/user-action', JSON.stringify(actionData));
}
```

## 业务监控

### 1. 关键业务指标定义
```javascript
// 电商业务指标示例
const businessMetrics = {
  // 收入相关
  dailyRevenue: {
    query: `SELECT SUM(amount) FROM orders WHERE DATE(created_at) = CURDATE()`,
    alert: { threshold: 10000, condition: '<' } // 日收入低于1万告警
  },
  
  // 用户相关
  newUsers: {
    query: `SELECT COUNT(*) FROM users WHERE DATE(created_at) = CURDATE()`,
    alert: { threshold: 100, condition: '<' } // 日新增用户低于100告警
  },
  
  // 订单相关
  orderConversionRate: {
    query: `SELECT 
              (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()) / 
              (SELECT COUNT(*) FROM sessions WHERE DATE(created_at) = CURDATE()) * 100`,
    alert: { threshold: 2, condition: '<' } // 转化率低于2%告警
  },
  
  // 库存相关
  lowStockProducts: {
    query: `SELECT COUNT(*) FROM products WHERE stock < 10`,
    alert: { threshold: 5, condition: '>' } // 低库存商品超过5个告警
  }
};
```

## 告警配置

### 1. 告警渠道集成
```yaml
# alertmanager.yml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'alerts@example.com'
  smtp_auth_username: 'your-email@gmail.com'
  smtp_auth_password: 'your-app-password'

route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'default-receiver'

receivers:
  - name: 'default-receiver'
    email_configs:
      - to: 'admin@example.com'
        send_resolved: true
    
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/your-webhook'
        channel: '#alerts'
        title: '{{ .GroupLabels.alertname }}'
        text: '{{ .CommonAnnotations.summary }}\n{{ .CommonAnnotations.description }}'
    
    webhook_configs:
      - url: 'http://your-app/api/alerts'
        send_resolved: true
```

## 监控检查清单

### 部署前检查
- [ ] 监控目标明确（要监控什么？）
- [ ] 监控工具选型完成
- [ ] 告警阈值设定合理
- [ ] 告警接收人配置完成
- [ ] 监控数据存储方案确定

### 日常监控
- [ ] 系统资源使用率正常
- [ ] 应用响应时间正常
- [ ] 错误率在可接受范围
- [ ] 业务指标趋势正常
- [ ] 日志无异常错误

### 告警处理
- [ ] 告警是否真实？
- [ ] 问题影响范围多大？
- [ ] 是否有已知解决方案？
- [ ] 是否需要升级处理？
- [ ] 处理后是否验证解决？

## 下一步行动

1. **确定监控需求**：明确要监控的指标和告警阈值
2. **选择监控工具**：根据需求选择合适的监控方案
3. **部署监控系统**：安装配置监控工具
4. **集成应用监控**：在代码中添加监控点
5. **配置告警规则**：设置合理的告警阈值和渠道
6. **建立响应流程**：制定告警处理流程
7. **定期优化调整**：根据实际运行情况优化监控配置

---

**提示**：监控不是一次性的工作，而是持续的过程。随着业务发展，监控需求也会变化。建议从核心指标开始，逐步完善监控体系，避免一开始就过度设计。