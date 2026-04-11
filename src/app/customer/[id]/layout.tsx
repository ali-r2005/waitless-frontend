import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Queue Status",
  description: "View your real-time position in the queue and estimated waiting time.",
};

export default function CustomerQueueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
