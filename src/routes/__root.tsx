import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Shell } from "@/components/shell/Shell";
import { RbacProvider } from "@/lib/rbac";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="grid-bg flex min-h-screen items-center justify-center bg-background px-4">
      <div className="panel panel-glow max-w-md p-8 text-center">
        <div className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted-foreground">SIGNAL · LOST</div>
        <h1 className="mt-2 text-7xl font-semibold text-foreground text-glow">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">Module out of reach. Returning to command.</p>
        <Link to="/" className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="grid-bg flex min-h-screen items-center justify-center bg-background px-4">
      <div className="panel max-w-md p-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">Subsystem fault</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AEGIS OS — Enterprise Command Center" },
      { name: "description", content: "Ultra-futuristic 7D enterprise operating system: 101 modules across observability, AI, commerce, security, and infrastructure." },
      { name: "theme-color", content: "#0A0F1C" },
      { property: "og:title", content: "AEGIS OS — Enterprise Command Center" },
      { property: "og:description", content: "Mission-control class enterprise UI: Palantir × Datadog × Tesla." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <RbacProvider>
        <Shell />
        <Toaster />
      </RbacProvider>
    </QueryClientProvider>
  );
}
