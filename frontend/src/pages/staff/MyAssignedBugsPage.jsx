import { useQuery } from "@tanstack/react-query"
import { get } from "@/lib/api"
import { useAuthStore } from "@/store/useAuthStore"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Bug, Search } from "lucide-react"
import { statusBadgeClass, priorityBadgeClass } from "@/lib/bugUtils"
import { useState } from "react"

export default function MyAssignedBugsPage() {
  const user = useAuthStore((s) => s.user)
  const [search, setSearch] = useState("")

  const { data: bugs = [], isLoading } = useQuery({
    queryKey: ["bugs"],
    queryFn: () => get("/bugs"),
    select: (res) => {
      const all = Array.isArray(res) ? res : res?.data ?? []
      return all.filter((b) => b.assignedStaffId === user?.id)
    },
  })

  const filtered = bugs.filter((b) =>
    !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.projectName?.toLowerCase().includes(search.toLowerCase())
  )

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
        <h1 className="text-2xl font-semibold">My Assigned Bugs</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{bugs.length} bug{bugs.length !== 1 ? "s" : ""} assigned to you</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search bugs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Bug className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              {bugs.length === 0 ? "No bugs assigned to you yet." : "No bugs match your search."}
            </p>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((bug) => (
                <TableRow key={bug.id}>
                  <TableCell>
                    <Link
                      to={`/staff/bugs/${bug.id}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {bug.title}
                    </Link>
                    {bug.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">{bug.description}</p>
                    )}
                  </TableCell>
                  <TableCell><span className="text-sm">{bug.projectName}</span></TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
