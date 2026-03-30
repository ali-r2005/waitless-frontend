"use client";

import QueueManagement from "@/features/QueueManagement/components/QueueManagement";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function QueuePage() {

  useRequireRole(["staff", "business_owner"]);

  return (
    <QueueManagement />
  );
}
