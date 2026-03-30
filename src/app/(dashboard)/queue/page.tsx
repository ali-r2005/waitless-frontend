"use client";

import QueuesPage from "@/features/QueueManagement/components/QueuesPage";
import { useRequireRole } from "@/hooks/useRequireRole";

export default function QueueManagementPage() {

  useRequireRole(["staff", "business_owner"]);

  return (
   <QueuesPage />
  );
}
