// src/features/dashboard/types.ts

export interface StatCard {
  label: string;
  value: string | number;
  change: number; // percentage change vs last period
  icon: string;
}

// ── Business Owner KPIs ──────────────────────────────────────────────────────

export interface OwnerDashboardData {
  stats: {
    totalCustomersToday: number;
    totalCustomersChange: number;
    avgWaitTime: number;        // minutes
    avgWaitTimeChange: number;
    servedRate: number;         // percentage
    servedRateChange: number;
    activeQueues: number;
    totalQueues: number;
    totalRevenue: number;
    revenueChange: number;
    peakHour: string;
    staffOnDuty: number;
  };
  customerVolumeWeek: { day: string; customers: number; served: number; cancelled: number }[];
  hourlyTraffic: { hour: string; customers: number }[];
  queuePerformance: { name: string; avgWait: number; served: number; late: number; cancelled: number }[];
  staffPerformance: { name: string; served: number; avgTime: number; rating: number }[];
  customerStatusBreakdown: { status: string; count: number; fill: string }[];
  revenueByDay: { day: string; revenue: number }[];
  topQueues: { name: string; customers: number; waitTime: number; status: string }[];
}

// ── Staff KPIs ────────────────────────────────────────────────────────────────

export interface StaffDashboardData {
  stats: {
    servedToday: number;
    servedChange: number;
    currentWaiting: number;
    avgServiceTime: number;     // minutes
    avgServiceChange: number;
    lateCustomers: number;
    myQueuesActive: number;
  };
  myServedToday: { hour: string; served: number }[];
  servedThisWeek: { day: string; served: number }[];
  currentQueue: {
    id: number;
    name: string;
    waiting: number;
    serving: string | null;
    avgWait: number;
    status: 'active' | 'paused' | 'inactive';
  } | null;
  recentActivity: {
    time: string;
    customer: string;
    ticket: string;
    action: 'served' | 'called' | 'late' | 'cancelled';
  }[];
  customerStatusBreakdown: { status: string; count: number; fill: string }[];
}
