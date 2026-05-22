export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  unit: string;
  category: string;
  tags: string[];
  storage: string;
  usage: string;
  summary: string;
  details: string[];
  compliance: string[];
};

export const products: Product[] = [
  {
    slug: "exo-repair-serum",
    name: "外泌体医研修护精华",
    subtitle: "适合屏障护理场景咨询后使用",
    price: 699,
    unit: "30ml / 瓶",
    category: "功效护肤",
    tags: ["屏障护理", "敏感肌友好", "化妆品备案待上传"],
    storage: "建议阴凉避光保存，开封后按包装说明使用。",
    usage: "洁面后取适量涂抹于面部，初次使用建议先做局部测试。",
    summary:
      "以皮肤日常护理和屏障护理场景为主，页面预留批次、检测报告、成分说明和客服咨询入口。",
    details: [
      "支持展示成分说明、适用人群、使用步骤与注意事项。",
      "支持按批次绑定检测报告，便于用户购买前查看资料。",
      "不承诺治疗、替代药品、替代医疗器械或保证性效果。",
    ],
    compliance: ["化妆品备案信息", "第三方检测报告", "生产企业资质"],
  },
  {
    slug: "exo-freeze-dried-powder",
    name: "外泌体屏障护理冻干粉套组",
    subtitle: "高阶护理款，支持客服确认后下单",
    price: 1299,
    unit: "5 支 / 盒",
    category: "专业护理",
    tags: ["客服咨询", "储运提示", "批次管理"],
    storage: "按产品标签要求保存；如有特殊储运要求，订单确认时提示用户。",
    usage: "按产品说明进行使用；如用于专业护理场景，建议先咨询客服。",
    summary:
      "面向更高客单价和更强咨询需求的医研护肤商品，重点展示资料完整性、配送说明和售后边界。",
    details: [
      "结算页预留客服确认环节，便于核对收货地址和储存要求。",
      "后台可扩展批次、库存、有效期和报告文件管理。",
      "详情页默认突出风险提示和使用说明。",
    ],
    compliance: ["批次检测报告", "储运说明", "售后政策"],
  },
  {
    slug: "exo-science-kit",
    name: "医研护肤科普体验套装",
    subtitle: "用于品牌科普和用户入门体验",
    price: 299,
    unit: "1 套",
    category: "科普体验",
    tags: ["入门套装", "科普资料", "客服指导"],
    storage: "常温避光保存，具体以包装说明为准。",
    usage: "按随盒说明了解医研护肤、外泌体成分方向和基础护理流程。",
    summary:
      "适合第一阶段获客和教育用户，降低用户理解门槛，帮助建立品牌信任。",
    details: [
      "包含科普手册、基础护理用品和客服咨询引导。",
      "适合在首页作为低门槛主推商品。",
      "可与文章内容联动，提升 SEO 和转化。",
    ],
    compliance: ["商品说明书", "客服话术规范", "隐私政策"],
  },
];

export const categories = Array.from(
  new Set(products.map((product) => product.category)),
);

export const articles = [
  {
    title: "医研护肤产品购买前需要了解什么？",
    excerpt:
      "从产品属性、备案资料、检测报告、储运要求和使用边界五个方面帮助用户建立正确预期。",
  },
  {
    title: "如何查看商品批次与检测报告？",
    excerpt:
      "商城将支持每个商品绑定批次资料，用户可以在详情页和订单页查看对应文件。",
  },
  {
    title: "护理类产品的宣传边界说明",
    excerpt:
      "页面文案避免医疗功效承诺，强调功效护肤、护理场景、注意事项和客服咨询。",
  },
];
