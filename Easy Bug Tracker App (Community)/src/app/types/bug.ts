export type BugStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type BugSeverity = 'Low' | 'Medium' | 'High';
export type BugPriority = 'P1' | 'P2' | 'P3';

export interface Comment {
  id: string;
  content: string;
  author: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  severity: BugSeverity;
  priority: BugPriority;
  assignedTo: string;
  status: BugStatus;
  stepsToReproduce: string;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  tags?: string[];
}