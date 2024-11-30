import type { Metadata } from "next";
import "./globals.css";


import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import ReactQueryProvider from "@/component/globals/global-config";

export const metadata: Metadata = {
  title: "GetGoo",
  description:
    "GetGoo là một ứng dụng áp dụng công nghệ trí tuệ nhân tạo (AI) được thiết kế để giúp các doanh nghiệp du lịch quản lý và phát triển kinh doanh hiệu quả. Với GetGoo, các doanh nghiệp du lịch có thể tạo ra các tour du lịch mẫu, lập kế hoạch tour, tạo hóa đơn và quản lý các hoạt động kinh doanh một cách dễ dàng và chính xác.",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"m-0 p-0"}>
        <NextTopLoader
          zIndex={2500}
          height={3}
          color="#2299DD"
          template='<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        />
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
