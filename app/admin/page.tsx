export const metadata = {
  title: "运营后台 | 瑾颐健康",
};

const dashboardCards = [
  ["今日订单", "0", "等待接入订单表"],
  ["待发货", "0", "支付成功后进入履约"],
  ["商品总数", "3", "来自静态商品配置"],
  ["资料待完善", "9", "备案、检测、批次文件"],
];

const managementModules = [
  ["商品管理", "商品上下架、价格规格、库存批次、详情页资料"],
  ["订单管理", "订单查询、支付状态、发货信息、退款售后"],
  ["合规资料", "检测报告、备案文件、生产资质、宣传文案审核"],
  ["内容管理", "科普文章、首页模块、客服 FAQ、政策条款"],
];

export default function AdminPage() {
  return (
    <main className="admin-page">
      <section className="admin-sidebar">
        <span className="pill">Admin</span>
        <h1>运营后台</h1>
        <p>当前是界面雏形，后续接入管理员登录、数据库、文件上传和订单履约。</p>
        <nav>
          {managementModules.map(([title]) => (
            <a href={`#${title}`} key={title}>
              {title}
            </a>
          ))}
        </nav>
      </section>

      <section className="admin-content">
        <div className="dashboard-grid">
          {dashboardCards.map(([label, value, helper]) => (
            <article className="dashboard-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{helper}</p>
            </article>
          ))}
        </div>

        <div className="management-grid">
          {managementModules.map(([title, text], index) => (
            <article className="management-card" id={title} key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{title}</h2>
              <p>{text}</p>
              <button type="button">待接入</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
