import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your business performance, visitor statistics, and active queues.",
};

export default function DashboardSubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
