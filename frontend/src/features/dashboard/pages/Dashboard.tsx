import { useAuthStore } from "../../../store/authStore";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  GitPullRequest, 
  Users, 
  ShieldAlert, 
  LogOut, 
  Activity, 
  Code2, 
  Search, 
  Bell, 
  Plus,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Mock statistics
  const stats = [
    { name: "Project Health Score", value: "94/100", change: "+2.4%", changeType: "positive", icon: Activity },
    { name: "Active Repository", value: "CodePulse-App", sub: "main branch", icon: Code2 },
    { name: "Open Pull Requests", value: "12", change: "-3 this week", changeType: "neutral", icon: GitPullRequest },
    { name: "Active Contributors", value: "8", change: "+1 today", changeType: "positive", icon: Users },
  ];

  const recentCommits = [
    { id: 1, author: "Tamajeet", message: "refactor: optimize auth state management and API base URL", time: "10 mins ago", hash: "4f8a2c1" },
    { id: 2, author: "Tamajeet", message: "feat: redesign auth cards to match black & white premium theme", time: "45 mins ago", hash: "9e1c2a0" },
    { id: 3, author: "Sarah Connor", message: "fix: resolve memory leak in background scheduler", time: "2 hours ago", hash: "2b9a7c3" },
    { id: 4, author: "John Doe", message: "chore: update Prisma schema for reset password token", time: "5 hours ago", hash: "d8c7b6a" },
  ];

  const securityAlerts = [
    { id: 1, severity: "High", dependency: "lodash", description: "Prototype pollution vulnerability in lodash < 4.17.21", status: "open" },
    { id: 2, severity: "Medium", dependency: "express", description: "Open redirect possibility in parsing subdomains", status: "resolved" },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0A] text-white font-sans">
      {/* Sidebar */}
      <aside 
        className={`border-r border-neutral-900 bg-black flex flex-col justify-between transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div>
          {/* Branded Logo Container */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-900">
            {!isCollapsed && (
              <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-white via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
                CODEPULSE
              </span>
            )}
            {isCollapsed && (
              <span className="text-lg font-bold tracking-wider text-white mx-auto">
                CP
              </span>
            )}
            {!isCollapsed && (
              <button 
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>

          {isCollapsed && (
            <div className="flex justify-center py-4 border-b border-neutral-900/60">
              <button 
                onClick={() => setIsCollapsed(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors"
              >
                <Menu size={18} />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mt-6 px-4 space-y-2">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "analytics", label: "Repo Analytics", icon: Code2 },
              { id: "prs", label: "Pull Requests", icon: GitPullRequest },
              { id: "contributors", label: "Contributors", icon: Users },
              { id: "security", label: "Security Health", icon: ShieldAlert },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                    isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                  } ${
                    activeTab === item.id
                      ? "bg-white text-black font-semibold shadow-lg"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                  }`}
                >
                  <Icon size={18} />
                  {!isCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer info & Logout */}
        <div className="p-4 border-t border-neutral-900 space-y-4">
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center px-0" : "px-2"}`}>
            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-neutral-300 border border-neutral-700 shrink-0">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate text-neutral-200">{user?.name || "Developer"}</p>
                <p className="text-xs text-neutral-500 truncate">{user?.email || "developer@codepulse.io"}</p>
              </div>
            )}
          </div>
          
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Sign Out" : undefined}
            className={`w-full flex items-center text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-all duration-200 ${
              isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
            }`}
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="h-20 border-b border-neutral-900 px-10 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Search repository, issues, commits..."
              className="w-full pl-11 pr-4 py-2.5 bg-neutral-900/60 border border-neutral-800 rounded-full text-sm placeholder:text-neutral-500 focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full" />
            </button>
            
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-full hover:bg-neutral-200 transition-colors shadow-md">
              <Plus size={16} />
              Link Repository
            </button>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8 flex-1">
          {activeTab === "overview" && (
            <>
              {/* Top Greeting */}
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name || "Developer"}</h1>
                <p className="text-neutral-400">Here's your repository analytics pulse for today.</p>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-black border border-neutral-900 p-6 rounded-2xl flex flex-col justify-between h-36 hover:border-neutral-700 transition-all duration-300">
                      <div className="flex items-center justify-between text-neutral-400">
                        <span className="text-sm font-medium">{stat.name}</span>
                        <Icon size={18} className="text-neutral-500" />
                      </div>
                      <div className="mt-4 flex flex-col">
                        <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
                        <span className={`text-xs mt-1 font-medium ${stat.changeType === "positive" ? "text-emerald-400" : "text-neutral-500"}`}>
                          {stat.change || stat.sub}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lower Section Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="bg-black border border-neutral-900 rounded-2xl p-6 lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">Recent Commit Activity</h2>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <GitBranch size={12} />
                      CodePulse-App
                    </span>
                  </div>

                  <div className="space-y-4">
                    {recentCommits.map((commit) => (
                      <div key={commit.id} className="flex items-center justify-between py-3 border-b border-neutral-900/60 last:border-b-0 hover:bg-neutral-900/20 px-2 rounded-xl transition-colors">
                        <div className="flex items-center gap-4 overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center font-bold text-xs text-neutral-400 border border-neutral-800">
                            {commit.author[0]}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate text-neutral-200">{commit.message}</p>
                            <p className="text-xs text-neutral-500">{commit.author} • {commit.time}</p>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 shrink-0 ml-4">
                          {commit.hash}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Alerts overview */}
                <div className="bg-black border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between h-full">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold">Security Alerts</h2>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        {securityAlerts.filter(a => a.status === "open").length} active
                      </span>
                    </div>

                    <div className="space-y-4">
                      {securityAlerts.map((alert) => (
                        <div key={alert.id} className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold font-mono">{alert.dependency}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                              alert.severity === "High" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                            }`}>
                              {alert.severity}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 leading-relaxed">{alert.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab("security")}
                    className="w-full text-center py-3 bg-neutral-900 hover:bg-neutral-800 transition-colors border border-neutral-800 text-sm font-semibold rounded-xl mt-6"
                  >
                    View All Vulnerabilities
                  </button>
                </div>
              </div>
            </>
          )}

          {activeTab === "analytics" && (
            <div className="bg-black border border-neutral-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
              <Code2 size={48} className="text-neutral-500" />
              <h2 className="text-xl font-bold">Repository Analytics</h2>
              <p className="text-neutral-400 max-w-md">Detailed visualization of codebase velocity, code frequency, and duplication metrics will be shown here.</p>
            </div>
          )}

          {activeTab === "prs" && (
            <div className="bg-black border border-neutral-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
              <GitPullRequest size={48} className="text-neutral-500" />
              <h2 className="text-xl font-bold">Pull Requests</h2>
              <p className="text-neutral-400 max-w-md">Monitor pull request cycle time, review coverage, and approval bottlenecks.</p>
            </div>
          )}

          {activeTab === "contributors" && (
            <div className="bg-black border border-neutral-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
              <Users size={48} className="text-neutral-500" />
              <h2 className="text-xl font-bold">Contributor Insights</h2>
              <p className="text-neutral-400 max-w-md">Developer activity metrics, contribution charts, and commit trends.</p>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-black border border-neutral-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
              <ShieldAlert size={48} className="text-neutral-500" />
              <h2 className="text-xl font-bold">Security Diagnostics</h2>
              <p className="text-neutral-400 max-w-md">Continuous vulnerability scanning, license compliance, and secrets detection stats.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
