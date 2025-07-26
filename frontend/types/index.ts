import type React from "react"
// Global type definitions for BulkBite

export interface User {
  id: number
  name: string
  email: string
  type: "vendor" | "supplier"
  phone?: string
  location?: string
  latitude?: number
  longitude?: number
  created_at?: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  unit: string
  min_quantity: number
  supplier_id: number
  supplier_name: string
  created_at?: string
}

export interface Group {
  id: number
  name: string
  description: string
  target_quantity: number
  current_quantity: number
  price_per_unit: number
  deadline: string
  status: "active" | "completed" | "expired"
  product_id: number
  product_name: string
  created_by: number
  creator_name: string
  created_at?: string
}

export interface Order {
  id: number
  quantity: number
  total_price: number
  status: "pending" | "confirmed" | "delivered"
  vendor_id: number
  vendor_name: string
  group_id: number
  group_name: string
  created_at: string
}

export interface Supplier {
  id: number
  name: string
  email: string
  phone?: string
  location: string
  latitude?: number
  longitude?: number
  description: string
  rating: number
  created_at?: string
}

export interface Review {
  id: number
  rating: number
  comment?: string
  vendor_id: number
  vendor_name: string
  supplier_id: number
  supplier_name: string
  created_at: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface LoginFormData {
  name: string
  email: string
  user_type: "vendor" | "supplier"
}

export interface GroupFormData {
  name: string
  description: string
  target_quantity: string
  price_per_unit: string
  deadline_days: string
  product_id?: number
}

// Component prop types
export interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "vendor" | "supplier"
  activeTab: string
  onTabChange: (tab: string) => void
}

// Utility types
export type UserType = "vendor" | "supplier"
export type OrderStatus = "pending" | "confirmed" | "delivered"
export type GroupStatus = "active" | "completed" | "expired"
