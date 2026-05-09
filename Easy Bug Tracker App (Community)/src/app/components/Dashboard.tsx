import React from 'react';
import { Bug, BugStatus } from '../types/bug';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, User, AlertTriangle, Clock } from 'lucide-react';

interface DashboardProps {
  bugs: Bug[];
  onBugClick: (bug: Bug) => void;
  onUpdateBug: (bug: Bug) => void;
}

export function Dashboard({ bugs, onBugClick, onUpdateBug }: DashboardProps) {
  const bugsByStatus = bugs.reduce((acc, bug) => {
    if (!acc[bug.status]) {
      acc[bug.status] = [];
    }
    acc[bug.status].push(bug);
    return acc;
  }, {} as Record<BugStatus, Bug[]>);

  const statusConfig = {
    'Open': { color: 'bg-red-500', count: bugsByStatus['Open']?.length || 0 },
    'In Progress': { color: 'bg-yellow-500', count: bugsByStatus['In Progress']?.length || 0 },
    'Resolved': { color: 'bg-green-500', count: bugsByStatus['Resolved']?.length || 0 },
    'Closed': { color: 'bg-gray-500', count: bugsByStatus['Closed']?.length || 0 }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'P1': return <AlertTriangle className="h-3 w-3 text-red-500" />;
      case 'P2': return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'P3': return <Clock className="h-3 w-3 text-green-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => (
          <Card key={status}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{status}</CardTitle>
              <div className={`h-3 w-3 rounded-full ${config.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{config.count}</div>
              <p className="text-xs text-muted-foreground">
                {config.count === 1 ? 'bug' : 'bugs'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bugs
              .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
              .slice(0, 5)
              .map(bug => (
                <div
                  key={bug.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onBugClick(bug)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{bug.title}</h4>
                      <Badge className={getSeverityColor(bug.severity)} variant="secondary">
                        {bug.severity}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(bug.priority)}
                        <span className="text-xs">{bug.priority}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {bug.assignedTo}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {bug.updatedAt.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{bug.status}</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Bugs by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {Object.entries(bugsByStatus).map(([status, statusBugs]) => (
          <Card key={status}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${statusConfig[status as BugStatus]?.color}`} />
                {status}
                <Badge variant="secondary" className="ml-auto">
                  {statusBugs.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {statusBugs.slice(0, 3).map(bug => (
                <div
                  key={bug.id}
                  className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onBugClick(bug)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-sm truncate">{bug.title}</h5>
                    <div className="flex items-center gap-1">
                      {getPriorityIcon(bug.priority)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">{bug.assignedTo}</span>
                    <Badge className={getSeverityColor(bug.severity)} variant="secondary">
                      {bug.severity}
                    </Badge>
                  </div>
                </div>
              ))}
              {statusBugs.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full">
                  View {statusBugs.length - 3} more
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}