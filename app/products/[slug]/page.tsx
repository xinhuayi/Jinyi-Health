import Link from "next/link";
import { notFound } from "next/navigation";
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
      <Link className="back-link" href="/products">
        ← 返回产品中心
      </Link>
      <section className="detail-grid">
        <div className="detail-visual">
          <span>{product.category}</span>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">Product Detail</p>
          <h1>{product.name}</h1>
          <p className="detail-subtitle">{product.subtitle}</p>
          <div className="price-row">
            <span>¥{product.price}</span>
            <small>{product.unit}</small>
          </div>
          <div className="tag-list">
            {product.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="detail-actions">
            <Link className="button primary" href="/checkout">
              立即购买
            </Link>
            <Link className="button secondary" href="/checkout">
              加入购物车
            </Link>
          </div>
          <p className="compliance-note">
            请在购买前确认商品属性、使用说明和相关资料。如涉及专业护理场景，请先咨询客服或专业人员。
          </p>
        </div>
      </section>

      <section className="detail-sections">
        <article>
          <h2>商品说明</h2>
          <ul>
            {product.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </article>
        <article>
          <h2>使用方式</h2>
          <p>{product.usage}</p>
        </article>
        <article>
          <h2>储存与配送</h2>
          <p>{product.storage}</p>
        </article>
        <article>
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
