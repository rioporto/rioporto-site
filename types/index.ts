export type UserRole = 'user' | 'admin'

export type UserLevel = 1 | 2 | 3

export interface User {
  id: string
  email: string
  phone?: string
  name?: string
  role: UserRole
  level: UserLevel
  kycStatus: 'pending' | 'approved' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

export interface Quotation {
  id: string
  userId?: string
  type: 'buy' | 'sell'
  cryptocurrency: 'btc' | 'usdt' | 'usdc'
  amountBRL: number
  amountCrypto: number
  price: number
  commission: number
  commissionRate: number
  name: string
  email: string
  phone: string
  walletAddress?: string
  notes?: string
  status: 'pending' | 'contacted' | 'completed' | 'cancelled'
  createdAt: Date
  contactedAt?: Date
  completedAt?: Date
}

export interface KYCData {
  userId: string
  documentType: 'cpf' | 'cnpj'
  documentNumber: string
  fullName: string
  birthDate?: Date
  companyName?: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
  }
  selfieUrl?: string
  documentFrontUrl?: string
  documentBackUrl?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: Date
  reviewedAt?: Date
  reviewNotes?: string
}

export interface Transaction {
  id: string
  userId: string
  type: 'buy' | 'sell'
  cryptocurrency: 'btc' | 'usdt' | 'usdc'
  amount: number
  price: number
  total: number
  commission: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  paymentMethod?: 'pix' | 'ted'
  walletAddress?: string
  txHash?: string
  createdAt: Date
  completedAt?: Date
}

export interface Course {
  id: string
  title: string
  description: string
  price: number
  isPaid: boolean
  imageUrl?: string
  duration?: string
  modules?: CourseModule[]
  createdAt: Date
}

export interface CourseModule {
  id: string
  courseId: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  moduleId: string
  title: string
  description?: string
  videoUrl?: string
  duration?: number
  order: number
  resources?: Resource[]
}

export interface Resource {
  id: string
  lessonId: string
  title: string
  url: string
  type: 'pdf' | 'video' | 'link' | 'other'
}