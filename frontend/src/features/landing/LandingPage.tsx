import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Code2, Zap, Activity, GitBranch, GitPullRequest, Shield, BarChart3, Database } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight">CodePulse</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#ai" className="hover:text-foreground transition-colors">AI Insights</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Log in
            </Link>
            <Link to="/register" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full hover:bg-foreground/90 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/20 via-background to-background pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 border border-border/50">
              <Zap className="h-4 w-4" /> CodePulse 2.0 is now live
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            The intelligence layer for your codebase.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Get intelligent insights, AI-powered code reviews, and deep analytics into your team's velocity and code health.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-4"
          >
            <Link to="/register" className="flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform">
              Get Started <ChevronRight className="h-4 w-4" />
            </Link>
            <a href="#demo" className="flex items-center gap-2 px-8 py-4 rounded-full font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
              View Demo
            </a>
          </motion.div>
        </div>
      </section>

      {/* Product Showcase Abstract */}
      <section className="px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-3xl border border-border/50 bg-secondary/30 backdrop-blur-sm p-4 md:p-8 aspect-video relative overflow-hidden flex items-center justify-center shadow-2xl"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/10 to-transparent pointer-events-none" />
             <div className="w-full h-full border border-border/40 rounded-2xl bg-background shadow-lg flex flex-col overflow-hidden">
               {/* Mock Dashboard Header */}
               <div className="h-12 border-b border-border/50 flex items-center px-4 gap-4">
                 <div className="flex gap-1.5">
                   <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                   <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                   <div className="h-3 w-3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                 </div>
               </div>
               {/* Mock Dashboard Content */}
               <div className="flex-1 p-6 flex gap-6">
                 <div className="w-64 border border-border/50 rounded-xl p-4 hidden md:flex flex-col gap-4">
                   <div className="h-4 w-24 bg-secondary rounded" />
                   <div className="h-4 w-32 bg-secondary rounded" />
                   <div className="h-4 w-20 bg-secondary rounded" />
                 </div>
                 <div className="flex-1 flex flex-col gap-6">
                   <div className="h-32 border border-border/50 rounded-xl bg-secondary/50 p-6 flex items-end">
                     <div className="h-1/2 w-8 bg-foreground/20 rounded-t mr-2" />
                     <div className="h-3/4 w-8 bg-foreground/40 rounded-t mr-2" />
                     <div className="h-full w-8 bg-foreground/60 rounded-t mr-2" />
                     <div className="h-2/3 w-8 bg-foreground/80 rounded-t" />
                   </div>
                   <div className="flex-1 border border-border/50 rounded-xl bg-secondary/20 p-6" />
                 </div>
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-32 bg-secondary/30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to ship faster.</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">CodePulse gives you the full picture of your engineering team's performance and project health.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<GitPullRequest className="h-6 w-6" />}
              title="GitHub Integration"
              description="Connect your repositories in seconds and get instant analytics on pull requests and commits."
            />
            <FeatureCard 
              icon={<Shield className="h-6 w-6" />}
              title="Security Alerts"
              description="Automatically scan dependencies for vulnerabilities and get actionable fixes."
            />
            <FeatureCard 
              icon={<Database className="h-6 w-6" />}
              title="Dependency Health"
              description="Keep track of outdated packages and maintain a healthy dependency tree."
            />
            <FeatureCard 
              icon={<BarChart3 className="h-6 w-6" />}
              title="Contributor Analytics"
              description="Understand who is shipping what, and identify bottlenecks in your review process."
            />
            <FeatureCard 
              icon={<GitBranch className="h-6 w-6" />}
              title="PR Velocity"
              description="Track how long it takes for code to go from first commit to deployed in production."
            />
            <FeatureCard 
              icon={<Code2 className="h-6 w-6" />}
              title="Code Quality"
              description="Monitor test coverage, code complexity, and technical debt over time."
            />
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section id="ai" className="py-32 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">AI-powered code reviews.</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Stop wasting time reading boilerplate. Our AI summarizes pull requests, catches potential bugs before they merge, and suggests architectural improvements based on your codebase history.
            </p>
            <ul className="space-y-4">
              {['Automated PR summaries', 'Bug detection & security scanning', 'Context-aware suggestions'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-foreground flex items-center justify-center">
                    <Zap className="h-3 w-3 text-background" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full">
            <div className="rounded-2xl border border-border p-6 bg-secondary/50 shadow-xl">
              <div className="space-y-4">
                <div className="h-4 w-1/3 bg-background rounded" />
                <div className="h-4 w-3/4 bg-background rounded" />
                <div className="h-4 w-2/3 bg-background rounded" />
                <div className="p-4 rounded-xl bg-background border border-border mt-6">
                  <p className="text-sm font-medium mb-2">✨ AI Suggestion</p>
                  <p className="text-sm text-muted-foreground">Consider extracting this logic into a custom hook to avoid re-renders when the parent component updates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <span className="font-bold text-lg">CodePulse</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Twitter</a>
            <a href="#" className="hover:text-foreground">GitHub</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-3xl border border-border/50 bg-background hover:shadow-xl transition-shadow">
      <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center mb-6 text-foreground">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
