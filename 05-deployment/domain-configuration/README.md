# 域名配置 (Domain Configuration)

## 模块目标
正确配置域名、DNS和SSL证书，确保网站可访问且安全。

## 核心原则
1. **简单易记**：选择简短、易拼写的域名
2. **安全优先**：强制使用HTTPS
3. **性能优化**：合理配置DNS和CDN
4. **备份恢复**：确保域名配置可恢复

## 域名选择与注册

### 1. 域名命名策略
```javascript
// 好的域名特征
- 简短：最好在10个字符以内
- 易拼写：避免使用数字、连字符、生僻词
- 易记忆：与品牌或产品相关
- 合适的后缀：.com优先，其次.cn/.net/.io等

// 域名生成工具思路
function generateDomainNames(keywords) {
  const suffixes = ['.com', '.cn', '.net', '.io', '.dev'];
  const results = [];
  
  keywords.forEach(keyword => {
    suffixes.forEach(suffix => {
      results.push(`${keyword}${suffix}`);
    });
  });
  
  return results;
}

// 示例
const keywords = ['tech', 'code', 'dev', 'app'];
console.log(generateDomainNames(keywords));
// ['tech.com', 'tech.cn', 'tech.net', 'tech.io', 'tech.dev', ...]
```

### 2. 域名注册商选择
| 注册商 | 特点 | 适合人群 | 价格范围 |
|--------|------|----------|----------|
| **阿里云** | 国内备案方便、中文支持 | 国内项目、需要备案 | ¥30-100/年 |
| **腾讯云** | 微信生态集成、学生优惠 | 小程序、微信相关 | ¥30-100/年 |
| **Namecheap** | 价格便宜、隐私保护免费 | 国际项目、个人用户 | $10-15/年 |
| **GoDaddy** | 全球最大、促销活动多 | 企业用户、需要多种服务 | $15-20/年 |
| **Google Domains** | 简洁易用、集成Google服务 | Google生态用户 | $12-20/年 |

### 3. 域名注册流程
```bash
# 1. 查询域名可用性
# 使用whois命令或注册商网站查询
whois example.com

# 2. 注册域名（以阿里云为例）
# - 登录阿里云控制台
# - 搜索想要的域名
# - 加入购物车并结算
# - 填写注册信息（实名认证）

# 3. 重要设置
# - 开启隐私保护（避免个人信息泄露）
# - 设置自动续费（避免域名过期）
# - 添加多个联系人邮箱（接收重要通知）
```

## DNS配置

### 1. DNS记录类型
| 记录类型 | 用途 | 示例 |
|----------|------|------|
| **A记录** | 将域名指向IPv4地址 | example.com → 192.0.2.1 |
| **AAAA记录** | 将域名指向IPv6地址 | example.com → 2001:db8::1 |
| **CNAME记录** | 域名别名，指向另一个域名 | www → example.com |
| **MX记录** | 邮件服务器记录 | @ → mail.example.com |
| **TXT记录** | 文本记录，用于验证、SPF等 | @ → "v=spf1 include:_spf.google.com ~all" |
| **NS记录** | 指定域名服务器 | @ → ns1.example-dns.com |

### 2. 基础DNS配置示例
```
域名: example.com

记录类型    主机记录    记录值                TTL
A          @          192.0.2.1            600
A          www        192.0.2.1            600
CNAME      blog       username.github.io   600
MX         @          mail.example.com     3600
TXT        @          "v=spf1 include:_spf.google.com ~all" 3600
```

### 3. 云服务商DNS配置

#### Cloudflare DNS配置
```bash
# Cloudflare优势
# - 免费CDN和DDoS防护
# - 免费SSL证书
# - 全球Anycast网络
# - 页面规则和防火墙

# 配置步骤
1. 在Cloudflare添加站点
2. 修改域名DNS服务器为Cloudflare提供的NS
3. 等待DNS传播（通常几分钟到几小时）
4. 配置SSL/TLS为"Full"模式
5. 开启Always Use HTTPS
```

#### 阿里云DNS配置
```bash
# 阿里云DNS优势
# - 国内解析速度快
# - 支持备案
# - 与阿里云其他服务集成

# 配置步骤
1. 登录阿里云控制台 -> 云解析DNS
2. 添加域名
3. 添加解析记录
4. 设置解析线路（默认、电信、联通、移动等）
```

### 4. 高级DNS配置

#### 负载均衡配置
```
# 多个A记录实现简单负载均衡
记录类型    主机记录    记录值                TTL    权重
A          @          192.0.2.1            600     50
A          @          192.0.2.2            600     50

# 地理定位解析
记录类型    主机记录    记录值                TTL    线路
A          @          192.0.2.1            600     默认
A          @          192.0.2.3            600     中国-电信
A          @          192.0.2.4            600     中国-联通
A          @          192.0.2.5            600     海外
```

#### 子域名配置
```
# 常见子域名配置
记录类型    主机记录    记录值                用途
A          api        192.0.2.10            API服务
A          admin      192.0.2.11            管理后台
CNAME      www        example.com           主站
CNAME      blog       ghost.example.com     博客
CNAME      shop       shopify.com           电商
CNAME      mail       gmail.com             企业邮箱
A          test       192.0.2.20            测试环境
```

