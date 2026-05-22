import Link from "next/link";
import { ProductArt } from "@/components/site-chrome";
import { articles, products } from "@/lib/catalog";

const promises = [
  ["资料透明", "备案、批次、检测报告按商品沉淀"],
  ["自营把控", "从选品、客服到售后统一管理"],
  ["国内支付", "预留微信支付与订单回调链路"],
];

const routines = [
  "温和清洁",
  "屏障修护",
  "精华叠加",
  "日间防护",
];

const serviceCards = [
  ["01", "购买前咨询", "高阶护理产品支持客服确认肤质、使用场景与储运要求。"],
  ["02", "资料随单留存", "订单页后续可展示对应批次、检测报告和备案信息。"],
  ["03", "售后边界清晰", "提前说明适用人群、注意事项、储存方式和售后政策。"],
];

export default function Home() {
  const heroProduct = products[0];

  return (
    <main>
      <section className="hero site-shell">
        <div className="hero-copy">
          <span className="pill">医研护肤自营商城</span>
          <h1>把专业护理产品，做成用户看得懂、敢下单的网站。</h1>
          <p>
            瑾颐健康医研护肤商城第一版，围绕产品展示、资料透明、微信支付流程和后台运营雏形重构，
            更适合后续放到阿里云上线。
          </p>
          <div className="action-row">
            <Link className="button primary" href="/products">
              浏览产品
            </Link>
            <Link className="button ghost" href="/articles">
              查看科普
            </Link>
          </div>
          <div className="promise-row">
            {promises.map(([title, text]) => (
              <div key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-showcase">
          <div className="showcase-card">
            <div className="showcase-top">
              <span>Featured</span>
              <strong>¥{heroProduct.price}</strong>
            </div>
            <ProductArt label={heroProduct.category} />
            <h2>{heroProduct.name}</h2>
            <p>{heroProduct.subtitle}</p>
            <Link className="button primary full" href={`/products/${heroProduct.slug}`}>
              查看详情
            </Link>
          </div>
          <div className="floating-note">
            <span>合规提示</span>
            <strong>不做医疗功效承诺</strong>
            <p>以功效护肤、护理场景、资料展示和客服咨询作为页面表达重点。</p>
          </div>
        </div>
      </section>

      <section className="site-shell section">
        <div className="section-title centered">
          <span className="pill">Brand System</span>
          <h2>第一版先建立品牌信任感</h2>
          <p>医研护肤类商品不能只放价格，更要让用户清楚看到产品边界、资料和服务流程。</p>
        </div>
        <div className="brand-grid">
          {promises.map(([title, text]) => (
            <article className="soft-card" key={title}>
              <span className="card-icon">✦</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-shell section split-section">
        <div className="section-title">
          <span className="pill">Products</span>
          <h2>精选医研护肤产品</h2>
          <p>用更接近真实商城的卡片展示商品卖点、规格和价格，后续可以替换成后台接口数据。</p>
          <Link className="text-link" href="/products">
            进入产品中心 →
          </Link>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <Link className="product-card" href={`/products/${product.slug}`} key={product.slug}>
              <ProductArt label={product.category} />
              <div>
                <span>{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.summary}</p>
                <strong>¥{product.price}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="routine-section">
        <div className="site-shell routine-grid">
          <div>
            <span className="pill light">Daily Routine</span>
            <h2>把产品放进清晰的护理流程里</h2>
          </div>
          <ol>
            {routines.map((routine, index) => (
              <li key={routine}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {routine}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-shell section">
        <div className="section-title centered">
          <span className="pill">Service</span>
          <h2>下单前后都有清楚说明</h2>
        </div>
        <div className="service-grid">
          {serviceCards.map(([number, title, text]) => (
            <article className="service-card" key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="site-shell section split-section">
        <div className="section-title">
          <span className="pill">Knowledge</span>
          <h2>科普内容增强转化</h2>
          <p>用户对医研护肤和外泌体成分方向会有疑问，科普中心可以承接搜索和客服前置答疑。</p>
        </div>
        <div className="article-grid">
          {articles.map((article) => (
            <article className="article-card" key={article.title}>
              <span>待发布</span>
              <h3>{article.title}</h3>
              <p>{article.excerpt}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
