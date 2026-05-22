export const metadata = {
  title: "运营后台 | 瑾颐健康",
};

const dashboardCards = [
  ["商品 API", "已完成", "公开查询 + 管理员增删改"],
  ["用户与地址", "已完成", "手机号登录 + 地址 CRUD"],
  ["购物车订单", "已完成", "购物车、创建订单、订单查询"],
  ["支付与资料", "已完成", "微信支付占位 + 备案资料上传"],
];

const managementModules = [
  ["商品管理", "GET/POST /api/products，GET/PATCH/DELETE /api/products/[id]"],
  ["用户登录", "POST /api/auth/phone-login，POST /api/auth/admin-login，GET /api/me"],
  ["地址管理", "GET/POST /api/addresses，PATCH/DELETE /api/addresses/[id]"],
  ["购物车", "GET/POST/DELETE /api/cart"],
  ["订单管理", "GET/POST /api/orders，GET /api/orders/[id]"],
  ["微信支付占位", "POST /api/payments/wechat"],
  ["资料上传", "GET/POST /api/admin/documents"],
  ["后台统计", "GET /api/admin/dashboard"],
];

export default function AdminPage() {
  return (
    <main className="admin-page">
      <section className="admin-sidebar">
        <span className="pill">Admin</span>
        <h1>运营后台</h1>
        <p>第一阶段后端已接入 SQLite、本地文件上传、登录 Cookie 和主要业务 API。</p>
        <div className="admin-credential">
          <span>默认管理员</span>
          <strong>18800000000</strong>
          <small>密码：admin123456</small>
        </div>
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
              <button type="button">API Ready</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
