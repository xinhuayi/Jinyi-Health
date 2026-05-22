# Jinyi Health Commerce

瑾颐健康自营电商网站第一版，定位为面向国内用户的医研护肤 / 功效护理产品展示与下单网站，当前商品方向包含外泌体成分相关护理产品。

当前版本已经搭建：

- Next.js + TypeScript 前端工程
- 首页品牌展示
- 产品中心与商品详情页
- 科普中心
- 确认订单与微信支付流程占位页
- 运营后台信息架构页
- 合规资料、检测报告、批次管理等后续扩展入口

> 注意：“医妆”不是国内正式监管分类。页面示例文案以功效护肤、护理场景、科普和资料展示为定位，不构成医疗建议或功效承诺。正式上线前应根据商品真实法律属性补齐化妆品备案、检测报告、生产资质、用户协议、隐私政策和售后政策。

## 技术栈

- Next.js
- React
- TypeScript
- ESLint
- CSS Modules/global CSS style approach

## 本地开发

```bash
npm install
npm run dev
```

访问：

```text
http://localhost:3000
```

## 常用命令

```bash
npm run dev      # 本地开发
npm run build    # 生产构建
npm run start    # 启动生产服务
npm run lint     # 代码检查
```

## 页面结构

```text
/
/products
/products/[slug]
/articles
/checkout
/admin
```

## 后续接入建议

### 1. 数据库

建议正式版本增加：

- users 用户表
- products 商品表
- product_batches 商品批次表
- test_reports 检测报告表
- cosmetic_filings 化妆品备案资料表
- carts 购物车表
- orders 订单表
- order_items 订单商品表
- payments 支付记录表
- shipments 发货表
- after_sales 售后表
- articles 科普文章表

### 2. 微信支付

需要准备：

- 微信支付商户号
- AppID
- API v3 密钥
- 商户证书序列号
- 支付回调地址
- 退款回调地址

建议后端流程：

```text
前端提交订单
-> 后端创建订单
-> 后端调用微信支付 V3 下单接口
-> 前端拉起微信支付
-> 微信支付回调后端
-> 后端校验签名并更新订单状态
```

### 3. 阿里云部署

可选方案：

#### 方案 A：ECS + Node.js

1. 购买阿里云 ECS。
2. 安装 Node.js 22+、Nginx、PM2。
3. 上传代码并执行：

   ```bash
   npm ci
   npm run build
   npm run start
   ```

4. 使用 Nginx 反向代理到 Next.js 服务端口。
5. 配置域名解析、HTTPS 证书和 ICP 备案。

#### 方案 B：Docker + ECS

后续可以补充 Dockerfile，将 Next.js 服务打包后部署到 ECS 或容器服务。

#### 方案 C：前后端分离

如果之后后台和支付逻辑变复杂，建议：

- 前端：Next.js 部署到 ECS / 容器服务
- 后端：NestJS / Spring Boot
- 数据库：阿里云 RDS MySQL
- 缓存：阿里云 Redis
- 文件：阿里云 OSS

## 环境变量规划

正式接入时建议新增 `.env.local`：

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
WECHAT_PAY_APP_ID=
WECHAT_PAY_MCH_ID=
WECHAT_PAY_API_V3_KEY=
WECHAT_PAY_CERT_SERIAL_NO=
WECHAT_PAY_NOTIFY_URL=
DATABASE_URL=
OSS_BUCKET=
OSS_REGION=
```

## 医研护肤 / 医妆方向合规提醒

正式上线前建议完成：

- 明确每个 SKU 的真实监管属性：普通化妆品、特殊化妆品、医疗器械、消字号产品或普通商品。
- 如果属于化妆品，补齐化妆品备案编号、全成分、执行标准、生产企业信息和标签说明。
- 对外文案避免使用“治疗、修复疾病、医学逆龄、细胞治疗、保证见效、替代药物”等表达。
- 商品详情页展示检测报告、批次资料、储运说明、适用人群、注意事项和售后边界。
- 后台增加文案审核和资料上传流程，避免未审核内容直接发布。
