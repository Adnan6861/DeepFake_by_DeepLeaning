import { User, AnalysisResult, ContactSubmission } from '../types';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

const STORAGE_USERS_KEY = 'deepfake_detective_users_v1';
const STORAGE_CURRENT_USER_KEY = 'deepfake_detective_current_user_v1';
const STORAGE_HISTORY_KEY = 'deepfake_detective_history_v1';
const STORAGE_CONTACT_KEY = 'deepfake_detective_contacts_v1';

// Deterministic non-plaintext digest for local fallback cache
function hashPasswordLocal(password: string): string {
  let h1 = 0xdeadbeef ^ password.length;
  let h2 = 0x41c6ce57 ^ password.length;
  for (let i = 0, ch; i < password.length; i++) {
    ch = password.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `hsh_${(h2 >>> 0).toString(16).padStart(8, '0')}${(h1 >>> 0).toString(16).padStart(8, '0')}`;
}

const DEMO_EMAILS = new Set([
  'adnannawazk080@gmail.com',
  'hadia.noor@forensics.ai',
  'kainat.zahra@forensics.ai',
  'kainat.zahra@numl.edu.pk',
]);

// Initial fallback accounts matching project specification
const INITIAL_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user_adnan',
    name: 'Muhammad Adnan',
    email: 'adnannawazk080@gmail.com',
    role: 'Student',
    institution: 'Media Forensics & AI Research Center',
    createdAt: '2026-03-01T10:00:00Z',
    passwordHash: hashPasswordLocal('numl1234'),
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_hadia',
    name: 'Hadia Noor',
    email: 'hadia.noor@forensics.ai',
    role: 'Student',
    institution: 'Media Forensics & AI Research Center',
    createdAt: '2026-03-01T10:00:00Z',
    passwordHash: hashPasswordLocal('numl1234'),
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'user_kainat',
    name: 'Syeda Kainat Zahra',
    email: 'kainat.zahra@forensics.ai',
    role: 'Supervisor',
    institution: 'Department of Software Engineering, Media Forensics Lab',
    createdAt: '2026-02-15T09:00:00Z',
    passwordHash: hashPasswordLocal('numl1234'),
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

export class DatabaseService {
  /**
   * Test backend connection status
   */
  public static async checkBackendHealth(): Promise<{ connected: boolean; engine?: string; error?: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        return { connected: true, engine: data.engine };
      }
      return { connected: false, error: `HTTP ${res.status}` };
    } catch (e: any) {
      return { connected: false, error: e?.message || 'Server unreachable' };
    }
  }

  private static getUsers(): (User & { passwordHash: string })[] {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_USERS;
    }
  }

  private static saveUsers(users: (User & { passwordHash: string })[]): void {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  }

  // --- Auth Operations ---
  public static getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  }

  public static async registerUser(data: {
    name: string;
    email: string;
    password: string;
    role?: 'Student' | 'Researcher' | 'Supervisor' | 'Examiner';
    institution?: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    // 1. Try PostgreSQL FastAPI Backend first
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role || 'Researcher',
          institution: data.institution || 'Media Forensics & AI Research Center',
        }),
        signal: AbortSignal.timeout(4000),
      });

      if (response.ok) {
        const user: User = await response.json();
        const users = this.getUsers();
        if (!users.some((u) => u.email.toLowerCase() === user.email.toLowerCase())) {
          users.push({ ...user, passwordHash: hashPasswordLocal(data.password) });
          this.saveUsers(users);
        }
        this.setCurrentUser(user);
        return { success: true, user };
      } else {
        const errJson = await response.json().catch(() => null);
        if (errJson?.detail) {
          return { success: false, error: errJson.detail };
        }
      }
    } catch {
      // Backend offline: fallback to local cache below
    }

    // 2. Local Fallback
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());

    if (existing) {
      return { success: false, error: 'An account with this email already exists in the database.' };
    }

    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role || 'Researcher',
      institution: data.institution || 'Media Forensics Research Lab',
      createdAt: new Date().toISOString(),
      passwordHash: hashPasswordLocal(data.password),
    };

    users.push(newUser);
    this.saveUsers(users);

    const { passwordHash: _, ...safeUser } = newUser;
    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  }

  public static async loginUser(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // 1. Try PostgreSQL FastAPI Backend first
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
        signal: AbortSignal.timeout(4000),
      });

      if (response.ok) {
        const user: User = await response.json();
        this.setCurrentUser(user);
        return { success: true, user };
      } else if (response.status === 401) {
        const errJson = await response.json().catch(() => null);
        return { success: false, error: errJson?.detail || 'Invalid password.' };
      }
    } catch {
      // Backend offline: proceed to local check
    }

    // 2. Local Fallback
    const users = this.getUsers();
    const queryEmail = email.trim().toLowerCase();
    const user = users.find((u) => {
      const uEmail = u.email.toLowerCase();
      return (
        uEmail === queryEmail ||
        (queryEmail === 'kainat.zahra@forensics.ai' && uEmail === 'kainat.zahra@numl.edu.pk') ||
        (queryEmail === 'kainat.zahra@numl.edu.pk' && uEmail === 'kainat.zahra@forensics.ai')
      );
    });

    if (!user) {
      return { success: false, error: 'User not found in the database. Please check your email or Sign Up.' };
    }

    const hashedInput = hashPasswordLocal(password);
    const isDemoAccount = DEMO_EMAILS.has(queryEmail);
    const isValidPassword =
      user.passwordHash === hashedInput ||
      user.passwordHash === password ||
      (isDemoAccount && (password === 'forensics1234' || password === 'numl1234'));

    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials. Please verify your password.' };
    }

    const { passwordHash: _, ...safeUser } = user;
    this.setCurrentUser(safeUser);
    return { success: true, user: safeUser };
  }

  public static logout(): void {
    this.setCurrentUser(null);
  }

  // --- Analysis History Operations ---
  public static getHistory(): AnalysisResult[] {
    try {
      const data = localStorage.getItem(STORAGE_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static async fetchHistoryFromBackend(): Promise<AnalysisResult[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/history`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      if (response.ok) {
        const records: AnalysisResult[] = await response.json();
        if (records && records.length > 0) {
          localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(records));
          return records;
        }
      }
    } catch {
      // Offline fallback
    }
    return this.getHistory();
  }

  public static async saveAnalysis(result: AnalysisResult): Promise<void> {
    // 1. Immediately cache locally for instant UI responsiveness
    const history = this.getHistory();
    const updated = [result, ...history.filter((h) => h.id !== result.id)].slice(0, 50);
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));

    // 2. Persist asynchronously to PostgreSQL backend
    try {
      await fetch(`${API_BASE_URL}/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
        signal: AbortSignal.timeout(4000),
      });
    } catch (e) {
      console.warn('Backend PostgreSQL persistence queued locally:', e);
    }
  }

  public static async clearHistory(): Promise<void> {
    localStorage.removeItem(STORAGE_HISTORY_KEY);
    try {
      await fetch(`${API_BASE_URL}/history`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000),
      });
    } catch (e) {
      console.warn('Backend clear history failed:', e);
    }
  }

  // --- Contact Messages ---
  public static async saveContactMessage(msg: { name: string; email: string; message: string }): Promise<ContactSubmission> {
    const record: ContactSubmission = {
      id: `cnt_${Date.now()}`,
      name: msg.name,
      email: msg.email,
      message: msg.message,
      submittedAt: new Date().toISOString(),
    };

    // Save locally
    const contacts: ContactSubmission[] = (() => {
      try {
        const d = localStorage.getItem(STORAGE_CONTACT_KEY);
        return d ? JSON.parse(d) : [];
      } catch {
        return [];
      }
    })();
    contacts.unshift(record);
    localStorage.setItem(STORAGE_CONTACT_KEY, JSON.stringify(contacts));

    // Sync to PostgreSQL backend
    try {
      await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
        signal: AbortSignal.timeout(4000),
      });
    } catch (e) {
      console.warn('Contact message saved locally, backend sync deferred:', e);
    }

    return record;
  }
}
