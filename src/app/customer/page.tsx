import ListQueues from "@/features/Customer/components/ListQueues";
import { Suspense } from "react";
import Header from "@/components/layout/Header";

export default function CustomerPage() {
 return (
  <>
  <Header />
  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
    <ListQueues />
  </Suspense>
  </>
 );
}