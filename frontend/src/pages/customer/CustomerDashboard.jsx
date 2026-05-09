import { useQuery } from "@tanstack/react-query"
import { get } from "@/lib/api"
import { useAuthStore } from "@/store/useAuthStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bug, CheckCircle2, AlertCircle, Plus, Loader2 } from "lucide-react"
import { statusBadgeClass, priorityBadgeClass } from "@/lib/bugUtils"
import { Link } from "react-router-dom"

function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: accent + "18" }}>
          <Icon className="h-4.5 w-4.5" style={{ color: accent }} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </CardContent>
    </Card>
  )
}

export default function CustomerDashboard() {
  const user = useAuthStore((s) => s.user)

  const { data: bugs = [], isLoading } = useQuery({
    queryKey: ["bugs"],
    queryFn: () => get("/bugs"),
    select: (res) => {
      const all = Array.isArray(res) ? res : res?.data ?? []
      return all.filter((b) => b.customerId === user?.id)
    },
  })

  const openBugs   = bugs.filter((b) => b.status === "OPEN").length
  const solvedBugs = bugs.filter((b) => b.status === "SOLVED").length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track your reported issues</p>
        </div>
        <Link
          to="/customer/bugs/new"
          className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ background: "var(--brand-navy)" }}
        >
          <Plus className="h-4 w-4" />
          Report a Bug
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Bug}          label="My Bugs"     value={bugs.length}  sub="All reported"       accent="#000093" />
        <StatCard icon={AlertCircle}  label="Open"        value={openBugs}     sub="Awaiting fix"       accent="#ef4444" />
        <StatCard icon={CheckCircle2} label="Solved"      value={solvedBugs}   sub="Resolved"           accent="#01ab77" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">My Recent Bugs</CardTitle>
          <Link to="/customer/bugs" className="text-xs font-medium hover:underline" style={{ color: "var(--brand-navy)" }}>
            View all
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          {bugs.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <p className="text-sm text-muted-foreground">You haven&apos;t reported any bugs yet.</p>
              <Link
                to="/customer/bugs/new"
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "var(--brand-navy)" }}
              >
                <Plus className="h-4 w-4" />
                Report your first bug
              </Link>
            </div>
          ) : (
            bugs.slice(0, 8).map((bug) => (
              <Link
                key={bug.id}
                to={`/customer/bugs/${bug.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary">{bug.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{bug.projectName}</p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <Badge className={`text-[11px] px-2 py-0.5 rounded-full border ${priorityBadgeClass(bug.priority)}`}>
                    {bug.priority}
                  </Badge>
                  <Badge className={`text-[11px] px-2 py-0.5 rounded-full border ${statusBadgeClass(bug.status)}`}>
                    {bug.status}
                  </Badge>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
