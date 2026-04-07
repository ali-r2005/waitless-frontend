'use client';

import {
  Users, Clock, CheckCircle2, LayoutList,
  DollarSign, Zap, Star, TrendingUp,
} from 'lucide-react';
import { StatCard } from './StatCard';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ownerDummyData as data } from '../data/dummyData';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

const CHART_COLORS = ['#7c6ef6', '#38c7c0', '#f97316', '#f43f5e', '#84cc16'];
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  paused: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  inactive: 'bg-muted text-muted-foreground',
};

export function OwnerDashboard() {
  const { stats } = data;

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ───────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Business Overview
        </h1>
        <p className="text-muted-foreground text-sm">
          Today's performance snapshot across all your queues.
        </p>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Customers Today"
          value={stats.totalCustomersToday}
          change={stats.totalCustomersChange}
          icon={Users}
          iconColor="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          label="Avg. Wait Time"
          value={stats.avgWaitTime}
          suffix=" min"
          change={stats.avgWaitTimeChange}
          icon={Clock}
          iconColor="text-sky-500"
          bgColor="bg-sky-500/10"
        />
        <StatCard
          label="Service Rate"
          value={stats.servedRate}
          suffix="%"
          change={stats.servedRateChange}
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          label="Active Queues"
          value={`${stats.activeQueues} / ${stats.totalQueues}`}
          subtitle={`${stats.staffOnDuty} staff on duty`}
          icon={LayoutList}
          iconColor="text-violet-500"
          bgColor="bg-violet-500/10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Revenue Today"
          value={stats.totalRevenue}
          prefix="$"
          change={stats.revenueChange}
          icon={DollarSign}
          iconColor="text-amber-500"
          bgColor="bg-amber-500/10"
        />
        <StatCard
          label="Peak Hour"
          value={stats.peakHour}
          subtitle="Highest traffic window"
          icon={Zap}
          iconColor="text-orange-500"
          bgColor="bg-orange-500/10"
        />
        <StatCard
          label="Staff on Duty"
          value={stats.staffOnDuty}
          subtitle="Managing active queues"
          icon={Star}
          iconColor="text-rose-500"
          bgColor="bg-rose-500/10"
        />
        <StatCard
          label="Weekly Growth"
          value="+12.4%"
          subtitle="Customers vs last week"
          icon={TrendingUp}
          iconColor="text-teal-500"
          bgColor="bg-teal-500/10"
        />
      </div>

      {/* ── Row: Volume Chart + Pie ───────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Customer Volume - Week */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Customer Volume — This Week</CardTitle>
            <CardDescription>Daily served vs cancelled</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.customerVolumeWeek} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradServed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradCancelled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[3]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS[3]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                  labelStyle={{ fontWeight: 600 }}
                />
                <Legend />
                <Area type="monotone" dataKey="served" stroke={CHART_COLORS[0]} fill="url(#gradServed)" strokeWidth={2} name="Served" dot={false} />
                <Area type="monotone" dataKey="cancelled" stroke={CHART_COLORS[3]} fill="url(#gradCancelled)" strokeWidth={2} name="Cancelled" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Today's Status Breakdown</CardTitle>
            <CardDescription>By customer status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.customerStatusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="status"
                >
                  {data.customerStatusBreakdown.map((entry, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Row: Hourly Traffic + Revenue ────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Hourly Traffic */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Hourly Customer Traffic</CardTitle>
            <CardDescription>Customers arriving per hour today</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.hourlyTraffic} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Bar dataKey="customers" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} name="Customers" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Daily Revenue — This Week</CardTitle>
            <CardDescription>Estimated revenue per business day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.revenueByDay} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[1]} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                  formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke={CHART_COLORS[1]} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS[1] }} name="Revenue ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Row: Queue Table + Staff Table ────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Queue Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Queue Performance</CardTitle>
            <CardDescription>Avg wait, served, late and cancelled counts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Queue</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Avg Wait</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Served</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Late</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Cancelled</th>
                  </tr>
                </thead>
                <tbody>
                  {data.queuePerformance.map((q, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{q.name}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{q.avgWait} min</td>
                      <td className="px-4 py-3 text-center text-emerald-600 dark:text-emerald-400 font-medium">{q.served}</td>
                      <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-400">{q.late}</td>
                      <td className="px-4 py-3 text-center text-rose-600 dark:text-rose-400">{q.cancelled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Staff Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Staff Performance</CardTitle>
            <CardDescription>Customers served and avg service time</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Staff</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Served</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Avg Time</th>
                    <th className="text-center px-4 py-3 font-medium text-muted-foreground">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data.staffPerformance.map((s, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                            {s.name.charAt(0)}
                          </div>
                          <span className="font-medium">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-emerald-600 dark:text-emerald-400">{s.served}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{s.avgTime} min</td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-amber-500 font-medium">★ {s.rating}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Active Queues Overview ─────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Queue Status Overview</CardTitle>
          <CardDescription>Real-time state of all queues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {data.topQueues.map((q, i) => (
              <div
                key={i}
                className="rounded-xl border p-4 flex flex-col gap-2 hover:shadow-sm transition-all bg-card"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">{q.name}</span>
                  <Badge
                    variant="outline"
                    className={cn('text-xs capitalize', STATUS_COLORS[q.status])}
                  >
                    {q.status}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-foreground">{q.customers}</div>
                <div className="text-xs text-muted-foreground">customers served</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{q.waitTime} min avg</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
