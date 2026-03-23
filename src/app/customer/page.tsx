import ListQueues from "@/features/Customer/components/ListQueues";
import { Suspense } from "react";

export default function CustomerPage() {
 return (
  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
    <ListQueues />
  </Suspense>
 );
}