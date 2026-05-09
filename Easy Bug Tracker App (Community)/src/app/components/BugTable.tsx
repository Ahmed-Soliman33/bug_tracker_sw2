import React, { useState } from 'react';
import { Bug } from '../types/bug';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MoreHorizontal, Edit, Trash2, Eye, Calendar, MessageSquare, Paperclip } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface BugTableProps {
  bugs: Bug[];
  onBugClick: (bug: Bug) => void;
  onUpdateBug: (bug: Bug) => void;
  onDeleteBug: (bugId: string) => void;
}

export function BugTable({ bugs, onBugClick, onUpdateBug, onDeleteBug }: BugTableProps) {
  const [sortField, setSortField] = useState<keyof Bug>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Resolved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'P2': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'P3': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const handleSort = (field: keyof Bug) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedBugs = [...bugs].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc' 
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    }

    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  const SortableHeader = ({ field, children }: { field: keyof Bug; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-xs">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </TableHead>
  );

  if (bugs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No bugs found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Bug List</h2>
          <p className="text-muted-foreground">
            Showing {bugs.length} bug{bugs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="title">Title</SortableHeader>
              <SortableHeader field="status">Status</SortableHeader>
              <SortableHeader field="severity">Severity</SortableHeader>
              <SortableHeader field="priority">Priority</SortableHeader>
              <SortableHeader field="assignedTo">Assignee</SortableHeader>
              <SortableHeader field="createdAt">Created</SortableHeader>
              <SortableHeader field="updatedAt">Updated</SortableHeader>
              <TableHead>Activity</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBugs.map(bug => (
              <TableRow 
                key={bug.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onBugClick(bug)}
              >
                <TableCell className="max-w-xs">
                  <div className="space-y-1">
                    <div className="font-medium truncate">{bug.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {bug.description}
                    </div>
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
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(bug.status)} variant="secondary">
                    {bug.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(bug.severity)} variant="secondary">
                    {bug.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(bug.priority)} variant="secondary">
                    {bug.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(bug.assignedTo)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate max-w-24">
                      {bug.assignedTo}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {bug.createdAt.toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {bug.updatedAt.toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
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
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        onBugClick(bug);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        // This would open the edit form - for now just view details
                        onBugClick(bug);
                      }}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Bug
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this bug?')) {
                            onDeleteBug(bug.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Bug
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}