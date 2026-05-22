import { ProductArt } from "@/components/site-chrome";
import { products } from "@/lib/catalog";

export const metadata = {
  title: "确认订单 | 瑾颐健康",
};

const checkoutSteps = [
  ["确认商品", "核对规格、数量、价格和咨询提示。"],
  ["填写地址", "预留手机号、收货地址、发票和配送备注。"],
  ["微信支付", "后续接入微信支付 V3 创建预支付订单。"],
  ["订单履约", "后台同步支付、发货、物流与售后状态。"],
];

export default function CheckoutPage() {
  const cartProduct = products[0];

  return (
    <main className="page-shell">
      <section className="page-hero compact">
        <span className="pill">Checkout Preview</span>
        <h1>确认订单</h1>
        <p>这是一版前端流程预览，后续接入真实购物车、订单接口和微信支付。</p>
      </section>

      <section className="checkout-grid">
        <div className="checkout-card">
          <h2>订单商品</h2>
          <div className="checkout-product">
            <ProductArt label={cartProduct.category} />
            <div>
              <strong>{cartProduct.name}</strong>
              <span>{cartProduct.unit}</span>
            </div>
          </div>
          <div className="order-lines">
            <p>
              <span>商品金额</span>
              <strong>¥{cartProduct.price}</strong>
            </p>
            <p>
              <span>配送费用</span>
              <strong>待确认</strong>
            </p>
            <p className="total">
              <span>应付金额</span>
              <strong>¥{cartProduct.price}</strong>
            </p>
          </div>
          <button className="button primary full" type="button">
            微信支付占位
          </button>
        </div>

        <div className="checkout-flow">
          {checkoutSteps.map(([title, text], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </article>
          ))}
          <div className="notice-card">
            接入微信支付时需要商户号、AppID、API v3 密钥、证书序列号和支付回调地址。
          </div>
        </div>
      </section>
    </main>
  );
}
