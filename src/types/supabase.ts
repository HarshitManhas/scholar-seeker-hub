
export interface Profile {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  date_of_birth: string | null
  gender: string | null
  category: string | null
  education_level: string | null
  course: string | null
  board: string | null
  year_of_study: string | null
  marks: string | null
  family_income: string | null
  parents_occupation: string | null
  state: string | null
  district: string | null
  pincode: string | null
  is_disabled: boolean | null
  is_orphan: boolean | null
  has_single_parent: boolean | null
  created_at: string
}

export interface Scholarship {
  id: string
  title: string
  provider: string
  amount: string
  deadline: string
  eligibility: string[]
  description: string
  url: string
  created_at: string
}

export interface Bookmark {
  id: string
  user_id: string
  scholarship_id: string
  created_at: string
}

export interface Application {
  id: string
  user_id: string
  scholarship_id: string
  status: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'>
        Update: Partial<Omit<Profile, 'created_at'>>
      }
      scholarships: {
        Row: Scholarship
        Insert: Omit<Scholarship, 'created_at' | 'id'>
        Update: Partial<Omit<Scholarship, 'created_at' | 'id'>>
      }
      bookmarks: {
        Row: Bookmark
        Insert: Omit<Bookmark, 'created_at' | 'id'>
        Update: Partial<Omit<Bookmark, 'created_at' | 'id'>>
      }
      applications: {
        Row: Application
        Insert: Omit<Application, 'created_at' | 'id'>
        Update: Partial<Omit<Application, 'created_at' | 'id'>>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
