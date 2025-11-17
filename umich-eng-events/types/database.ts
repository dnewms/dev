export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          title: string
          description: string
          date: string
          time: string
          location: string
          capacity: number
          image_url: string | null
          created_at: string
          updated_at: string
          status: 'draft' | 'published' | 'cancelled'
        }
        Insert: {
          id?: string
          title: string
          description: string
          date: string
          time: string
          location: string
          capacity: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
          status?: 'draft' | 'published' | 'cancelled'
        }
        Update: {
          id?: string
          title?: string
          description?: string
          date?: string
          time?: string
          location?: string
          capacity?: number
          image_url?: string | null
          updated_at?: string
          status?: 'draft' | 'published' | 'cancelled'
        }
      }
      registrations: {
        Row: {
          id: string
          event_id: string
          name: string
          email: string
          checked_in: boolean
          checked_in_at: string | null
          qr_code: string
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          name: string
          email: string
          checked_in?: boolean
          checked_in_at?: string | null
          qr_code: string
          created_at?: string
        }
        Update: {
          checked_in?: boolean
          checked_in_at?: string | null
        }
      }
      photos: {
        Row: {
          id: string
          event_id: string
          url: string
          caption: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          event_id: string
          url: string
          caption?: string | null
          uploaded_at?: string
        }
        Update: {
          caption?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Event = Database['public']['Tables']['events']['Row']
export type Registration = Database['public']['Tables']['registrations']['Row']
export type Photo = Database['public']['Tables']['photos']['Row']
