import CustomerComponent from "@/features/Customer/components/CustomerComponent";
import { Suspense } from "react";

export default function CustomerPage() {
 return (
  <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
   <CustomerComponent />
  </Suspense>
 );
}