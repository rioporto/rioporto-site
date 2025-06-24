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
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          level: '1' | '2' | '3'
          kyc_status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          phone?: string | null
          level?: '1' | '2' | '3'
          kyc_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          level?: '1' | '2' | '3'
          kyc_status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string | null
          type: 'buy' | 'sell'
          crypto_currency: string
          crypto_amount: number
          brl_amount: number
          exchange_rate: number
          commission_rate: number
          commission_amount: number
          wallet_address: string | null
          status: 'pending' | 'processing' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: 'buy' | 'sell'
          crypto_currency: string
          crypto_amount: number
          brl_amount: number
          exchange_rate: number
          commission_rate: number
          commission_amount: number
          wallet_address?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: 'buy' | 'sell'
          crypto_currency?: string
          crypto_amount?: number
          brl_amount?: number
          exchange_rate?: number
          commission_rate?: number
          commission_amount?: number
          wallet_address?: string | null
          status?: 'pending' | 'processing' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      kyc_documents: {
        Row: {
          id: string
          user_id: string | null
          document_type: 'rg' | 'cnh' | 'passport' | 'proof_of_residence' | 'selfie'
          file_url: string
          file_name: string
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          document_type: 'rg' | 'cnh' | 'passport' | 'proof_of_residence' | 'selfie'
          file_url: string
          file_name: string
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          document_type?: 'rg' | 'cnh' | 'passport' | 'proof_of_residence' | 'selfie'
          file_url?: string
          file_name?: string
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      transaction_summary: {
        Row: {
          id: string | null
          user_id: string | null
          type: 'buy' | 'sell' | null
          crypto_currency: string | null
          crypto_amount: number | null
          brl_amount: number | null
          exchange_rate: number | null
          commission_rate: number | null
          commission_amount: number | null
          wallet_address: string | null
          status: 'pending' | 'processing' | 'completed' | 'cancelled' | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
          user_name: string | null
          user_email: string | null
          user_level: '1' | '2' | '3' | null
        }
      }
    }
    Functions: {}
    Enums: {
      document_type: 'rg' | 'cnh' | 'passport' | 'proof_of_residence' | 'selfie'
      kyc_status: 'pending' | 'approved' | 'rejected'
      transaction_status: 'pending' | 'processing' | 'completed' | 'cancelled'
      transaction_type: 'buy' | 'sell'
      user_level: '1' | '2' | '3'
    }
  }
}