import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductArt } from "@/components/site-chrome";
import { products } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  return {
    title: product ? `${product.name} | 瑾颐健康` : "商品详情 | 瑾颐健康",
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="page-shell">
      <Link className="crumb-link" href="/products">
        ← 返回产品中心
      </Link>

      <section className="product-detail">
        <div className="detail-gallery">
          <ProductArt label={product.category} />
          <div className="gallery-strip">
            <span>备案资料</span>
            <span>检测报告</span>
            <span>批次追溯</span>
          </div>
        </div>

        <div className="detail-copy">
          <span className="pill">{product.category}</span>
          <h1>{product.name}</h1>
          <p>{product.subtitle}</p>
          <div className="meta-row detail-price">
            <strong>¥{product.price}</strong>
            <small>{product.unit}</small>
          </div>
          <div className="tag-list">
            {product.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="action-row">
            <Link className="button primary" href="/checkout">
              立即购买
            </Link>
            <Link className="button ghost" href="/checkout">
              加入购物车
            </Link>
          </div>
          <div className="notice-card">
            请在购买前确认商品属性、使用说明和相关资料。页面示例不构成医疗建议或功效承诺。
          </div>
        </div>
      </section>

      <section className="detail-panel-grid">
        <article>
          <span>01</span>
          <h2>商品说明</h2>
          <ul>
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </article>
        <article>
          <span>02</span>
          <h2>使用方式</h2>
          <p>{product.usage}</p>
        </article>
        <article>
          <span>03</span>
          <h2>储存与配送</h2>
          <p>{product.storage}</p>
        </article>
        <article>
          <span>04</span>
          <h2>合规资料</h2>
          <ul>
            {product.compliance.map((item) => (
              <li key={item}>{item}：待后台上传后展示</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
