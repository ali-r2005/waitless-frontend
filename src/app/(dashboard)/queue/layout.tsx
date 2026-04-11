import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Queue Management",
  description: "Manage your active queues, call customers, and monitor wait times in real-time.",
};

export default function QueueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
