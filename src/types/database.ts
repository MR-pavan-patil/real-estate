/**
 * Database type definitions for Supabase tables.
 * These types mirror the database schema and provide
 * type-safe access throughout the application.
 */

// ============================================
// Admin Types
// ============================================
export interface Admin {
  id: string;
  name: string;
  email: string;
  auth_id: string;
  role: AdminRole;
  created_at: string;
}

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export type AdminInsert = Omit<Admin, 'id' | 'created_at'>;
export type AdminUpdate = Partial<Omit<Admin, 'id' | 'created_at'>>;

// ============================================
// Property Types
// ============================================
export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  location: string;
  address: string;
  landmark: string;
  area_sqft: number;
  property_type: PropertyType;
  status: PropertyStatus;
  featured: boolean;
  amenities: string[];
  map_link: string | null;
  extra_details: any; // Dynamic JSON metadata based on property type
  created_at: string;
  updated_at: string;
}

export type PropertyType = 'plot' | 'house' | 'apartment' | 'villa' | 'commercial' | 'farmland';
export type PropertyStatus = 'available' | 'sold' | 'upcoming' | 'reserved';

export type PropertyInsert = Omit<Property, 'id' | 'created_at' | 'updated_at'>;
export type PropertyUpdate = Partial<Omit<Property, 'id' | 'created_at' | 'updated_at'>>;

/** Property with associated images joined from property_images table */
export interface PropertyWithImages extends Property {
  property_images: PropertyImage[];
}

// ============================================
// Property Image Types
// ============================================
export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export type PropertyImageInsert = Omit<PropertyImage, 'id' | 'created_at'>;
export type PropertyImageUpdate = Partial<Omit<PropertyImage, 'id' | 'created_at'>>;

// ============================================
// Inquiry Types
// ============================================
export interface Inquiry {
  id: string;
  property_id: string | null;
  name: string;
  phone: string;
  city: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'closed';

export type InquiryInsert = Omit<Inquiry, 'id' | 'created_at'>;
export type InquiryUpdate = Partial<Omit<Inquiry, 'id' | 'created_at'>>;

/** Inquiry with the associated property details */
export interface InquiryWithProperty extends Inquiry {
  properties: Pick<Property, 'id' | 'title' | 'slug'> | null;
}

// ============================================
// Site Settings Types
// ============================================
export interface SiteSettings {
  id: string;
  site_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  office_address: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  logo_url: string | null;
}

export type SiteSettingsUpdate = Partial<Omit<SiteSettings, 'id'>>;

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// Filter / Query Types
// ============================================
export interface PropertyFilters {
  property_type?: PropertyType;
  status?: PropertyStatus;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  search?: string;
}
