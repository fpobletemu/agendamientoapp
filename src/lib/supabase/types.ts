// Tipos generados desde el schema de Supabase
// Actualizar con: npx supabase gen types typescript --db-url "..." > src/lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          locale: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          locale?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          locale?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          owner_id: string
          plan_id: string | null
          name: string
          slug: string
          logo_url: string | null
          timezone: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          plan_id?: string | null
          name: string
          slug: string
          logo_url?: string | null
          timezone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          logo_url?: string | null
          timezone?: string
          is_active?: boolean
          plan_id?: string | null
          updated_at?: string
        }
      }
      branches: {
        Row: {
          id: string
          business_id: string
          name: string
          address: string | null
          phone: string | null
          email: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          address?: string | null
          phone?: string | null
          email?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          address?: string | null
          phone?: string | null
          email?: string | null
          is_active?: boolean
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          business_id: string
          name: string
          description: string | null
          duration_min: number
          price: number
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          name: string
          description?: string | null
          duration_min?: number
          price?: number
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          description?: string | null
          duration_min?: number
          price?: number
          color?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          branch_id: string
          service_id: string
          staff_id: string
          customer_id: string
          starts_at: string
          ends_at: string
          status: 'pending' | 'confirmed' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          branch_id: string
          service_id: string
          staff_id: string
          customer_id: string
          starts_at: string
          ends_at: string
          status?: 'pending' | 'confirmed' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          notes?: string | null
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          business_id: string
          user_id: string | null
          full_name: string
          email: string | null
          phone: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          user_id?: string | null
          full_name: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          full_name?: string
          email?: string | null
          phone?: string | null
          notes?: string | null
          updated_at?: string
        }
      }
      user_access: {
        Row: {
          id: string
          user_id: string
          role_id: string
          business_id: string | null
          branch_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role_id: string
          business_id?: string | null
          branch_id?: string | null
          created_at?: string
        }
        Update: {
          role_id?: string
          business_id?: string | null
          branch_id?: string | null
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          scope: 'global' | 'business' | 'branch'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          scope: 'global' | 'business' | 'branch'
          created_at?: string
        }
        Update: {
          name?: string
          scope?: 'global' | 'business' | 'branch'
        }
      }
    }
    Functions: {
      get_my_business_id: {
        Args: Record<string, never>
        Returns: string
      }
      has_role: {
        Args: { role_name: string }
        Returns: boolean
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Insert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type Update<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
