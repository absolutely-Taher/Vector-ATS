export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "applicant"
}

export const DEMO_USERS: User[] = [
  {
    id: "admin-1",
    email: "admin@demo.com",
    name: "هاشم",
    role: "admin",
  },
]

export class AuthService {
  private static readonly STORAGE_KEY = "vectorhire_user"

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  static setCurrentUser(user: User): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user))
  }

  static logout(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static async login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    // Demo login logic
    if (email === "admin@demo.com" && password === "Admin@123") {
      const user = DEMO_USERS[0]
      this.setCurrentUser(user)
      return { user, error: null }
    }

    return { user: null, error: "بيانات الدخول غير صحيحة" }
  }

  static async signup(name: string, email: string): Promise<{ user: User | null; error: string | null }> {
    // Check if user already exists
    const existingUsers = this.getStoredUsers()
    if (existingUsers.some((u) => u.email === email)) {
      return { user: null, error: "البريد الإلكتروني مستخدم بالفعل" }
    }

    // Create new applicant user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: "applicant",
    }

    // Store user
    existingUsers.push(newUser)
    localStorage.setItem("vectorhire_users", JSON.stringify(existingUsers))
    this.setCurrentUser(newUser)

    return { user: newUser, error: null }
  }

  private static getStoredUsers(): User[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem("vectorhire_users")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
}