## SSL证书配置

### 1. SSL证书类型
| 证书类型 | 验证级别 | 颁发时间 | 价格 | 适合场景 |
|----------|----------|----------|------|----------|
| **DV证书** | 域名验证 | 几分钟 | 免费 | 个人网站、博客 |
| **OV证书** | 组织验证 | 1-3天 | $50-200/年 | 企业官网 |
| **EV证书** | 扩展验证 | 1-7天 | $200-1000/年 | 银行、电商 |

### 2. 免费SSL证书获取

#### Let's Encrypt (Certbot)
```bash
# 安装Certbot
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# 为Nginx获取证书
sudo certbot --nginx -d example.com -d www.example.com

# 自动续期测试
sudo certbot renew --dry-run

# 设置自动续期（crontab）
# 每月1号和15号凌晨3点检查续期
0 3 1,15 * * certbot renew --quiet
```

#### 云服务商免费证书
```bash
# 阿里云免费证书
1. 登录SSL证书控制台
2. 购买免费证书（DV单域名）
3. 提交申请，验证域名所有权
4. 下载证书文件（Nginx格式）
5. 配置到服务器

# 腾讯云免费证书
1. SSL证书管理 -> 申请免费证书
2. 填写域名信息
3. 自动DNS验证或文件验证
4. 下载证书并配置
```

### 3. Nginx SSL配置
```nginx
# /etc/nginx/sites-available/example.com
server {
    listen 80;
    server_name example.com www.example.com;
    
    # 重定向HTTP到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL证书路径
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    
    # SSL优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # HSTS（强制HTTPS）
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 其他安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 网站根目录
    root /var/www/example.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 4. 证书自动续期脚本
```bash
#!/bin/bash
# renew-ssl.sh

DOMAINS=("example.com" "www.example.com")
EMAIL="admin@example.com"
WEBROOT="/var/www/html"

for DOMAIN in "${DOMAINS[@]}"; do
    echo "为 $DOMAIN 续期SSL证书..."
    
    certbot certonly \
        --webroot \
        --webroot-path $WEBROOT \
        --domain $DOMAIN \
        --email $EMAIL \
        --agree-tos \
        --non-interactive \
        --force-renewal
    
    if [ $? -eq 0 ]; then
        echo "$DOMAIN 证书续期成功"
        
        # 重启Nginx使新证书生效
        systemctl reload nginx
        
        # 发送成功通知
        echo "SSL证书已成功续期: $DOMAIN" | mail -s "SSL证书续期成功" $EMAIL
    else
        echo "$DOMAIN 证书续期失败"
        echo "SSL证书续期失败: $DOMAIN" | mail -s "SSL证书续期失败" $EMAIL
    fi
done
```

## CDN配置

### 1. CDN服务商选择
| CDN服务商 | 免费额度 | 特点 | 适合场景 |
|-----------|---------|------|----------|
| **Cloudflare** | 无限 | 全球节点、安全功能、免费SSL | 所有网站 |
| **腾讯云CDN** | 10GB/月 | 国内加速、微信生态集成 | 国内用户为主 |
| **阿里云CDN** | 20GB/月 | 国内节点多、与阿里云集成 | 电商、视频网站 |
| **jsDelivr** | 无限 | 开源项目免费、GitHub集成 | 开源项目、静态资源 |

### 2. Cloudflare CDN配置
```bash
# Cloudflare配置步骤
1. 添加站点到Cloudflare
2. 修改DNS服务器
3. 等待DNS传播
4. 配置SSL/TLS
5. 开启Always Use HTTPS
6. 配置页面规则（如缓存静态资源）
7. 开启防火墙规则（防攻击）

# 性能优化设置
- 开启Brotli压缩
- 开启Rocket Loader（JS优化）
- 开启Mirage（图片优化）
- 开启Polish（图片压缩）
```

### 3. 静态资源CDN配置
```html
<!-- 使用jsDelivr加速开源库 -->
<script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">

<!-- 使用unpkg -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
```

## 邮箱配置

### 1. 企业邮箱服务
| 服务商 | 免费额度 | 特点 | 适合场景 |
|--------|---------|------|----------|
| **腾讯企业邮** | 免费版 | 与微信集成、简单易用 | 初创公司、小团队 |
| **阿里企业邮** | 免费版 | 与阿里云集成、功能全面 | 电商、国内企业 |
| **Google Workspace** | $6/用户/月 | 功能强大、国际通用 | 国际业务、科技公司 |
| **Zoho Mail** | 免费版 | 价格便宜、功能齐全 | 个人、小企业 |

### 2. 配置企业邮箱
```bash
# 以腾讯企业邮为例
1. 注册腾讯企业邮
2. 验证域名所有权（添加TXT记录）
3. 配置MX记录指向腾讯邮件服务器
4. 添加用户邮箱账号
5. 配置客户端（Outlook、手机邮件等）

