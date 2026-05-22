import Link from "next/link";
import { articles, products } from "@/lib/catalog";

const processSteps = [
  "浏览商品与资料",
  "加入购物车",
  "填写地址",
  "微信支付",
  "订单发货",
];

const adminModules = [
  "商品与库存",
  "订单与发货",
  "用户与地址",
  "资质与报告",
  "文章与科普",
  "微信支付记录",
];

export default function Home() {
  const featuredProduct = products[0];

  return (
    <main>
      <section className="hero section-shell">
        <nav className="topbar" aria-label="主导航">
          <Link className="brand" href="/">
            <span className="brand-mark">JY</span>
            <span>瑾颐健康</span>
          </Link>
          <div className="nav-links">
            <Link href="/products">产品中心</Link>
            <Link href="/articles">科普中心</Link>
            <Link href="/checkout">微信支付流程</Link>
            <Link href="/admin">运营后台</Link>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">医妆方向 · 单商家自营 · 面向国内用户 · 预留微信支付</p>
            <h1>医研护肤产品商城第一版</h1>
            <p className="hero-lead">
              为瑾颐健康搭建一个可继续扩展的自营电商网站：先完成医研护肤品牌展示、
              功效护理产品介绍、购物流程、合规资料入口和运营后台雏形，后续可接入微信支付商户号与阿里云部署。
            </p>
            <div className="hero-actions">
              <Link className="button primary" href="/products">
                查看产品
              </Link>
              <Link className="button secondary" href="/checkout">
                了解下单流程
              </Link>
            </div>
            <p className="compliance-note">
              提示：“医妆”不是国内正式监管分类，正式上线文案建议以功效护肤、护理场景和资料展示为主，不构成医疗建议或功效承诺。
            </p>
          </div>

          <aside className="hero-card">
            <p className="card-kicker">主推商品</p>
            <h2>{featuredProduct.name}</h2>
            <p>{featuredProduct.summary}</p>
            <div className="price-row">
              <span>¥{featuredProduct.price}</span>
              <small>{featuredProduct.unit}</small>
            </div>
            <Link className="button primary full" href={`/products/${featuredProduct.slug}`}>
              查看详情
            </Link>
          </aside>
        </div>
      </section>

      <section className="section-shell section">
        <div className="section-heading">
          <p className="eyebrow">MVP Scope</p>
          <h2>先把能卖货、能建立信任的链路跑通</h2>
          <p>
            第一版以自营商城为核心，不做多商家、分销、秒杀等复杂功能，先沉淀可上线的页面结构和数据模型。
          </p>
        </div>
        <div className="feature-grid">
          {[
            ["品牌首页", "展示品牌定位、主推商品、资料入口和客服引导。"],
            ["产品中心", "商品列表、详情页、价格、规格、注意事项和报告占位。"],
            ["下单流程", "购物车与微信支付流程页面，后续接入真实 API。"],
            ["用户中心", "订单、地址、售后和客服入口的信息架构。"],
            ["运营后台", "商品、订单、库存、资料、内容管理的后台雏形。"],
            ["合规基础", "隐私政策、用户协议、售后政策和宣传边界说明。"],
          ].map(([title, text]) => (
            <article className="feature-card" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell section split">
        <div>
          <p className="eyebrow">Products</p>
          <h2>商品展示</h2>
          <p>
            目前使用静态商品数据，便于快速上线原型；后续可替换为数据库和后台接口。
          </p>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <Link className="product-card" href={`/products/${product.slug}`} key={product.slug}>
              <span>{product.category}</span>
              <h3>{product.name}</h3>
              <p>{product.subtitle}</p>
              <strong>¥{product.price}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell section">
        <div className="section-heading">
          <p className="eyebrow">Order Flow</p>
          <h2>用户购买流程</h2>
        </div>
        <ol className="steps">
          {processSteps.map((step, index) => (
            <li key={step}>
              <span>{index + 1}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="section-shell section split">
        <div>
          <p className="eyebrow">Operations</p>
          <h2>后台管理模块</h2>
          <p>
            后台页面先作为信息架构展示，等接入账号体系和数据库后可以逐步变成真实管理台。
          </p>
        </div>
        <div className="module-list">
          {adminModules.map((module) => (
            <span key={module}>{module}</span>
          ))}
        </div>
      </section>

      <section className="section-shell section">
        <div className="section-heading">
          <p className="eyebrow">Content</p>
          <h2>科普内容入口</h2>
        </div>
        <div className="article-grid">
          {articles.map((article) => (
            <article className="article-card" key={article.title}>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="section-shell footer-inner">
          <span>© 2026 瑾颐健康</span>
          <span>ICP备案、微信支付商户号、隐私政策等待接入</span>
        </div>
      </footer>
    </main>
  );
}
