export interface User {
  user_id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  avatar_url?: string
  account_type: 'user' | 'admin' | 'staff'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  phone_number: string
  account_balance: number
  avatar_url: string | null
  gender: 'male' | 'female'
  dob: string | null
  address: string
  is_active: boolean
  account_type: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  username: string
  email: string
  phone: string
  role: string
  token: string
  isAdmin: boolean
}
