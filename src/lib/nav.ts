import {
  Activity, Globe2, Search, BarChart3, Bell, ScrollText, Shield, Lock, Smartphone,
  LineChart, Store, Package, CreditCard, Wallet, KeyRound, Users2, Building2,
  PenLine, Handshake, Megaphone, Layers3, Boxes, FileText, UserCircle, ShoppingCart,
  Target, TrendingUp, LifeBuoy, MessageSquare, HeartPulse, Rocket, MessagesSquare,
  Mail, Phone, BookOpen, BrainCircuit, Plug, Wand2, Bot, Cpu, Workflow, Terminal,
  Server, Mic2, HelpCircle, Hammer, Zap, Eye, Logs, BugPlay, AppWindow, Smartphone as Apk,
  PlayCircle, GitBranch, GitMerge, CloudUpload, Network, Database, FolderTree, PieChart,
  HardDrive, Cloud, Globe, Gauge, ListTree, Webhook, Archive, ShieldAlert, MapPinned,
  MonitorSmartphone, Briefcase, BadgeDollarSign, Truck, Factory, KanbanSquare, ClipboardList,
  NotebookText, UserSquare, Coins, Settings, Scale, Gavel, Building, Plug2, Radio, Radar,
  Router as RouterIcon, Palette, LayoutDashboard, FileBarChart, GaugeCircle, Headset,
  SearchCheck, UserCog, Star, Code2, Library,
  // HR / People Hub
  CalendarCheck, CalendarDays, FileBadge, Award, UserPlus, Files,
  // Campaign Compass
  Vote, MapPin, Users, Megaphone as Bullhorn, Video, Car, Sparkles, MessageCircle,
  Newspaper, BadgeCheck, Crosshair, Camera, Truck as VanIcon, ClipboardCheck,
  Flag, Trophy, Banknote, BarChart, Tv2, MapPinned as GeoIcon, Map, Component,
  Layers, Workflow as FlowIcon, BookMarked, FileSpreadsheet, Compass, Wallet as Money,
  Building2 as College, GraduationCap, ShieldCheck, Boxes as Stack, ChartBar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  id: number;
  title: string;
  clone: string;
  path: string;
  icon: LucideIcon;
  built?: boolean;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Command",
    items: [
      { id: 1, title: "Boss Panel", clone: "Palantir + Datadog", path: "/", icon: LayoutDashboard, built: true },
      { id: 2, title: "Executive War Room", clone: "Palantir Gotham", path: "/war-room", icon: Globe2, built: true },
      { id: 3, title: "Global Search", clone: "Raycast", path: "/search", icon: Search, built: true },
      { id: 80, title: "Global Settings", clone: "Windows Admin Center", path: "/settings", icon: Settings },
      { id: 87, title: "Centralized Router", clone: "Next.js App Router", path: "/router", icon: RouterIcon },
    ],
  },
  {
    label: "Observability",
    items: [
      { id: 4, title: "Analytics Manager", clone: "Power BI + Tableau", path: "/analytics", icon: BarChart3, built: true },
      { id: 5, title: "Notification Manager", clone: "PagerDuty", path: "/notifications", icon: Bell },
      { id: 6, title: "Audit Logs", clone: "Splunk", path: "/audit", icon: ScrollText },
      { id: 10, title: "Monitoring System", clone: "Datadog", path: "/monitoring", icon: Activity, built: true },
      { id: 49, title: "Realtime Logs", clone: "Kibana", path: "/logs", icon: Logs },
      { id: 50, title: "Crash Monitoring", clone: "Sentry", path: "/crashes", icon: BugPlay },
      { id: 60, title: "App Analytics", clone: "Firebase Analytics", path: "/app-analytics", icon: PieChart },
      { id: 69, title: "Geo Monitoring", clone: "Azure Maps", path: "/geo", icon: MapPinned },
      { id: 90, title: "Enterprise Reporting", clone: "Crystal Reports", path: "/reporting", icon: FileBarChart },
      { id: 91, title: "Monitoring Core", clone: "New Relic", path: "/monitoring-core", icon: GaugeCircle },
    ],
  },
  {
    label: "Security & Identity",
    items: [
      { id: 7, title: "Security Manager", clone: "Cloudflare Zero Trust", path: "/security", icon: Shield, built: true },
      { id: 8, title: "Auth / RBAC", clone: "Auth0 + Clerk", path: "/auth", icon: Lock },
      { id: 9, title: "Session / Devices", clone: "Microsoft Intune", path: "/devices", icon: Smartphone },
      { id: 68, title: "Fraud / Risk", clone: "Darktrace", path: "/fraud", icon: ShieldAlert },
      { id: 70, title: "Remote Access", clone: "TeamViewer Tensor", path: "/remote", icon: MonitorSmartphone },
      { id: 83, title: "Multi-Tenant Engine", clone: "Clerk Orgs", path: "/tenants", icon: Building },
    ],
  },
  {
    label: "Commerce",
    items: [
      { id: 11, title: "Marketplace", clone: "CodeCanyon", path: "/marketplace", icon: Store, built: true },
      { id: 12, title: "Product Manager", clone: "Shopify Admin", path: "/products", icon: Package },
      { id: 13, title: "Subscriptions", clone: "Stripe Billing", path: "/billing", icon: CreditCard },
      { id: 14, title: "Payments", clone: "Stripe", path: "/payments", icon: Wallet },
      { id: 15, title: "License Manager", clone: "Gumroad License", path: "/licenses", icon: KeyRound },
      { id: 23, title: "Invoice / Books", clone: "Zoho Books", path: "/books", icon: FileText },
      { id: 25, title: "Order Management", clone: "Shopify Orders", path: "/orders", icon: ShoppingCart },
      { id: 79, title: "Finance System", clone: "NetSuite", path: "/finance", icon: Coins },
    ],
  },
  {
    label: "Partners",
    items: [
      { id: 16, title: "Reseller System", clone: "PartnerStack", path: "/resellers", icon: Handshake },
      { id: 17, title: "Franchise", clone: "GoHighLevel", path: "/franchise", icon: Building2 },
      { id: 18, title: "Author System", clone: "Gumroad Creator", path: "/authors", icon: PenLine },
      { id: 19, title: "Affiliate", clone: "Impact", path: "/affiliates", icon: Megaphone },
      { id: 20, title: "Influencer", clone: "Upfluence", path: "/influencers", icon: Star },
      { id: 21, title: "White Label", clone: "GoHighLevel", path: "/white-label", icon: Layers3 },
      { id: 22, title: "SaaS Tenants", clone: "Shopify Partners", path: "/saas", icon: Boxes },
    ],
  },
  {
    label: "Customer",
    items: [
      { id: 24, title: "Customer Mgmt", clone: "Salesforce", path: "/customers", icon: UserCircle },
      { id: 26, title: "CRM & Leads", clone: "Salesforce CRM", path: "/crm", icon: Target, built: true },
      { id: 27, title: "Sales", clone: "HubSpot", path: "/sales", icon: TrendingUp },
      { id: 28, title: "Support", clone: "Zendesk", path: "/support", icon: LifeBuoy },
      { id: 29, title: "Ticket + Chat AI", clone: "Freshdesk", path: "/tickets", icon: MessageSquare },
      { id: 30, title: "Customer Success", clone: "Gainsight", path: "/success", icon: HeartPulse },
      { id: 31, title: "Onboarding", clone: "Appcues", path: "/onboarding", icon: Rocket },
    ],
  },
  {
    label: "Communications",
    items: [
      { id: 32, title: "Comms Hub", clone: "Slack", path: "/comms", icon: MessagesSquare },
      { id: 33, title: "Email System", clone: "Mailchimp", path: "/email", icon: Mail },
      { id: 34, title: "WhatsApp / SMS", clone: "Twilio", path: "/sms", icon: Phone },
      { id: 35, title: "Knowledge Base", clone: "Intercom", path: "/knowledge", icon: BookOpen },
    ],
  },
  {
    label: "AI",
    items: [
      { id: 36, title: "Vala AI", clone: "OpenAI Enterprise", path: "/ai", icon: BrainCircuit, built: true },
      { id: 37, title: "AI API Manager", clone: "OpenRouter", path: "/ai/api", icon: Plug },
      { id: 38, title: "AI Builder", clone: "Retool AI", path: "/ai/builder", icon: Wand2 },
      { id: 39, title: "AI Bot Market", clone: "GPT Store", path: "/ai/bots", icon: Bot },
      { id: 40, title: "AI Agents", clone: "AutoGPT", path: "/ai/agents", icon: Cpu },
      { id: 41, title: "AI Workflows", clone: "n8n", path: "/ai/workflows", icon: Workflow },
      { id: 42, title: "Prompt Manager", clone: "OpenWebUI", path: "/ai/prompts", icon: Terminal },
      { id: 43, title: "Model Manager", clone: "Ollama", path: "/ai/models", icon: Server },
      { id: 44, title: "Voice Assistant", clone: "ElevenLabs", path: "/ai/voice", icon: Mic2 },
      { id: 45, title: "Support Assistant", clone: "Intercom AI", path: "/ai/support", icon: HelpCircle },
    ],
  },
  {
    label: "Builder & DevOps",
    items: [
      { id: 46, title: "Tool Builder", clone: "Retool", path: "/builder", icon: Hammer },
      { id: 47, title: "Automation", clone: "Zapier", path: "/automation", icon: Zap },
      { id: 48, title: "Demo System", clone: "Vercel Preview", path: "/demos", icon: Eye },
      { id: 51, title: "App Builder", clone: "Bubble + Lovable", path: "/app-builder", icon: AppWindow },
      { id: 52, title: "APK Installer", clone: "Firebase Dist", path: "/apk", icon: Apk },
      { id: 53, title: "Play Console", clone: "Google Play", path: "/play", icon: PlayCircle },
      { id: 54, title: "Git Mgmt", clone: "GitHub", path: "/git", icon: GitBranch },
      { id: 55, title: "CI/CD", clone: "GitLab CI", path: "/ci", icon: GitMerge },
      { id: 56, title: "Deployments", clone: "Vercel", path: "/deploy", icon: CloudUpload },
      { id: 57, title: "API Gateway", clone: "Postman", path: "/api", icon: Network },
      { id: 58, title: "Database", clone: "Supabase Studio", path: "/db", icon: Database },
      { id: 59, title: "File Storage", clone: "Google Drive", path: "/files", icon: FolderTree },
    ],
  },
  {
    label: "Infrastructure",
    items: [
      { id: 61, title: "Server Manager", clone: "DigitalOcean", path: "/servers", icon: HardDrive, built: true },
      { id: 62, title: "Cloud Infra", clone: "AWS Console", path: "/cloud", icon: Cloud },
      { id: 63, title: "Domain / DNS", clone: "Cloudflare", path: "/dns", icon: Globe },
      { id: 64, title: "CDN / Cache", clone: "Cloudflare CDN", path: "/cdn", icon: Gauge },
      { id: 65, title: "Queue / Events", clone: "Kafka", path: "/queue", icon: ListTree },
      { id: 66, title: "Webhooks", clone: "Svix", path: "/webhooks", icon: Webhook },
      { id: 67, title: "Backup", clone: "Veeam", path: "/backup", icon: Archive },
      { id: 84, title: "Enterprise API", clone: "MuleSoft", path: "/enterprise-api", icon: Plug2 },
      { id: 85, title: "Event Bus", clone: "RabbitMQ", path: "/event-bus", icon: Radio },
      { id: 86, title: "Realtime Engine", clone: "Pusher", path: "/realtime", icon: Radar },
    ],
  },
  {
    label: "Operations",
    items: [
      { id: 71, title: "HR / Employees", clone: "Workday", path: "/hr", icon: Users2 },
      { id: 72, title: "Payroll", clone: "ADP", path: "/payroll", icon: BadgeDollarSign },
      { id: 73, title: "Assets", clone: "SAP Asset", path: "/assets", icon: Briefcase },
      { id: 74, title: "Vendors", clone: "SAP Ariba", path: "/vendors", icon: Truck },
      { id: 75, title: "Tasks", clone: "Jira + ClickUp", path: "/tasks", icon: KanbanSquare },
      { id: 76, title: "Projects", clone: "Monday.com", path: "/projects", icon: ClipboardList },
      { id: 77, title: "Documents", clone: "Notion", path: "/docs", icon: NotebookText },
      { id: 78, title: "Client Panel", clone: "WHMCS", path: "/clients", icon: UserSquare },
    ],
  },
  {
    label: "Legal & Design",
    items: [
      { id: 81, title: "Law & Order", clone: "Gov Case Control", path: "/law", icon: Scale },
      { id: 82, title: "Lawyer Dashboard", clone: "Legal Tracker", path: "/lawyer", icon: Gavel },
      { id: 101, title: "Legal Pro", clone: "Thomson Reuters", path: "/lawyer-pro", icon: Library },
      { id: 88, title: "Design System", clone: "Figma Enterprise", path: "/design-system", icon: Palette },
      { id: 89, title: "Dashboard Engine", clone: "Retool Dash", path: "/dash-engine", icon: Factory },
    ],
  },
  {
    label: "Portals",
    items: [
      { id: 92, title: "Support Team", clone: "Freshdesk Agent", path: "/portal/support", icon: Headset },
      { id: 93, title: "SEO Workspace", clone: "Semrush", path: "/portal/seo", icon: SearchCheck },
      { id: 94, title: "User Portal", clone: "Stripe Portal", path: "/portal/user", icon: UserCog },
      { id: 95, title: "Author Portal", clone: "Gumroad", path: "/portal/author", icon: PenLine },
      { id: 96, title: "Reseller Portal", clone: "PartnerStack", path: "/portal/reseller", icon: Handshake },
      { id: 97, title: "Franchise Portal", clone: "GoHighLevel", path: "/portal/franchise", icon: Building2 },
      { id: 98, title: "Affiliate Portal", clone: "Impact", path: "/portal/affiliate", icon: Megaphone },
      { id: 99, title: "Influencer Portal", clone: "Upfluence", path: "/portal/influencer", icon: Star },
      { id: 100, title: "Developer Portal", clone: "GitHub", path: "/portal/dev", icon: Code2 },
    ],
  },
];

export const ALL_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
