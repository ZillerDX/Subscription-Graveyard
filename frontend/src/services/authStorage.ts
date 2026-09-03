/**
 * Client-Side Authentication & Isolated Multi-User Storage Engine
 * Enables fully functional Login, Register, Session Management, and per-user Subscriptions
 * for static GitHub Pages and client-side web application.
 */
import type { User, LoginCredentials, RegisterCredentials, AuthToken } from '../types/auth'
import type { Subscription, UserPreferences } from '../types/subscription'

interface StoredUserAccount {
  id: string
  email: string
  passwordHash: string // simple hash for local client-side verification
  created_at: string
}

const USERS_STORAGE_KEY = 'sg_user_accounts'
const ACTIVE_SESSION_KEY = 'sg_active_session'
const USER_SUBS_PREFIX = 'sg_user_subs_'

// Initial demo subscriptions for demo account or new user template
export const DEFAULT_DEMO_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    user_id: 'demo-user-id',
    name: 'Netflix Premium',
    cost: 16.99,
    billing_cycle: 'monthly',
    value_score: 4,
    daily_hours: 1.0,
    monthly_hours: 30,
    logo_key: 'netflix',
    category: 'Entertainment',
    emoji: null,
    status: 'active',
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    id: 'sub-2',
    user_id: 'demo-user-id',
    name: 'Gym Membership',
    cost: 75.00,
    billing_cycle: 'monthly',
    value_score: 1,
    daily_hours: 0.05, // ~1 hr/mo -> $75/hr Kill Zone!
    monthly_hours: 1.5,
    logo_key: null,
    category: 'Health & Fitness',
    emoji: null,
    status: 'active',
    created_at: new Date(Date.now() - 60 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 60 * 86400000).toISOString(),
  },
  {
    id: 'sub-3',
    user_id: 'demo-user-id',
    name: 'Adobe Creative Cloud',
    cost: 54.99,
    billing_cycle: 'monthly',
    value_score: 2,
    daily_hours: 0.1, // ~3 hrs/mo -> $18.33/hr Kill Zone!
    monthly_hours: 3,
    logo_key: 'adobe',
    category: 'Productivity',
    emoji: null,
    status: 'active',
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 45 * 86400000).toISOString(),
  },
  {
    id: 'sub-4',
    user_id: 'demo-user-id',
    name: 'Spotify Premium',
    cost: 10.99,
    billing_cycle: 'monthly',
    value_score: 5,
    daily_hours: 1.6, // ~50 hrs/mo -> $0.22/hr Bargain!
    monthly_hours: 50,
    logo_key: 'spotify',
    category: 'Entertainment',
    emoji: null,
    status: 'active',
    created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 90 * 86400000).toISOString(),
  },
  {
    id: 'sub-5',
    user_id: 'demo-user-id',
    name: 'ChatGPT Plus',
    cost: 20.00,
    billing_cycle: 'monthly',
    value_score: 5,
    daily_hours: 1.2, // ~36 hrs/mo -> $0.56/hr Worth every penny!
    monthly_hours: 36,
    logo_key: 'openai',
    category: 'Productivity',
    emoji: null,
    status: 'active',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    id: 'sub-6',
    user_id: 'demo-user-id',
    name: 'YouTube Premium',
    cost: 13.99,
    billing_cycle: 'monthly',
    value_score: 4,
    daily_hours: 1.3, // ~40 hrs/mo -> $0.35/hr Bargain!
    monthly_hours: 40,
    logo_key: 'youtube',
    category: 'Entertainment',
    emoji: null,
    status: 'active',
    created_at: new Date(Date.now() - 100 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 100 * 86400000).toISOString(),
  },
  {
    id: 'sub-7',
    user_id: 'demo-user-id',
    name: 'Amazon Prime',
    cost: 139.00,
    billing_cycle: 'yearly',
    value_score: 3,
    daily_hours: 0.4, // ~12 hrs/mo
    monthly_hours: 12,
    logo_key: 'amazon',
    category: 'Shopping',
    emoji: null,
    status: 'active',
    created_at: new Date(Date.now() - 150 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 150 * 86400000).toISOString(),
  },
  {
    id: 'sub-8',
    user_id: 'demo-user-id',
    name: 'Obsolete Magazine App',
    cost: 14.99,
    billing_cycle: 'monthly',
    value_score: 1,
    daily_hours: 0.02, // ~0.5 hr/mo
    monthly_hours: 0.6,
    logo_key: null,
    category: 'News & Media',
    emoji: null,
    status: 'cancelled',
    created_at: new Date(Date.now() - 200 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
]

export const DEMO_USER: User = {
  id: 'demo-user-id',
  email: 'demo@subscription-graveyard.dev',
  created_at: new Date('2025-01-01T00:00:00Z').toISOString(),
}

// Simple deterministic hash for demo client-side storage
const hashString = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return 'h_' + Math.abs(hash).toString(16)
}

