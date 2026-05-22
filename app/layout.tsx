import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "瑾颐健康 | 外泌体相关产品商城",
  description:
    "面向国内用户的瑾颐健康自营商城，展示外泌体相关护理产品、产品资料与下单流程。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
