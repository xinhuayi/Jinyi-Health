import Link from "next/link";
import { categories, products } from "@/lib/catalog";

export const metadata = {
  title: "产品中心 | 瑾颐健康",
};

export default function ProductsPage() {
  return (
    <main className="page-shell">
      <Link className="back-link" href="/">
        ← 返回首页
      </Link>
      <section className="page-hero">
        <p className="eyebrow">Product Center</p>
        <h1>产品中心</h1>
        <p>
          第一版商品数据采用静态配置，重点完成产品展示、资料说明和详情页结构，后续可接入后台商品管理。
        </p>
      </section>

      <div className="category-row">
        {categories.map((category) => (
          <span key={category}>{category}</span>
        ))}
      </div>

      <section className="listing-grid">
        {products.map((product) => (
          <article className="listing-card" key={product.slug}>
            <div className="product-visual">
              <span>{product.category}</span>
            </div>
            <div className="listing-content">
              <p className="tag-row">{product.tags.join(" / ")}</p>
              <h2>{product.name}</h2>
              <p>{product.summary}</p>
              <div className="price-row">
                <span>¥{product.price}</span>
                <small>{product.unit}</small>
              </div>
              <Link className="button primary" href={`/products/${product.slug}`}>
                查看商品详情
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
