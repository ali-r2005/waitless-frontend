import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Management",
  description: "Manage your team members, assign roles, and monitor staff performance.",
};

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
