// ============================================================
// DEFAULT AUTH SEED + ROLE INITIALIZATION
// One-time bootstrap. Idempotent. Frontend-only auth layer.
//
// Security notes:
// - Passwords are NEVER stored in plaintext anywhere in the bundle
//   or in localStorage. Only SHA-256(salt:email:password) digests
//   are embedded so the client can verify credentials offline.
// - Seeded entries are immutable: the seeder only writes the role
//   index once (idempotent guard) and never overwrites accounts.
// - When a real backend (Lovable Cloud) is wired in, replace
//   `verifySeededCredentials` with a server call; the rest of the
//   auth flow stays the same.
// ============================================================

export type SeedRole = 'SUPER_ADMIN' | 'RESELLER' | 'AUTHOR' | 'USER';
export type AuthRole = 'user' | 'admin' | 'reseller';

export interface SeedUser {
  email: string;
  role: AuthRole;
  tier: SeedRole;
  hash: string; // SHA-256(SEED_SALT:email:password)
}

const SEED_SALT = 'SaaSHub::v1::auth-seed';
const SEED_FLAG_KEY = 'saashub_seed_v1';
const ROLES_KEY = 'saashub_roles_v1';

// Pre-hashed seed table (passwords never appear in source).
export const SEED_USERS: SeedUser[] = [
  { email: 'saasvala@gmail.com', role: 'admin',    tier: 'SUPER_ADMIN', hash: '1719f7241d482ba734efb0d2c1d8d8bed0426e8566a6bd21a5e17791f1f98461' },
  { email: 'reseller@gmail.com', role: 'reseller', tier: 'RESELLER',    hash: '5b7fd5ed47d5275cd9a639980c31b1bee2da8a836b2cfaeedb85d35d3e2e8eea' },
  { email: 'author@gmail.com',   role: 'user',     tier: 'AUTHOR',      hash: '68f69115d6bc8b4ec667614de711781ee8c185713672f9808018acf34fe88a81' },
  { email: 'user@gmail.com',     role: 'user',     tier: 'USER',        hash: '15a86f42ea4d7d4c6e7b6753bf71ee32e5f9913618d51b0c3723d3a4782878be' },
];

export const ROLE_PERMISSIONS: Record<SeedRole, string[]> = {
  SUPER_ADMIN: [
    'system:full', 'boss:dashboard', 'ai:controls', 'billing:manage',
    'reseller:manage', 'franchise:manage', 'seo:controls',
    'telemetry:read', 'monitoring:read', 'settings:manage',
  ],
  RESELLER: [
    'reseller:dashboard', 'commissions:read', 'referrals:manage',
    'subscriptions:manage', 'marketing:assets', 'clients:manage',
  ],
  AUTHOR: [
    'content:create', 'blog:manage', 'seo:content',
    'media:upload', 'analytics:limited',
  ],
  USER: [
    'marketplace:browse', 'subscriptions:self', 'purchases:self',
    'support:chat', 'profile:manage',
  ],
};

export const ROLE_HOME: Record<SeedRole, string> = {
  SUPER_ADMIN: '/admin',
  RESELLER:    '/reseller/dashboard',
  AUTHOR:      '/author/dashboard',
  USER:        '/dashboard',
};

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function findSeed(email: string): SeedUser | undefined {
  const e = email.trim().toLowerCase();
  return SEED_USERS.find(s => s.email === e);
}

export async function verifySeededCredentials(
  email: string,
  password: string,
): Promise<SeedUser | null> {
  const seed = findSeed(email);
  if (!seed) return null;
  const digest = await sha256Hex(`${SEED_SALT}:${seed.email}:${password}`);
  return digest === seed.hash ? seed : null;
}

// Idempotent bootstrap: writes the roles index once and marks the
// seed flag so subsequent boots skip work. Never overwrites existing
// accounts or session state.
export function bootstrapSeed(): void {
  try {
    if (localStorage.getItem(SEED_FLAG_KEY) === '1') return;
    if (!localStorage.getItem(ROLES_KEY)) {
      const roles = (Object.keys(ROLE_PERMISSIONS) as SeedRole[]).map(name => ({
        id: `role_${name.toLowerCase()}`,
        name,
        permissions: ROLE_PERMISSIONS[name],
      }));
      localStorage.setItem(ROLES_KEY, JSON.stringify(roles));
    }
    localStorage.setItem(SEED_FLAG_KEY, '1');
  } catch {
    // localStorage may be unavailable (SSR / private mode) — fail safe.
  }
}
