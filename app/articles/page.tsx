import { articles } from "@/lib/catalog";

export const metadata = {
  title: "科普中心 | 瑾颐健康",
};

export default function ArticlesPage() {
  return (
    <main className="page-shell">
      <section className="page-hero">
        <span className="pill">Knowledge Center</span>
        <h1>科普中心</h1>
        <p>
          用更温和、清楚、合规的内容解释医研护肤产品，帮助用户在购买前建立正确预期。
        </p>
      </section>

      <section className="knowledge-layout">
        <div className="featured-article">
          <span>编辑推荐</span>
          <h2>医研护肤不是医疗承诺，而是更重视资料透明和护理边界。</h2>
          <p>
            内容中心后续可发布成分科普、使用说明、检测报告解读、售后政策和购买前 FAQ。
          </p>
        </div>
        <div className="article-list">
          {articles.map((article, index) => (
            <article className="article-row" key={article.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="policy-card">
        <span className="pill">Content Rule</span>
        <h2>内容发布提醒</h2>
        <p>
          科普内容应区分产品介绍、护理建议和医学信息，不使用未经验证的医疗效果承诺。
          对于需要资质支撑的表述，应在后台绑定来源文件或检测报告。
        </p>
      </section>
    </main>
  );
}
