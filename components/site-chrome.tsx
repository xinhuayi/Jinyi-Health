import Link from "next/link";

const navItems = [
  ["产品", "/products"],
  ["科普", "/articles"],
  ["下单", "/checkout"],
  ["后台", "/admin"],
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="brand" href="/" aria-label="瑾颐健康首页">
          <span className="brand-mark">JY</span>
          <span>
            <strong>瑾颐健康</strong>
            <small>Medical Skincare</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="主导航">
          {navItems.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>

        <Link className="header-cta" href="/products">
          选购产品
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-grid">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark">JY</span>
            <span>
              <strong>瑾颐健康</strong>
              <small>医研护肤自营商城</small>
            </span>
          </Link>
          <p>
            面向国内用户的医研护肤产品展示与下单网站，后续可接入微信支付、阿里云 RDS 与 OSS。
          </p>
        </div>
        <div>
          <h3>商城</h3>
          <Link href="/products">产品中心</Link>
          <Link href="/checkout">确认订单</Link>
          <Link href="/admin">运营后台</Link>
        </div>
        <div>
          <h3>内容</h3>
          <Link href="/articles">科普中心</Link>
          <span>化妆品备案资料待上传</span>
          <span>检测报告待上传</span>
        </div>
      </div>
      <div className="site-shell footer-bottom">
        <span>© 2026 瑾颐健康</span>
        <span>提示：页面内容不构成医疗建议或功效承诺。</span>
      </div>
    </footer>
  );
}

export function ProductArt({ label }: { label: string }) {
  return (
    <div className="product-art" aria-label={label}>
      <div className="halo" />
      <div className="serum-bottle">
        <span className="cap" />
        <span className="bottle-label">JINYI</span>
      </div>
      <div className="cream-jar">
        <span />
      </div>
      <em>{label}</em>
    </div>
  );
}
