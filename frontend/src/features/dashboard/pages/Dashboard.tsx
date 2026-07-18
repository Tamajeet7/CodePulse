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
  Menu,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Star,
  GitFork,
  Info,
  X,
  ChevronDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnalyticsAPI } from "../services/analytics.api";
import { FaGithub } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // GitHub Repo State (for the Repo Analytics tab)
  const [repoInput, setRepoInput] = useState("facebook/react");
  const [repoData, setRepoData] = useState<any>(null);
  const [commits, setCommits] = useState<any[]>([]);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState("");
  const [aiActiveSubTab, setAiActiveSubTab] = useState<"review" | "release">("review");
  const [aiReviewSummary, setAiReviewSummary] = useState<string>("");
  const [aiReleaseNotes, setAiReleaseNotes] = useState<string>("");
  const [aiGenerating, setAiGenerating] = useState(false);

  // Linked Repositories & Dashboard Data
  const [linkedRepos, setLinkedRepos] = useState<any[]>([]);
  const [primaryRepo, setPrimaryRepo] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  
  // Modals & Dropdowns
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linkLoading, setLinkLoading] = useState(false);
  const [isRepoDropdownOpen, setIsRepoDropdownOpen] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);

  useEffect(() => {
    fetchLinkedRepos();
  }, []);

  useEffect(() => {
    if (primaryRepo) {
      fetchDashboardData(primaryRepo.name, primaryRepo.id);
    } else {
      setDashboardLoading(false);
    }
  }, [primaryRepo?.id]);

  useEffect(() => {
    if (primaryRepo && repoInput !== primaryRepo.name) {
      setRepoInput(primaryRepo.name);
    }
  }, [primaryRepo?.id]);

  async function fetchLinkedRepos() {
    try {
      const repos = await AnalyticsAPI.getRepositories();
      setLinkedRepos(repos);
      const primary = repos.find((r: any) => r.isPrimary) || repos[0];
      setPrimaryRepo(primary || null);
    } catch (err) {
      console.error("Failed to fetch linked repos", err);
    }
  }

  async function fetchDashboardData(repoName: string, repoId?: string, forceReanalyze: boolean = false) {
    if (!forceReanalyze) setDashboardLoading(true);
    else setIsReanalyzing(true);
    
    try {
      const data = await AnalyticsAPI.getDashboardData(repoName, repoId, forceReanalyze);
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setDashboardLoading(false);
      setIsReanalyzing(false);
    }
  }

  async function handleReanalyze() {
    if (!primaryRepo) return;
    await fetchDashboardData(primaryRepo.name, primaryRepo.id, true);
  }

  async function handleLinkRepository(e: React.FormEvent) {
    e.preventDefault();
    if (!linkInput.trim()) return;
    setLinkLoading(true);
    try {
      await AnalyticsAPI.linkRepository(linkInput);
      await fetchLinkedRepos();
      setIsLinkModalOpen(false);
      setLinkInput("");
    } catch (err) {
      console.error("Failed to link repository", err);
      alert("Failed to link repository. Check if it exists and is public.");
    } finally {
      setLinkLoading(false);
    }
  }

  async function handleSelectRepo(repoId: string) {
    setIsRepoDropdownOpen(false);
    try {
      await AnalyticsAPI.setPrimaryRepository(repoId);
      await fetchLinkedRepos();
    } catch (err) {
      console.error("Failed to set primary repo", err);
    }
  }

  // Repo Analytics Tab functions
  async function fetchGithubRepo() {
    if (!repoInput.trim()) return;
    setRepoLoading(true);
    setRepoError("");
    setRepoData(null);
    setCommits([]);
    setAiReviewSummary("");
    setAiReleaseNotes("");

    try {
      const cleanRepo = repoInput.replace(/https:\/\/github\.com\//, "").trim();
      const data = await AnalyticsAPI.fetchRepoData(cleanRepo);

      setRepoData(data.repoData);
      setCommits(data.commits);
    } catch (err: any) {
      setRepoError(err.response?.data?.message || "Failed to fetch repository metadata from backend.");
    } finally {
      setRepoLoading(false);
    }
  }

  async function generateAISummaries() {
    if (!repoData || commits.length === 0) return;
    setAiGenerating(true);
    
    try {
      const summaries = await AnalyticsAPI.analyzeRepo(repoData, commits);
      setAiReviewSummary(summaries.review);
      setAiReleaseNotes(summaries.releaseNotes);
    } catch (error) {
      console.error("Failed to generate AI summaries", error);
      setAiReviewSummary("### ❌ Generation Failed\nCould not generate AI insights.");
      setAiReleaseNotes("### ❌ Generation Failed\nCould not generate release notes.");
    } finally {
      setAiGenerating(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  // Dashboard Stats Mapping
  const stats = dashboardData ? [
    { name: "Project Health Score", value: dashboardData.stats.healthScore.value, change: dashboardData.stats.healthScore.change, changeType: dashboardData.stats.healthScore.changeType, icon: Activity },
    { name: "Active Repository", value: dashboardData.repoName, sub: "main branch", icon: Code2 },
    { name: "Open Pull Requests", value: dashboardData.stats.openPrs, change: "Live data", changeType: "neutral", icon: GitPullRequest },
    { name: "Active Contributors", value: dashboardData.stats.activeContributors, change: "Live data", changeType: "neutral", icon: Users },
  ] : [
    { name: "Project Health Score", value: "--", change: "", changeType: "neutral", icon: Activity },
    { name: "Active Repository", value: "--", sub: "None linked", icon: Code2 },
    { name: "Open Pull Requests", value: "--", change: "", changeType: "neutral", icon: GitPullRequest },
    { name: "Active Contributors", value: "--", change: "", changeType: "neutral", icon: Users },
  ];

  const recentCommits = dashboardData?.recentCommits || [];
  const securityAlerts = dashboardData?.securityAlerts || [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0A0A0A] text-white font-sans">
      
      {/* Link Repository Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0A0A0A] border border-neutral-800 rounded-2xl w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsLinkModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-2">Link GitHub Repository</h2>
            <p className="text-sm text-neutral-400 mb-6">Enter the owner and repository name to link it to your CodePulse dashboard.</p>
            <form onSubmit={handleLinkRepository} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-2">REPOSITORY NAME</label>
                <input 
                  type="text" 
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="e.g. facebook/react"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={linkLoading}
                className="w-full bg-white text-black font-semibold rounded-xl py-3 text-sm hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                {linkLoading ? "Linking..." : "Link Repository"}
              </button>
            </form>
          </div>
        </div>
      )}

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
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {/* Header */}
        <header className="h-24 border-b border-neutral-900 px-10 py-6 flex items-center justify-between bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-96 flex items-center gap-4">
            {/* Repo Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsRepoDropdownOpen(!isRepoDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
              >
                <FaGithub size={16} />
                <span className="truncate max-w-[150px]">{primaryRepo ? primaryRepo.name : "Select Repo"}</span>
                <ChevronDown size={14} className="text-neutral-500" />
              </button>
              
              {isRepoDropdownOpen && (
                <div className="absolute top-full mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-2 z-50">
                  {linkedRepos.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-neutral-500 text-center">No linked repositories</div>
                  ) : (
                    linkedRepos.map(r => (
                      <button 
                        key={r.id} 
                        onClick={() => handleSelectRepo(r.id)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-800 transition-colors flex items-center justify-between ${r.isPrimary ? "text-white font-semibold" : "text-neutral-400"}`}
                      >
                        <span className="truncate">{r.name}</span>
                        {r.isPrimary && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>}
                      </button>
                    ))
                  )}
                  <div className="border-t border-neutral-800 mt-2 pt-2 px-2">
                    <button 
                      onClick={() => { setIsRepoDropdownOpen(false); setIsLinkModalOpen(true); }}
                      className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                    >
                      <Plus size={14} /> Add Repository
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                className="w-full pl-11 pr-4 py-2.5 bg-neutral-900/60 border border-neutral-800 rounded-full text-sm placeholder:text-neutral-500 focus:outline-none focus:border-white/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-900 transition-colors relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full" />
            </button>
            
            <button 
              onClick={() => setIsLinkModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-semibold text-sm rounded-full hover:bg-neutral-200 transition-colors shadow-md"
            >
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

              {dashboardLoading ? (
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                  <RefreshCw className="animate-spin text-neutral-500" size={32} />
                </div>
              ) : !primaryRepo ? (
                 <div className="bg-black border border-neutral-900 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
                  <GitBranch size={48} className="text-neutral-600" />
                  <div>
                    <h3 className="text-lg font-bold">No Repository Linked</h3>
                    <p className="text-sm text-neutral-400 max-w-sm mt-2 mb-6">Link a GitHub repository to unlock live insights, pull request tracking, and AI health scores.</p>
                    <button 
                      onClick={() => setIsLinkModalOpen(true)}
                      className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition-colors"
                    >
                      Link Repository
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                            <span className="text-3xl font-bold tracking-tight truncate">{stat.value}</span>
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
                        <span className="text-xs text-neutral-400 flex items-center gap-1 bg-neutral-900 px-2 py-1 rounded-md">
                          <GitBranch size={12} />
                          {primaryRepo.name}
                        </span>
                      </div>

                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {recentCommits.length === 0 ? (
                           <div className="text-center py-10 text-neutral-500 text-sm">No recent commits found.</div>
                        ) : (
                          recentCommits.map((commit: any) => (
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
                              <a href={`https://github.com/${primaryRepo.name}/commit/${commit.id}`} target="_blank" rel="noreferrer" className="text-xs font-mono text-neutral-500 bg-neutral-900 hover:text-white px-2 py-1 rounded border border-neutral-800 shrink-0 ml-4 transition-colors">
                                {commit.hash}
                              </a>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Security Alerts overview */}
                    <div className="bg-black border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between h-full">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-bold">Security Alerts</h2>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${securityAlerts.length > 0 ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}>
                            {securityAlerts.filter((a: any) => a.status === "open").length} active
                          </span>
                        </div>

                        <div className="space-y-4">
                          {securityAlerts.length === 0 ? (
                             <div className="text-center py-10">
                                <ShieldAlert size={32} className="mx-auto text-emerald-500/50 mb-3" />
                                <p className="text-sm text-neutral-400">No open security issues detected.</p>
                             </div>
                          ) : (
                            securityAlerts.slice(0, 3).map((alert: any) => (
                              <div key={alert.id} className="p-4 bg-neutral-950 border border-neutral-900 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold font-mono truncate mr-2">{alert.dependency}</span>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider shrink-0 ${
                                    alert.severity === "High" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                                  }`}>
                                    {alert.severity}
                                  </span>
                                </div>
                                <p className="text-xs text-neutral-400 leading-relaxed truncate">{alert.description}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <button 
                        onClick={() => setActiveTab("security")}
                        className="w-full text-center py-3 bg-neutral-900 hover:bg-neutral-800 transition-colors border border-neutral-800 text-sm font-semibold rounded-xl mt-6"
                      >
                        View All Issues
                      </button>
                    </div>
                  </div>

                  {/* AI Health Insights & Tips Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                     {/* Calculation Explanation */}
                     <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-blue-500/20 transition-all"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                           <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500/10 rounded-xl">
                                 <Activity className="text-blue-400" size={20} />
                              </div>
                              <h3 className="font-bold text-lg">Health Score Calculation</h3>
                           </div>
                           <button 
                              onClick={handleReanalyze}
                              disabled={isReanalyzing}
                              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs font-semibold text-neutral-300 hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                           >
                              <RefreshCw size={12} className={isReanalyzing ? "animate-spin" : ""} />
                              {isReanalyzing ? "Analyzing..." : "Re-analyze"}
                           </button>
                        </div>
                        <p className="text-sm text-neutral-400 leading-relaxed relative z-10">
                           {dashboardData?.stats?.healthScore?.calculation || "Score derived from base commit volume and active contributors."}
                        </p>
                     </div>

                     {/* AI Tips */}
                     <div className="bg-neutral-950 border border-neutral-900 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-all duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-purple-500/20 transition-all"></div>
                        <div className="flex items-center gap-3 mb-5 relative z-10">
                           <div className="p-2 bg-purple-500/10 rounded-xl">
                              <Sparkles className="text-purple-400" size={20} />
                           </div>
                           <h3 className="font-bold text-lg">AI Improvement Tips</h3>
                        </div>
                        <ul className="space-y-4 relative z-10">
                           {(dashboardData?.stats?.healthScore?.tips || [
                              "Increase test coverage in your recent commits.",
                              "Resolve outstanding security alerts.",
                              "Encourage faster PR reviews to boost velocity."
                           ]).map((tip: string, idx: number) => (
                              <li key={idx} className="flex gap-4 text-sm text-neutral-400 items-start">
                                 <span className="flex items-center justify-center w-6 h-6 rounded bg-purple-500/20 text-purple-400 font-bold text-xs shrink-0 mt-0.5">0{idx + 1}</span>
                                 <span className="leading-relaxed">{tip}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Controls and Input */}
              <div className="bg-black border border-neutral-900 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <FaGithub size={24} className="text-neutral-400" />
                  <div>
                    <h2 className="text-lg font-bold">Fetch Repository Insights</h2>
                    <p className="text-sm text-neutral-400">Load a public GitHub repository to analyze activity trends and generate AI review summaries.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={repoInput}
                    onChange={(e) => setRepoInput(e.target.value)}
                    placeholder="owner/repo (e.g. facebook/react)"
                    className="flex-1 px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl text-sm placeholder:text-neutral-600 focus:outline-none focus:border-neutral-500 transition-colors"
                  />
                  <button
                    onClick={fetchGithubRepo}
                    disabled={repoLoading}
                    className="px-6 py-3 bg-white text-black font-semibold text-sm rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {repoLoading ? <RefreshCw className="animate-spin" size={16} /> : <ArrowRight size={16} />}
                    {repoLoading ? "Loading..." : "Fetch Repository"}
                  </button>
                </div>

                {repoError && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-2">
                    <Info size={16} />
                    {repoError}
                  </p>
                )}
              </div>

              {repoData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Metadata & Commits */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Repository Info Card */}
                    <div className="bg-black border border-neutral-900 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Metadata</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase">
                          Active
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold truncate">{repoData.name}</h3>
                        <p className="text-sm text-neutral-400 mt-1 line-clamp-3">{repoData.description || "No description provided."}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-neutral-950 border border-neutral-900 p-3 rounded-xl flex items-center gap-2">
                          <Star size={16} className="text-neutral-500" />
                          <div className="overflow-hidden">
                            <p className="text-xs text-neutral-500">Stars</p>
                            <p className="text-sm font-bold truncate">{repoData.stargazers_count}</p>
                          </div>
                        </div>
                        <div className="bg-neutral-950 border border-neutral-900 p-3 rounded-xl flex items-center gap-2">
                          <GitFork size={16} className="text-neutral-500" />
                          <div className="overflow-hidden">
                            <p className="text-xs text-neutral-500">Forks</p>
                            <p className="text-sm font-bold truncate">{repoData.forks_count}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Commit Feed */}
                    <div className="bg-black border border-neutral-900 p-6 rounded-2xl space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">Repository Feed</h3>
                      <div className="space-y-3">
                        {commits.map((c, i) => (
                          <div key={i} className="flex gap-3 text-xs leading-relaxed border-b border-neutral-900/60 pb-3 last:border-0 last:pb-0">
                            <div className="w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center font-bold text-[10px] border border-neutral-800 shrink-0 mt-0.5">
                              {c.commit.author.name[0]}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-semibold text-neutral-200 truncate">{c.commit.message.split("\n")[0]}</p>
                              <p className="text-neutral-500 mt-0.5">{c.commit.author.name} • {new Date(c.commit.author.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - AI Attraction Panel */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-black border border-neutral-900 rounded-2xl overflow-hidden">
                      {/* Top Header */}
                      <div className="p-6 border-b border-neutral-900 flex items-center justify-between bg-neutral-950/60">
                        <div className="flex items-center gap-3">
                          <Sparkles size={20} className="text-white" />
                          <div>
                            <h3 className="font-bold text-md">AI Insights Copilot</h3>
                            <p className="text-xs text-neutral-500">Generate structural code reviews or compile structured release documentation</p>
                          </div>
                        </div>

                        {!aiReviewSummary && !aiGenerating && (
                          <button
                            onClick={generateAISummaries}
                            className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-md"
                          >
                            <Sparkles size={14} />
                            Analyze Repository
                          </button>
                        )}
                      </div>

                      {/* AI Content Window */}
                      <div className="p-6 min-h-[350px] flex flex-col">
                        {aiGenerating ? (
                          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                            <RefreshCw className="animate-spin text-neutral-400" size={32} />
                            <div className="text-center">
                              <p className="text-sm font-semibold">Running CodePulse AI Analysis...</p>
                              <p className="text-xs text-neutral-500 mt-1">Reviewing syntax structure, security indexes, and commit delta files.</p>
                            </div>
                          </div>
                        ) : aiReviewSummary ? (
                          <div className="space-y-6">
                            {/* Toggle Sub Tabs */}
                            <div className="flex border-b border-neutral-900 pb-px">
                              <button
                                onClick={() => setAiActiveSubTab("review")}
                                className={`px-4 py-2.5 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all ${
                                  aiActiveSubTab === "review" 
                                    ? "border-white text-white" 
                                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                                }`}
                              >
                                Code Quality Review
                              </button>
                              <button
                                onClick={() => setAiActiveSubTab("release")}
                                className={`px-4 py-2.5 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all ${
                                  aiActiveSubTab === "release" 
                                    ? "border-white text-white" 
                                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                                }`}
                              >
                                Auto Release Notes
                              </button>
                            </div>

                            {/* Result Display */}
                            <div className="p-5 bg-neutral-950 border border-neutral-900 rounded-xl text-sm text-neutral-300 leading-relaxed overflow-x-auto markdown-body">
                              <ReactMarkdown>
                                {aiActiveSubTab === "review" ? aiReviewSummary : aiReleaseNotes}
                              </ReactMarkdown>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                            <Code2 size={40} className="text-neutral-600" />
                            <div>
                              <p className="text-sm font-medium text-neutral-300">Ready for Insights</p>
                              <p className="text-xs text-neutral-500 max-w-sm mt-1">Click the "Analyze Repository" button to run the CodePulse heuristics and AI summary compiler on recent commits.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!repoData && !repoLoading && (
                <div className="bg-black border border-neutral-900 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px] text-center space-y-4">
                  <FaGithub size={40} className="text-neutral-600" />
                  <div>
                    <h3 className="text-md font-bold">No Repository Loaded</h3>
                    <p className="text-xs text-neutral-500 max-w-sm mt-1">Type in a repository path above (e.g. `facebook/react`) and click fetch to see live commit analytics and trigger the AI Copilot.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "prs" && (
            <div className="bg-black border border-neutral-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
              <GitPullRequest size={48} className="text-neutral-500" />
              <h2 className="text-xl font-bold">Pull Requests</h2>
              <p className="text-neutral-400 max-w-md mb-6">Monitor pull request cycle time, review coverage, and approval bottlenecks.</p>
              
              <div className="w-full max-w-3xl space-y-4 text-left">
                {dashboardData?.stats?.openPrs === "0" ? (
                  <p className="text-center text-neutral-500">No open pull requests for {primaryRepo?.name}.</p>
                ) : (
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 text-center">
                    <p className="text-2xl font-bold text-white mb-1">{dashboardData?.stats?.openPrs || "--"}</p>
                    <p className="text-sm text-neutral-500 uppercase tracking-wider">Open Pull Requests</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "contributors" && (
            <div className="bg-black border border-neutral-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
              <Users size={48} className="text-neutral-500" />
              <h2 className="text-xl font-bold">Contributor Insights</h2>
              <p className="text-neutral-400 max-w-md mb-6">Developer activity metrics, contribution charts, and commit trends.</p>
              
              <div className="w-full max-w-3xl">
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 text-center">
                  <p className="text-2xl font-bold text-white mb-1">{dashboardData?.stats?.activeContributors || "--"}</p>
                  <p className="text-sm text-neutral-500 uppercase tracking-wider">Active Contributors</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-black border border-neutral-900 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
              <ShieldAlert size={48} className="text-neutral-500" />
              <h2 className="text-xl font-bold">Security Diagnostics</h2>
              <p className="text-neutral-400 max-w-md mb-6">Continuous vulnerability scanning, license compliance, and secrets detection stats.</p>
              
              <div className="w-full max-w-3xl text-left space-y-4">
                 {securityAlerts.length === 0 ? (
                    <div className="text-center py-10 border border-neutral-800 rounded-xl bg-neutral-950">
                      <ShieldAlert size={32} className="mx-auto text-emerald-500/50 mb-3" />
                      <p className="text-sm text-neutral-400">No open security issues detected.</p>
                    </div>
                 ) : (
                   securityAlerts.map((alert: any) => (
                    <div key={alert.id} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold font-mono">{alert.dependency}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider bg-red-500/20 text-red-400">
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-400 leading-relaxed">{alert.description}</p>
                    </div>
                   ))
                 )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
