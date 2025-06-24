"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Session } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import toast from 'react-hot-toast'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        console.log('AuthContext: Getting initial session...')
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('AuthContext: Error getting session:', error)
          return
        }

        if (session && mounted) {
          console.log('AuthContext: Session found:', session.user.email)
          setSession(session)
          setUser(session.user)
          
          // Try to load profile but don't block on it
          loadProfile(session.user.id).catch(err => {
            console.error('AuthContext: Error loading profile:', err)
          })
        } else {
          console.log('AuthContext: No session found')
        }
      } catch (error) {
        console.error('AuthContext: Unexpected error:', error)
      } finally {
        if (mounted) {
          console.log('AuthContext: Setting loading to false')
          setLoading(false)
        }
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state changed:', event)
      
      if (!mounted) return
      
      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        setProfile(null)
      } else if (event === 'SIGNED_IN' && session) {
        setSession(session)
        setUser(session.user)
        // Load profile in background
        loadProfile(session.user.id).catch(err => {
          console.error('AuthContext: Error loading profile on state change:', err)
        })
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const loadProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Loading profile for:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.error('AuthContext: Profile query error:', error)
        // Don't throw, just log - profile is optional
        return
      }

      if (data) {
        console.log('AuthContext: Profile loaded successfully')
        setProfile(data)
      } else {
        console.log('AuthContext: No profile found for user')
      }
    } catch (error) {
      console.error('AuthContext: Unexpected error loading profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Load profile in background
        loadProfile(data.user.id).catch(err => {
          console.error('Error loading profile after sign in:', err)
        })
      }

      toast.success('Login realizado com sucesso!')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (
    email: string,
    password: string,
    name?: string,
    phone?: string
  ) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      })

      if (error) throw error

      if (data.user) {
        // Wait a bit for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update profile with additional info
        if (name || phone) {
          const updates: any = {}
          if (name) updates.name = name
          if (phone) updates.phone = phone
          
          await supabase
            .from('profiles')
            .update(updates)
            .eq('id', data.user.id)
        }
        
        // Load profile in background
        loadProfile(data.user.id).catch(err => {
          console.error('Error loading profile after sign up:', err)
        })
      }

      toast.success('Conta criada com sucesso!')
      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao criar conta')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      // Clear states immediately
      setUser(null)
      setProfile(null)
      setSession(null)
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error during sign out:', error)
      }
      
      toast.success('Logout realizado com sucesso!')
      
      // Navigate to home
      router.push('/')
      router.refresh()
    } catch (error: any) {
      console.error('Unexpected error during sign out:', error)
      // Force navigation even on error
      router.push('/')
      router.refresh()
    }
  }

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) {
      toast.error('Usuário não autenticado')
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id)

      if (error) throw error

      // Reload profile
      await loadProfile(user.id)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast.error('Erro ao atualizar perfil')
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
