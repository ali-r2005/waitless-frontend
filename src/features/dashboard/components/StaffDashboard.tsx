'use client';

import {
  CheckCircle2, Clock, AlertTriangle, LayoutList, Flame,
} from 'lucide-react';
import { StatCard } from './StatCard';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { staffDummyData as data } from '../data/dummyData';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

const CHART_COLORS = ['#7c6ef6', '#38c7c0', '#f97316', '#f43f5e', '#84cc16'];

const ACTION_STYLES: Record<string, string> = {
  served: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  called: 'bg-primary/10 text-primary border-primary/20',
  late: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

const QUEUE_STATUS_STYLES: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  paused: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  inactive: 'bg-muted text-muted-foreground',
};

export function StaffDashboard() {
  const { stats } = data;
  const queue = data.currentQueue;

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ───────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          My Work Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Your personal performance and active queue status for today.
        </p>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Served Today"
          value={stats.servedToday}
          change={stats.servedChange}
          icon={CheckCircle2}
          iconColor="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          label="Currently Waiting"
          value={stats.currentWaiting}
          subtitle="Customers in your queue"
          icon={Clock}
          iconColor="text-primary"
          bgColor="bg-primary/10"
        />
        <StatCard
          label="Avg Service Time"
          value={stats.avgServiceTime}
          suffix=" min"
          change={stats.avgServiceChange}
          icon={Flame}
          iconColor="text-orange-500"
          bgColor="bg-orange-500/10"
        />
        <StatCard
          label="Late Customers"
          value={stats.lateCustomers}
          subtitle="Require attention"
          icon={AlertTriangle}
          iconColor="text-amber-500"
          bgColor="bg-amber-500/10"
        />
      </div>

      {/* ── Active Queue Card ──────────────────────────────────────── */}
      {queue && (
        <Card className="border-primary/30 bg-primary/5 dark:bg-primary/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <LayoutList className="h-4 w-4 text-primary" />
                  {queue.name}
                </CardTitle>
                <CardDescription>Your current active queue</CardDescription>
              </div>
              <Badge
                variant="outline"
                className={cn('capitalize text-xs', QUEUE_STATUS_STYLES[queue.status])}
              >
                {queue.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl bg-background/70 border p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{queue.waiting}</p>
                <p className="text-xs text-muted-foreground mt-1">Waiting</p>
              </div>
              <div className="rounded-xl bg-background/70 border p-4 text-center">
                <p className="text-lg font-bold text-primary truncate">{queue.serving ?? '—'}</p>
                <p className="text-xs text-muted-foreground mt-1">Now Serving</p>
              </div>
              <div className="rounded-xl bg-background/70 border p-4 text-center">
                <p className="text-3xl font-bold text-foreground">{queue.avgWait}</p>
                <p className="text-xs text-muted-foreground mt-1">Avg Wait (min)</p>
              </div>
              <div className="rounded-xl bg-background/70 border p-4 text-center">
                <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.servedToday}</p>
                <p className="text-xs text-muted-foreground mt-1">Served Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Charts Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Hourly served chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Customers Served — Today</CardTitle>
            <CardDescription>Your productivity by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.myServedToday} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradStaffServed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Area
                  type="monotone"
                  dataKey="served"
                  stroke={CHART_COLORS[0]}
                  fill="url(#gradStaffServed)"
                  strokeWidth={2.5}
                  name="Served"
                  dot={{ r: 3, fill: CHART_COLORS[0] }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">My Status Breakdown</CardTitle>
            <CardDescription>Today's customer outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.customerStatusBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="status"
                >
                  {data.customerStatusBreakdown.map((_, i) => (
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

      {/* ── Weekly Bar + Activity Log ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Weekly served bar */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Weekly Performance</CardTitle>
            <CardDescription>Customers served per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.servedThisWeek} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                />
                <Bar dataKey="served" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} name="Served" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
            <CardDescription>Last customer actions in your queue</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {data.recentActivity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {item.customer.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.customer}</p>
                      <p className="text-xs text-muted-foreground">#{item.ticket}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant="outline"
                      className={cn('text-xs capitalize', ACTION_STYLES[item.action])}
                    >
                      {item.action}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
