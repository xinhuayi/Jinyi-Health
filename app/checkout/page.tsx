import Link from "next/link";
import { products } from "@/lib/catalog";

export const metadata = {
  title: "确认订单 | 瑾颐健康",
};

const checkoutSteps = [
  {
    title: "确认商品",
    text: "展示商品、规格、数量、价格、库存和是否需要客服确认。",
  },
  {
    title: "填写地址",
    text: "支持国内收货地址、手机号、发票信息和配送备注。",
  },
  {
    title: "微信支付",
    text: "后续对接微信支付 V3，生成预支付订单并处理支付回调。",
  },
  {
    title: "订单履约",
    text: "后台确认付款、发货、物流单号和售后状态。",
  },
];

export default function CheckoutPage() {
  const cartProduct = products[0];

  return (
    <main className="page-shell">
      <Link className="back-link" href="/">
        ← 返回首页
      </Link>
      <section className="page-hero">
        <p className="eyebrow">Checkout</p>
        <h1>确认订单与微信支付流程</h1>
        <p>
          当前页面是可视化流程占位，方便后续接入真实购物车、地址服务、订单 API 和微信支付商户号。
        </p>
      </section>

      <section className="checkout-layout">
        <div className="checkout-panel">
          <h2>订单预览</h2>
          <div className="order-item">
            <div>
              <strong>{cartProduct.name}</strong>
              <p>{cartProduct.unit}</p>
            </div>
            <span>¥{cartProduct.price}</span>
          </div>
          <div className="order-total">
            <span>应付金额</span>
            <strong>¥{cartProduct.price}</strong>
          </div>
          <button className="button primary full" type="button">
            微信支付占位按钮
          </button>
          <p className="compliance-note">
            接入时需要配置微信支付商户号、API v3 密钥、证书序列号、回调地址和订单状态同步。
          </p>
        </div>

        <div className="checkout-steps">
          {checkoutSteps.map((step, index) => (
            <article key={step.title}>
              <span>{index + 1}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
