import Link from "next/link";

export const metadata = {
  title: "运营后台 | 瑾颐健康",
};

const dashboardCards = [
  ["今日订单", "0", "等待接入真实订单表"],
  ["待发货", "0", "支付成功后进入履约"],
  ["商品总数", "3", "来自静态商品配置"],
  ["资料待完善", "9", "备案、检测、批次文件"],
];

const managementModules = [
  {
    title: "商品管理",
    items: ["商品上下架", "价格与规格", "库存与批次", "详情页资料"],
  },
  {
    title: "订单管理",
    items: ["订单查询", "支付状态", "发货信息", "退款售后"],
  },
  {
    title: "合规资料",
    items: ["检测报告", "备案文件", "生产资质", "宣传文案审核"],
  },
  {
    title: "内容管理",
    items: ["科普文章", "首页模块", "客服 FAQ", "政策条款"],
  },
];

export default function AdminPage() {
  return (
    <main className="page-shell">
      <Link className="back-link" href="/">
        ← 返回首页
      </Link>
      <section className="page-hero">
        <p className="eyebrow">Admin Preview</p>
        <h1>运营后台雏形</h1>
        <p>
          这里先搭建后台信息架构，后续可接入管理员登录、数据库、文件上传和订单履约流程。
        </p>
      </section>

      <section className="dashboard-grid">
        {dashboardCards.map(([label, value, helper]) => (
          <article className="dashboard-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{helper}</p>
          </article>
        ))}
      </section>

      <section className="management-grid">
        {managementModules.map((module) => (
          <article className="management-card" key={module.title}>
            <h2>{module.title}</h2>
            <ul>
              {module.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
