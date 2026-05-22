import Link from "next/link";
import { ProductArt } from "@/components/site-chrome";
import { categories, products } from "@/lib/catalog";

export const metadata = {
  title: "产品中心 | 瑾颐健康",
};

export default function ProductsPage() {
  return (
    <main className="page-shell">
      <section className="page-hero product-hero">
        <span className="pill">Product Collection</span>
        <h1>医研护肤产品中心</h1>
        <p>
          以自营精选为起点，突出规格、价格、资料完整度和购买前咨询，后续接入数据库后可直接变成真实商品列表。
        </p>
      </section>

      <div className="category-row">
        {categories.map((category) => (
          <span key={category}>{category}</span>
        ))}
      </div>

      <section className="catalog-grid">
        {products.map((product) => (
          <article className="catalog-card" key={product.slug}>
            <ProductArt label={product.category} />
            <div className="catalog-content">
              <span>{product.tags.slice(0, 2).join(" / ")}</span>
              <h2>{product.name}</h2>
              <p>{product.summary}</p>
              <div className="meta-row">
                <strong>¥{product.price}</strong>
                <small>{product.unit}</small>
              </div>
              <Link className="button primary" href={`/products/${product.slug}`}>
                查看详情
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
