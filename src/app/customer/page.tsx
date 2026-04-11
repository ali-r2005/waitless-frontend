import type { Metadata } from "next";
import ListQueues from "@/features/Customer/components/ListQueues";

export const metadata: Metadata = {
  title: "Find a Queue",
  description: "Search for available businesses and join a queue from anywhere.",
};

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