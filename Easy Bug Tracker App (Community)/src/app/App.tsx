import React, { useState, useEffect } from 'react';
import { Bug, BugStatus } from './types/bug';
import { Dashboard } from './components/Dashboard';
import { BugForm } from './components/BugForm';
import { KanbanBoard } from './components/KanbanBoard';
import { BugTable } from './components/BugTable';
import { ReportsPage } from './components/ReportsPage';
import { BugDetail } from './components/BugDetail';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/ui/sidebar';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Plus, Search, Filter, Download, Moon, Sun, Menu, X } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

// Sample data for demo purposes
const SAMPLE_BUGS: Bug[] = [
  {
    id: '1',
    title: 'Login button not responding on mobile',
    description: 'Users unable to click the login button on mobile devices. The button appears to be unresponsive to touch events.',
    severity: 'High',
    priority: 'P1',
    assignedTo: 'John Smith',
    status: 'Open',
    stepsToReproduce: '1. Open app on mobile\n2. Navigate to login page\n3. Try to tap login button\n4. Nothing happens',
    attachments: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    comments: [
      { id: '1', content: 'This is affecting many users, needs immediate attention.', author: 'Jane Doe', createdAt: new Date('2024-01-15') }
    ],
    tags: ['mobile', 'authentication']
  },
  {
    id: '2',
    title: 'Dashboard loading slowly',
    description: 'Dashboard takes more than 10 seconds to load, causing poor user experience.',
    severity: 'Medium',
    priority: 'P2',
    assignedTo: 'Alice Johnson',
    status: 'In Progress',
    stepsToReproduce: '1. Login to app\n2. Navigate to dashboard\n3. Wait and observe loading time',
    attachments: [],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
    comments: [],
    tags: ['performance', 'dashboard']
  },
  {
    id: '3',
    title: 'Email notifications not sending',
    description: 'System is not sending email notifications for bug updates and assignments.',
    severity: 'Low',
    priority: 'P3',
    assignedTo: 'Bob Wilson',
    status: 'Resolved',
    stepsToReproduce: '1. Create or update a bug\n2. Check email for notification\n3. No email received',
    attachments: [],
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-17'),
    comments: [
      { id: '2', content: 'Fixed the SMTP configuration issue.', author: 'Bob Wilson', createdAt: new Date('2024-01-17') }
    ],
    tags: ['notifications', 'email']
  }
];

type ViewMode = 'dashboard' | 'kanban' | 'table' | 'reports';

export default function App() {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [filteredBugs, setFilteredBugs] = useState<Bug[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [isAddingBug, setIsAddingBug] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load bugs from localStorage on mount
  useEffect(() => {
    const savedBugs = localStorage.getItem('bugTracker_bugs');
    if (savedBugs) {
      const parsedBugs = JSON.parse(savedBugs).map((bug: any) => ({
        ...bug,
        createdAt: new Date(bug.createdAt),
        updatedAt: new Date(bug.updatedAt),
        comments: bug.comments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt)
        }))
      }));
      setBugs(parsedBugs);
    } else {
      setBugs(SAMPLE_BUGS);
    }

    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('bugTracker_darkMode');
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Save bugs to localStorage whenever bugs change
  useEffect(() => {
    localStorage.setItem('bugTracker_bugs', JSON.stringify(bugs));
  }, [bugs]);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('bugTracker_darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Filter bugs based on search and filters
  useEffect(() => {
    let filtered = bugs;

    if (searchTerm) {
      filtered = filtered.filter(bug =>
        bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(bug => bug.status === statusFilter);
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(bug => bug.severity === severityFilter);
    }

    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(bug => bug.assignedTo === assigneeFilter);
    }

    setFilteredBugs(filtered);
  }, [bugs, searchTerm, statusFilter, severityFilter, assigneeFilter]);

  const handleAddBug = (bugData: Omit<Bug, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const newBug: Bug = {
      ...bugData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };
    setBugs(prev => [newBug, ...prev]);
    setIsAddingBug(false);
    toast.success('Bug created successfully!');
  };

  const handleUpdateBug = (updatedBug: Bug) => {
    setBugs(prev => prev.map(bug => 
      bug.id === updatedBug.id 
        ? { ...updatedBug, updatedAt: new Date() }
        : bug
    ));
    toast.success('Bug updated successfully!');
  };

  const handleDeleteBug = (bugId: string) => {
    setBugs(prev => prev.filter(bug => bug.id !== bugId));
    setSelectedBug(null);
    toast.success('Bug deleted successfully!');
  };

  const handleExportCSV = () => {
    const csvData = [
      ['ID', 'Title', 'Description', 'Status', 'Severity', 'Priority', 'Assigned To', 'Created At', 'Updated At'],
      ...filteredBugs.map(bug => [
        bug.id,
        bug.title,
        bug.description.replace(/"/g, '""'),
        bug.status,
        bug.severity,
        bug.priority,
        bug.assignedTo,
        bug.createdAt.toISOString(),
        bug.updatedAt.toISOString()
      ])
    ];

    const csvContent = csvData.map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bugs_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Export completed!');
  };

  const getUniqueAssignees = () => {
    return [...new Set(bugs.map(bug => bug.assignedTo))];
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSeverityFilter('all');
    setAssigneeFilter('all');
  };

  const activeFiltersCount = [searchTerm, statusFilter, severityFilter, assigneeFilter]
    .filter(filter => filter && filter !== 'all').length;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-semibold">Bug Tracker</h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="p-4 space-y-2">
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => {
              setCurrentView('dashboard');
              setSidebarOpen(false);
            }}
          >
            Dashboard
          </Button>
          <Button
            variant={currentView === 'kanban' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => {
              setCurrentView('kanban');
              setSidebarOpen(false);
            }}
          >
            Kanban Board
          </Button>
          <Button
            variant={currentView === 'table' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => {
              setCurrentView('table');
              setSidebarOpen(false);
            }}
          >
            Bug List
          </Button>
          <Button
            variant={currentView === 'reports' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => {
              setCurrentView('reports');
              setSidebarOpen(false);
            }}
          >
            Reports
          </Button>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bugs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    {getUniqueAssignees().map(assignee => (
                      <SelectItem key={assignee} value={assignee}>
                        {assignee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Filter className="h-3 w-3 mr-1" />
                      {activeFiltersCount}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setIsAddingBug(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Bug
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-6">
          {currentView === 'dashboard' && (
            <Dashboard
              bugs={filteredBugs}
              onBugClick={setSelectedBug}
              onUpdateBug={handleUpdateBug}
            />
          )}
          
          {currentView === 'kanban' && (
            <KanbanBoard
              bugs={filteredBugs}
              onBugClick={setSelectedBug}
              onUpdateBug={handleUpdateBug}
            />
          )}
          
          {currentView === 'table' && (
            <BugTable
              bugs={filteredBugs}
              onBugClick={setSelectedBug}
              onUpdateBug={handleUpdateBug}
              onDeleteBug={handleDeleteBug}
            />
          )}
          
          {currentView === 'reports' && (
            <ReportsPage bugs={bugs} />
          )}
        </main>
      </div>

      {/* Bug form modal */}
      {isAddingBug && (
        <BugForm
          onSubmit={handleAddBug}
          onCancel={() => setIsAddingBug(false)}
        />
      )}

      {/* Bug detail modal */}
      {selectedBug && (
        <BugDetail
          bug={selectedBug}
          onClose={() => setSelectedBug(null)}
          onUpdate={handleUpdateBug}
          onDelete={handleDeleteBug}
        />
      )}
    </div>
  );
}