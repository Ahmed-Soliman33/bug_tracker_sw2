import React from 'react';
import { Bug } from '../types/bug';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Badge } from './ui/badge';
import { TrendingUp, TrendingDown, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

interface ReportsPageProps {
  bugs: Bug[];
}

const COLORS = {
  status: ['#ef4444', '#f59e0b', '#10b981', '#6b7280'],
  severity: ['#ef4444', '#f59e0b', '#10b981'],
  priority: ['#ef4444', '#f59e0b', '#10b981']
};

export function ReportsPage({ bugs }: ReportsPageProps) {
  // Status distribution
  const statusData = bugs.reduce((acc, bug) => {
    acc[bug.status] = (acc[bug.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    name: status,
    value: count,
    percentage: Math.round((count / bugs.length) * 100)
  }));

  // Severity distribution
  const severityData = bugs.reduce((acc, bug) => {
    acc[bug.severity] = (acc[bug.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityChartData = Object.entries(severityData).map(([severity, count]) => ({
    name: severity,
    count
  }));

  // Priority distribution
  const priorityData = bugs.reduce((acc, bug) => {
    acc[bug.priority] = (acc[bug.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityChartData = Object.entries(priorityData).map(([priority, count]) => ({
    name: priority,
    count
  }));

  // Bugs by assignee
  const assigneeData = bugs.reduce((acc, bug) => {
    acc[bug.assignedTo] = (acc[bug.assignedTo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topAssignees = Object.entries(assigneeData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([assignee, count]) => ({ name: assignee, count }));

  // Trend data (last 30 days)
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    const bugsCreated = bugs.filter(bug => 
      bug.createdAt.toDateString() === date.toDateString()
    ).length;
    
    const bugsResolved = bugs.filter(bug => 
      bug.updatedAt.toDateString() === date.toDateString() && 
      (bug.status === 'Resolved' || bug.status === 'Closed')
    ).length;

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      created: bugsCreated,
      resolved: bugsResolved
    };
  });

  // Key metrics
  const totalBugs = bugs.length;
  const openBugs = bugs.filter(bug => bug.status === 'Open').length;
  const resolvedBugs = bugs.filter(bug => bug.status === 'Resolved' || bug.status === 'Closed').length;
  const highPriorityBugs = bugs.filter(bug => bug.priority === 'P1').length;
  const resolutionRate = totalBugs > 0 ? Math.round((resolvedBugs / totalBugs) * 100) : 0;

  // Recent activity
  const recentBugs = bugs
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Bug Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Overview of bug tracking metrics and trends
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bugs</p>
                <p className="text-3xl font-bold">{totalBugs}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Bugs</p>
                <p className="text-3xl font-bold text-red-600">{openBugs}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-3xl font-bold text-green-600">{resolutionRate}%</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-3xl font-bold text-orange-600">{highPriorityBugs}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Bugs by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.status[index % COLORS.status.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Bugs by Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={severityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#8884d8">
                  {severityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS.severity[index % COLORS.severity.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bugs Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="created" stroke="#ef4444" name="Created" />
                <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Assignees */}
        <Card>
          <CardHeader>
            <CardTitle>Bugs by Assignee</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topAssignees} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentBugs.map(bug => (
              <div key={bug.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{bug.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{bug.status}</Badge>
                    <Badge variant="secondary" className={
                      bug.severity === 'High' ? 'bg-red-100 text-red-800' :
                      bug.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {bug.severity}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      by {bug.assignedTo}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {bug.updatedAt.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}