# 需要添加的DNS记录
记录类型    主机记录    记录值
TXT         @          "v=spf1 include:spf.mail.qq.com ~all"
MX          @          mxbiz1.qq.com (优先级5)
MX          @          mxbiz2.qq.com (优先级10)
TXT         _dmarc     "v=DMARC1; p=none; rua=mailto:admin@example.com"
```

## 域名备案（国内必需）

### 1. 备案流程
```bash
# 备案前提条件
1. 使用国内服务器（阿里云、腾讯云等）
2. 域名已完成实名认证
3. 准备备案材料（身份证、营业执照等）

# 备案步骤（以阿里云为例）
1. 登录阿里云备案系统
2. 填写备案信息
3. 上传备案材料
4. 阿里云初审（1-2个工作日）
5. 管局审核（7-20个工作日）
6. 备案成功，获取备案号

# 备案后要求
- 在网站底部添加备案号链接
- 备案信息变更需及时更新
- 每年进行备案信息核查
```

### 2. 备案号添加
```html
<!-- 网站底部添加备案号 -->
<footer>
  <p>© 2023 公司名称. 保留所有权利.</p>
  <p>
    <a href="https://beian.miit.gov.cn/" target="_blank">
      京ICP备12345678号-1
    </a>
  </p>
  <!-- 公安备案号（如有） -->
  <p>
    <a href="http://www.beian.gov.cn/" target="_blank">
      京公网安备 11010502012345号
    </a>
  </p>
</footer>
```

## 域名管理最佳实践

### 1. 安全措施
```bash
# 域名安全清单
- [ ] 开启域名锁定（防止未经授权转移）
- [ ] 开启隐私保护（隐藏注册信息）
- [ ] 使用强密码和双因素认证
- [ ] 定期检查域名联系人信息
- [ ] 监控域名到期时间
- [ ] 备份DNS配置

# 紧急情况处理
1. 域名被盗：立即联系注册商冻结
2. DNS被篡改：恢复备份配置
3. SSL证书过期：紧急续期或使用备用证书
4. 域名到期：尽快续费（有30天宽限期）
```

### 2. 备份与恢复
```bash
# 备份DNS配置脚本
#!/bin/bash
# backup-dns.sh

DOMAIN="example.com"
BACKUP_DIR="/backups/dns"
DATE=$(date +%Y%m%d_%H%M%S)

# 导出DNS配置（Cloudflare API示例）
curl -X GET "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  > "${BACKUP_DIR}/dns_${DOMAIN}_${DATE}.json"

# 保留最近30天备份
find "${BACKUP_DIR}" -name "dns_${DOMAIN}_*.json" -mtime +30 -delete

echo "DNS配置备份完成: ${BACKUP_DIR}/dns_${DOMAIN}_${DATE}.json"
```

### 3. 监控与告警
```bash
# 域名监控脚本
#!/bin/bash
# monitor-domain.sh

DOMAINS=("example.com" "www.example.com")
EMAIL="admin@example.com"

for DOMAIN in "${DOMAINS[@]}"; do
  # 检查域名解析
  if ! dig $DOMAIN +short | grep -q '[0-9]'; then
    echo "域名解析失败: $DOMAIN" | mail -s "域名监控告警" $EMAIL
  fi
  
  # 检查SSL证书过期时间
  EXPIRY_DATE=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | \
                openssl x509 -noout -dates | grep 'notAfter' | cut -d'=' -f2)
  
  DAYS_LEFT=$(( ($(date -d "$EXPIRY_DATE" +%s) - $(date +%s)) / 86400 ))
  
  if [ $DAYS_LEFT -lt 30 ]; then
    echo "SSL证书即将过期: $DOMAIN (剩余 $DAYS_LEFT 天)" | mail -s "SSL证书告警" $EMAIL
  fi
done
```

## 配置检查清单

### 部署前检查
- [ ] 域名已注册并实名认证
- [ ] DNS记录已正确配置
- [ ] SSL证书已获取并配置
- [ ] 备案已完成（国内服务器）
- [ ] 企业邮箱已配置（如需）

### 部署后验证
- [ ] 域名可以正常访问
- [ ] HTTPS强制启用
- [ ] SSL证书有效且安全
- [ ] 所有子域名正常工作
- [ ] 邮件可以正常收发

### 定期维护
- [ ] 域名即将到期（提前续费）
- [ ] SSL证书即将到期（自动续期）
- [ ] DNS配置备份
- [ ] 安全扫描（无漏洞）
- [ ] 性能监控（CDN效果）

## 下一步行动

1. **注册域名**：选择并注册合适的域名
2. **配置DNS**：设置A记录、CNAME等
3. **获取SSL证书**：配置HTTPS
4. **设置CDN**：加速网站访问
5. **配置邮箱**：设置企业邮箱
6. **完成备案**：国内服务器必需
7. **监控维护**：设置自动监控和备份

---

**提示**：域名配置是网站的基础设施，一旦设置好通常不需要频繁修改。但需要定期检查维护，特别是SSL证书续期和域名续费，避免因过期导致网站不可访问。