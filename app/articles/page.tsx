import Link from "next/link";
import { articles } from "@/lib/catalog";

export const metadata = {
  title: "科普中心 | 瑾颐健康",
};

export default function ArticlesPage() {
  return (
    <main className="page-shell">
      <Link className="back-link" href="/">
        ← 返回首页
      </Link>
      <section className="page-hero">
        <p className="eyebrow">Knowledge Center</p>
        <h1>科普中心</h1>
        <p>
          外泌体相关产品需要更多解释和资料支持，科普内容可以承接搜索流量，也能降低购买前疑虑。
        </p>
      </section>

      <section className="article-list">
        {articles.map((article) => (
          <article className="article-row" key={article.title}>
            <span>待发布</span>
            <div>
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="policy-card">
        <h2>内容发布提醒</h2>
        <p>
          科普内容应区分产品介绍、护理建议和医学信息，不使用未经验证的医疗效果承诺。
          对于需要资质支撑的表述，应在后台绑定来源文件或检测报告。
        </p>
      </section>
    </main>
  );
}