export const authStorage = {
  // Get all registered accounts in local storage
  getUsers(): StoredUserAccount[] {
    const raw = localStorage.getItem(USERS_STORAGE_KEY)
    if (!raw) {
      // Initialize with default demo account
      const demoAccount: StoredUserAccount = {
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        passwordHash: hashString('demo12345'),
        created_at: DEMO_USER.created_at,
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([demoAccount]))
      // Seed demo subscriptions if not exists
      if (!localStorage.getItem(USER_SUBS_PREFIX + DEMO_USER.id)) {
        localStorage.setItem(
          USER_SUBS_PREFIX + DEMO_USER.id,
          JSON.stringify(DEFAULT_DEMO_SUBSCRIPTIONS)
        )
      }
      return [demoAccount]
    }
    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  },

  // Save users array
  saveUsers(users: StoredUserAccount[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  },

  // Register a new account
  register(credentials: RegisterCredentials): AuthToken {
    const email = credentials.email.trim().toLowerCase()
    const password = credentials.password

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.')
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long.')
    }

    const users = this.getUsers()
    const existing = users.find((u) => u.email === email)
    if (existing) {
      throw new Error('An account with this email already exists. Please sign in.')
    }

    const newUser: StoredUserAccount = {
      id: 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
      email,
      passwordHash: hashString(password),
      created_at: new Date().toISOString(),
    }

    users.push(newUser)
    this.saveUsers(users)

    // Initialize clean starter subscriptions for the new user (or clone default template with active user_id)
    const starterSubs: Subscription[] = DEFAULT_DEMO_SUBSCRIPTIONS.slice(0, 4).map((sub, idx) => ({
      ...sub,
      id: `sub-${newUser.id}-${idx + 1}`,
      user_id: newUser.id,
    }))
    localStorage.setItem(USER_SUBS_PREFIX + newUser.id, JSON.stringify(starterSubs))

    // Set active session
    const token = 'sg_token_' + newUser.id
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ id: newUser.id, email: newUser.email, created_at: newUser.created_at }))
    localStorage.setItem('token', token)

    return {
      access_token: token,
      token_type: 'bearer',
    }
  },

  // Login with email and password
  login(credentials: LoginCredentials): AuthToken {
    const email = credentials.email.trim().toLowerCase()
    const password = credentials.password

    if (!email) {
      throw new Error('Please enter your email.')
    }
    if (!password) {
      throw new Error('Please enter your password.')
    }

    const users = this.getUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      // If demo email, create or fix demo user
      if (email === DEMO_USER.email) {
        return this.loginAsDemo()
      }
      throw new Error('No account found with this email. Please check your email or sign up.')
    }

    // Check password (allow demo login with demo12345 or any password if demo user)
    if (user.email !== DEMO_USER.email && user.passwordHash !== hashString(password)) {
      throw new Error('Incorrect password. Please try again.')
    }

    const token = 'sg_token_' + user.id
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify({ id: user.id, email: user.email, created_at: user.created_at }))
    localStorage.setItem('token', token)

    return {
      access_token: token,
      token_type: 'bearer',
    }
  },

  // Login as Demo User
  loginAsDemo(): AuthToken {
    // Ensure demo user exists in storage
    const users = this.getUsers()
    let demo = users.find((u) => u.id === DEMO_USER.id || u.email === DEMO_USER.email)
    if (!demo) {
      demo = {
        id: DEMO_USER.id,
        email: DEMO_USER.email,
        passwordHash: hashString('demo12345'),
        created_at: DEMO_USER.created_at,
      }
      users.push(demo)
      this.saveUsers(users)
    }

    // Ensure demo subscriptions exist
    if (!localStorage.getItem(USER_SUBS_PREFIX + DEMO_USER.id)) {
      localStorage.setItem(
        USER_SUBS_PREFIX + DEMO_USER.id,
        JSON.stringify(DEFAULT_DEMO_SUBSCRIPTIONS)
      )
    }

    const token = 'demo_token'
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(DEMO_USER))
    localStorage.setItem('token', token)

    return {
      access_token: token,
      token_type: 'bearer',
    }
  },

  // Get current active user
  getCurrentUser(): User | null {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  // Logout current user
  logout(): void {
    localStorage.removeItem(ACTIVE_SESSION_KEY)
    localStorage.removeItem('token')
  },

  // Subscriptions persistence per user
  getUserSubscriptions(userId?: string): Subscription[] {
    const uid = userId || this.getCurrentUser()?.id || DEMO_USER.id
    const raw = localStorage.getItem(USER_SUBS_PREFIX + uid)
    if (!raw) {
      // If demo user or empty, return default
      if (uid === DEMO_USER.id) {
        localStorage.setItem(USER_SUBS_PREFIX + uid, JSON.stringify(DEFAULT_DEMO_SUBSCRIPTIONS))
        return DEFAULT_DEMO_SUBSCRIPTIONS
      }
      return []
    }
    try {
      return JSON.parse(raw)
    } catch {
      return []
    }
  },

  saveUserSubscriptions(subs: Subscription[], userId?: string): void {
    const uid = userId || this.getCurrentUser()?.id || DEMO_USER.id
    localStorage.setItem(USER_SUBS_PREFIX + uid, JSON.stringify(subs))
  },

  // User Category Priority Preferences
  getUserPreferences(userId?: string): UserPreferences {
    const uid = userId || this.getCurrentUser()?.id || DEMO_USER.id
    const raw = localStorage.getItem('sg_user_prefs_' + uid)
    if (!raw) {
      return {
        categoryPriorities: {
          'Productivity': 'high',
          'Health & Fitness': 'high',
          'Education': 'high',
          'Entertainment': 'medium',
          'Shopping': 'medium',
          'Gaming': 'low',
          'News & Media': 'low',
          'Professional': 'high',
          'Other': 'medium',
        },
        completedSurvey: uid === DEMO_USER.id, // Demo user starts completed
        updated_at: new Date().toISOString(),
      }
    }
    try {
      return JSON.parse(raw)
    } catch {
      return {
        categoryPriorities: {
          'Productivity': 'high',
          'Health & Fitness': 'high',
          'Education': 'high',
          'Entertainment': 'medium',
          'Shopping': 'medium',
          'Gaming': 'low',
          'News & Media': 'low',
          'Professional': 'high',
          'Other': 'medium',
        },
        completedSurvey: false,
        updated_at: new Date().toISOString(),
      }
    }
  },

  saveUserPreferences(prefs: UserPreferences, userId?: string): void {
    const uid = userId || this.getCurrentUser()?.id || DEMO_USER.id
    localStorage.setItem('sg_user_prefs_' + uid, JSON.stringify(prefs))
  },
}

