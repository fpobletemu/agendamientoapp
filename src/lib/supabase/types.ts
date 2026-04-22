export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Views: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
    Tables: {
      subscription_plans: {
        Row: { id: string; name: string; max_branches: number; max_staff: number; max_services: number; price_monthly: number; created_at: string; updated_at: string }
        Insert: { id?: string; name: string; max_branches?: number; max_staff?: number; max_services?: number; price_monthly?: number; created_at?: string; updated_at?: string }
        Update: { name?: string; max_branches?: number; max_staff?: number; max_services?: number; price_monthly?: number; updated_at?: string }
      }
      profiles: {
        Row: { id: string; full_name: string | null; avatar_url: string | null; phone: string | null; locale: string; created_at: string; updated_at: string }
        Insert: { id: string; full_name?: string | null; avatar_url?: string | null; phone?: string | null; locale?: string; created_at?: string; updated_at?: string }
        Update: { full_name?: string | null; avatar_url?: string | null; phone?: string | null; locale?: string; updated_at?: string }
      }
      businesses: {
        Row: { id: string; owner_id: string; plan_id: string | null; name: string; slug: string; logo_url: string | null; timezone: string; is_active: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; owner_id: string; plan_id?: string | null; name: string; slug: string; logo_url?: string | null; timezone?: string; is_active?: boolean; created_at?: string; updated_at?: string }
        Update: { name?: string; slug?: string; logo_url?: string | null; timezone?: string; is_active?: boolean; plan_id?: string | null; updated_at?: string }
      }
      branches: {
        Row: { id: string; business_id: string; name: string; address: string | null; phone: string | null; email: string | null; is_active: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; business_id: string; name: string; address?: string | null; phone?: string | null; email?: string | null; is_active?: boolean; created_at?: string; updated_at?: string }
        Update: { name?: string; address?: string | null; phone?: string | null; email?: string | null; is_active?: boolean; updated_at?: string }
      }
      branch_schedules: {
        Row: { id: string; branch_id: string; day_of_week: number; open_time: string; close_time: string; is_open: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; branch_id: string; day_of_week: number; open_time: string; close_time: string; is_open?: boolean; created_at?: string; updated_at?: string }
        Update: { open_time?: string; close_time?: string; is_open?: boolean; updated_at?: string }
      }
      services: {
        Row: { id: string; business_id: string; name: string; description: string | null; duration_min: number; price: number; color: string; is_active: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; business_id: string; name: string; description?: string | null; duration_min?: number; price?: number; color?: string; is_active?: boolean; created_at?: string; updated_at?: string }
        Update: { name?: string; description?: string | null; duration_min?: number; price?: number; color?: string; is_active?: boolean; updated_at?: string }
      }
      staff_profiles: {
        Row: { id: string; user_id: string; branch_id: string; bio: string | null; avatar_url: string | null; is_active: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; user_id: string; branch_id: string; bio?: string | null; avatar_url?: string | null; is_active?: boolean; created_at?: string; updated_at?: string }
        Update: { bio?: string | null; avatar_url?: string | null; is_active?: boolean; updated_at?: string }
      }
      staff_services: {
        Row: { id: string; staff_id: string; service_id: string; created_at: string }
        Insert: { id?: string; staff_id: string; service_id: string; created_at?: string }
        Update: Record<string, never>
      }
      staff_schedules: {
        Row: { id: string; staff_id: string; day_of_week: number; start_time: string; end_time: string; is_working: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; staff_id: string; day_of_week: number; start_time: string; end_time: string; is_working?: boolean; created_at?: string; updated_at?: string }
        Update: { start_time?: string; end_time?: string; is_working?: boolean; updated_at?: string }
      }
      blocked_times: {
        Row: { id: string; branch_id: string | null; staff_id: string | null; starts_at: string; ends_at: string; reason: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; branch_id?: string | null; staff_id?: string | null; starts_at: string; ends_at: string; reason?: string | null; created_at?: string; updated_at?: string }
        Update: { starts_at?: string; ends_at?: string; reason?: string | null; updated_at?: string }
      }
      roles: {
        Row: { id: string; name: string; scope: 'global' | 'business' | 'branch'; created_at: string }
        Insert: { id?: string; name: string; scope: 'global' | 'business' | 'branch'; created_at?: string }
        Update: { name?: string; scope?: 'global' | 'business' | 'branch' }
      }
      permissions: {
        Row: { id: string; resource: string; action: string; created_at: string }
        Insert: { id?: string; resource: string; action: string; created_at?: string }
        Update: { resource?: string; action?: string }
      }
      role_permissions: {
        Row: { role_id: string; permission_id: string }
        Insert: { role_id: string; permission_id: string }
        Update: Record<string, never>
      }
      user_access: {
        Row: { id: string; user_id: string; role_id: string; business_id: string | null; branch_id: string | null; created_at: string }
        Insert: { id?: string; user_id: string; role_id: string; business_id?: string | null; branch_id?: string | null; created_at?: string }
        Update: { role_id?: string; business_id?: string | null; branch_id?: string | null }
      }
      customers: {
        Row: { id: string; business_id: string; user_id: string | null; full_name: string; email: string | null; phone: string | null; notes: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; business_id: string; user_id?: string | null; full_name: string; email?: string | null; phone?: string | null; notes?: string | null; created_at?: string; updated_at?: string }
        Update: { full_name?: string; email?: string | null; phone?: string | null; notes?: string | null; updated_at?: string }
      }
      appointments: {
        Row: { id: string; branch_id: string; service_id: string; staff_id: string; customer_id: string; starts_at: string; ends_at: string; status: 'pending' | 'confirmed' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'; notes: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; branch_id: string; service_id: string; staff_id: string; customer_id: string; starts_at: string; ends_at: string; status?: 'pending' | 'confirmed' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'; notes?: string | null; created_at?: string; updated_at?: string }
        Update: { status?: 'pending' | 'confirmed' | 'paid' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'; notes?: string | null; updated_at?: string }
      }
      appointment_notes: {
        Row: { id: string; appointment_id: string; author_id: string; content: string; created_at: string }
        Insert: { id?: string; appointment_id: string; author_id: string; content: string; created_at?: string }
        Update: { content?: string }
      }
      payment_configs: {
        Row: { id: string; business_id: string; gateway: 'mercadopago' | 'webpay' | 'flow'; credentials: Json; is_active: boolean; created_at: string; updated_at: string }
        Insert: { id?: string; business_id: string; gateway: 'mercadopago' | 'webpay' | 'flow'; credentials?: Json; is_active?: boolean; created_at?: string; updated_at?: string }
        Update: { credentials?: Json; is_active?: boolean; updated_at?: string }
      }
      payments: {
        Row: { id: string; appointment_id: string; gateway: 'mercadopago' | 'webpay' | 'flow'; amount: number; currency: string; status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'; gateway_tx_id: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; appointment_id: string; gateway: 'mercadopago' | 'webpay' | 'flow'; amount: number; currency?: string; status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'; gateway_tx_id?: string | null; created_at?: string; updated_at?: string }
        Update: { status?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'; gateway_tx_id?: string | null; updated_at?: string }
      }
      payment_events: {
        Row: { id: string; payment_id: string | null; gateway: string; event_type: string; payload: Json; idempotency_key: string; processed_at: string }
        Insert: { id?: string; payment_id?: string | null; gateway: string; event_type: string; payload?: Json; idempotency_key: string; processed_at?: string }
        Update: Record<string, never>
      }
      refunds: {
        Row: { id: string; payment_id: string; amount: number; reason: string | null; status: 'pending' | 'completed' | 'failed'; gateway_ref: string | null; created_at: string; updated_at: string }
        Insert: { id?: string; payment_id: string; amount: number; reason?: string | null; status?: 'pending' | 'completed' | 'failed'; gateway_ref?: string | null; created_at?: string; updated_at?: string }
        Update: { status?: 'pending' | 'completed' | 'failed'; gateway_ref?: string | null; updated_at?: string }
      }
    }
    Functions: {
      get_my_business_id: { Args: Record<string, never>; Returns: string }
      has_role: { Args: { role_name: string }; Returns: boolean }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Update<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
