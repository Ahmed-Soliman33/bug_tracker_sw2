import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Menu, Plus, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  onMenuClick: () => void;
  onAddBugClick: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  bugCount: number;
}

export function Navbar({ 
  onMenuClick, 
  onAddBugClick, 
  darkMode, 
  onToggleDarkMode, 
  bugCount 
}: NavbarProps) {
  return (
    <nav className="bg-background border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Bug Tracker</h1>
            <Badge variant="secondary">{bugCount} bugs</Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={onAddBugClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Bug
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDarkMode}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </nav>
  );
}