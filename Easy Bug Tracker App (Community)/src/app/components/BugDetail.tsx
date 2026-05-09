import React, { useState } from 'react';
import { Bug, Comment, BugStatus } from '../types/bug';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Calendar, User, AlertTriangle, Clock, MessageSquare, Edit, Trash2, Send, Paperclip } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface BugDetailProps {
  bug: Bug;
  onClose: () => void;
  onUpdate: (bug: Bug) => void;
  onDelete: (bugId: string) => void;
}

export function BugDetail({ bug, onClose, onUpdate, onDelete }: BugDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(bug.status);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'P1': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'P2': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'P3': return <Clock className="h-4 w-4 text-green-500" />;
      default: return null;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const handleStatusUpdate = () => {
    const updatedBug = { ...bug, status: editedStatus };
    onUpdate(updatedBug);
    setIsEditing(false);
    toast.success('Bug status updated!');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment.trim(),
      author: 'Current User', // In a real app, this would come from auth
      createdAt: new Date()
    };

    const updatedBug = {
      ...bug,
      comments: [...bug.comments, comment]
    };

    onUpdate(updatedBug);
    setNewComment('');
    setIsAddingComment(false);
    toast.success('Comment added!');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this bug? This action cannot be undone.')) {
      onDelete(bug.id);
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-xl">{bug.title}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Bug #{bug.id}</span>
                <span>•</span>
                <span>Created {bug.createdAt.toLocaleDateString()}</span>
                <span>•</span>
                <span>Updated {bug.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{bug.description}</p>
              </CardContent>
            </Card>

            {/* Steps to Reproduce */}
            {bug.stepsToReproduce && (
              <Card>
                <CardHeader>
                  <CardTitle>Steps to Reproduce</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm whitespace-pre-wrap font-sans">{bug.stepsToReproduce}</pre>
                </CardContent>
              </Card>
            )}

            {/* Attachments */}
            {bug.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {bug.attachments.map(attachment => (
                      <div key={attachment.id} className="flex items-center gap-2 p-2 border rounded">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{attachment.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {attachment.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Comments ({bug.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bug.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  bug.comments.map((comment, index) => (
                    <div key={comment.id}>
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(comment.author)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">
                              {comment.createdAt.toLocaleDateString()} at{' '}
                              {comment.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                        </div>
                      </div>
                      {index < bug.comments.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))
                )}

                {/* Add Comment */}
                <Separator />
                <div className="space-y-3">
                  {isAddingComment ? (
                    <div className="space-y-3">
                      <Textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddComment}>
                          <Send className="h-4 w-4 mr-1" />
                          Add Comment
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => {
                          setIsAddingComment(false);
                          setNewComment('');
                        }}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button variant="outline" onClick={() => setIsAddingComment(true)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-3">
                    <Select value={editedStatus} onValueChange={(value: BugStatus) => setEditedStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleStatusUpdate}>
                        Update
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setIsEditing(false);
                        setEditedStatus(bug.status);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Badge className={getStatusColor(bug.status)} variant="secondary">
                    {bug.status}
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Severity</span>
                    <Badge className={getSeverityColor(bug.severity)} variant="secondary">
                      {bug.severity}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Priority</span>
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(bug.priority)}
                      <Badge variant="outline">{bug.priority}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Assignee</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">
                          {getInitials(bug.assignedTo)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{bug.assignedTo}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {bug.tags && bug.tags.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {bug.tags.map(tag => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Created: {bug.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Updated: {bug.updatedAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquare className="h-3 w-3" />
                  <span>{bug.comments.length} comment{bug.comments.length !== 1 ? 's' : ''}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}