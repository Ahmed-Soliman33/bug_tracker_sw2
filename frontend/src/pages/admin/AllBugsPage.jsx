import { useQuery } from "@tanstack/react-query"
import { get } from "@/lib/api"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Bug, Search } from "lucide-react"
import { statusBadgeClass, priorityBadgeClass } from "@/lib/bugUtils"
import { useState } from "react"

export default function AllBugsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const { data: bugs = [], isLoading } = useQuery({
    queryKey: ["bugs"],
    queryFn: () => get("/bugs"),
    select: (res) => (Array.isArray(res) ? res : res?.data ?? []),
  })

  const filtered = bugs.filter((b) => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.projectName?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || b.status === statusFilter
    return matchSearch && matchStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">All Bugs</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{bugs.length} bug{bugs.length !== 1 ? "s" : ""} total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bugs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["ALL", "OPEN", "ASSIGNED", "IN_PROGRESS", "SOLVED", "CLOSED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                statusFilter === s
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted"
              }`}
            >
              {s === "ALL" ? "All" : s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bug className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No bugs match your filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bug) => (
                <TableRow key={bug.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      to={`/admin/bugs/${bug.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {bug.title}
                    </Link>
                    {bug.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{bug.description}</p>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{bug.projectName}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[11px] px-2 py-0.5 rounded-full border ${priorityBadgeClass(bug.priority)}`}>
                      {bug.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[11px] px-2 py-0.5 rounded-full border ${statusBadgeClass(bug.status)}`}>
                      {bug.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {bug.assignedStaffId ? `Staff #${bug.assignedStaffId}` : "—"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
