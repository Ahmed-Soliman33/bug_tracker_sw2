import React, { useState } from 'react';
import { Bug, BugStatus } from '../types/bug';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Calendar, User, AlertTriangle, Clock, MessageSquare, Paperclip } from 'lucide-react';

interface KanbanBoardProps {
  bugs: Bug[];
  onBugClick: (bug: Bug) => void;
  onUpdateBug: (bug: Bug) => void;
}

const STATUS_CONFIG = {
  'Open': { color: 'bg-red-500', label: 'Open' },
  'In Progress': { color: 'bg-yellow-500', label: 'In Progress' },
  'Resolved': { color: 'bg-green-500', label: 'Resolved' },
  'Closed': { color: 'bg-gray-500', label: 'Closed' }
};

export function KanbanBoard({ bugs, onBugClick, onUpdateBug }: KanbanBoardProps) {
  const [draggedBug, setDraggedBug] = useState<Bug | null>(null);

  const bugsByStatus = bugs.reduce((acc, bug) => {
    if (!acc[bug.status]) {
      acc[bug.status] = [];
    }
    acc[bug.status].push(bug);
    return acc;
  }, {} as Record<BugStatus, Bug[]>);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
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

  const handleDragStart = (e: React.DragEvent, bug: Bug) => {
    setDraggedBug(bug);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: BugStatus) => {
    e.preventDefault();
    
    if (draggedBug && draggedBug.status !== newStatus) {
      const updatedBug = { ...draggedBug, status: newStatus };
      onUpdateBug(updatedBug);
    }
    
    setDraggedBug(null);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h2>Kanban Board</h2>
        <p className="text-muted-foreground">
          Drag and drop bugs between columns to change their status
        </p>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-max pb-4">
          {Object.entries(STATUS_CONFIG).map(([status, config]) => {
            const statusBugs = bugsByStatus[status as BugStatus] || [];
            
            return (
              <div
                key={status}
                className="flex-shrink-0 w-80"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status as BugStatus)}
              >
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${config.color}`} />
                      <h3 className="font-medium">{config.label}</h3>
                      <Badge variant="secondary">{statusBugs.length}</Badge>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                    {statusBugs.map(bug => (
                      <Card
                        key={bug.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        draggable
                        onDragStart={(e) => handleDragStart(e, bug)}
                        onClick={() => onBugClick(bug)}
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* Header with title and priority */}
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-sm leading-tight line-clamp-2">
                                {bug.title}
                              </h4>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                {getPriorityIcon(bug.priority)}
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {bug.description}
                            </p>

                            {/* Tags */}
                            {bug.tags && bug.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {bug.tags.slice(0, 2).map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                                    {tag}
                                  </Badge>
                                ))}
                                {bug.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs px-1 py-0">
                                    +{bug.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}

                            {/* Severity badge */}
                            <div className="flex justify-start">
                              <Badge className={getSeverityColor(bug.severity)} variant="secondary">
                                {bug.severity}
                              </Badge>
                            </div>

                            {/* Footer with assignee and metadata */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {getInitials(bug.assignedTo)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground truncate">
                                  {bug.assignedTo}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {bug.comments.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="h-3 w-3" />
                                    {bug.comments.length}
                                  </div>
                                )}
                                {bug.attachments.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Paperclip className="h-3 w-3" />
                                    {bug.attachments.length}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {bug.updatedAt.toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {statusBugs.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No bugs in this status</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}