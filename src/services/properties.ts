/**
 * Properties Service
 * 
 * CRUD operations for the properties table.
 * All functions use Supabase server client with RLS.
 */
import { createClient } from '@/lib/supabase/server';
import type {
  Property,
  PropertyInsert,
  PropertyUpdate,
  PropertyWithImages,
  PropertyFilters,
  PaginatedResponse,
} from '@/types';

/**
 * Fetch all properties with optional filtering and pagination.
 */
export async function getProperties(
  filters?: PropertyFilters,
  page: number = 1,
  pageSize: number = 12
): Promise<PaginatedResponse<PropertyWithImages>> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('properties')
    .select('*, property_images(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  // Apply filters
  if (filters?.property_type) {
    query = query.eq('property_type', filters.property_type);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }
  if (filters?.featured !== undefined) {
    query = query.eq('featured', filters.featured);
  }
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,location.ilike.%${filters.search}%`
    );
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    data: (data as PropertyWithImages[]) || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Fetch a single property by slug with images.
 */
export async function getPropertyBySlug(
  slug: string
): Promise<PropertyWithImages | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq('slug', slug)
    .order('display_order', { referencedTable: 'property_images', ascending: true })
    .single();

  if (error) return null;
  return data as PropertyWithImages;
}

/**
 * Fetch a single property by ID.
 */
export async function getPropertyById(
  id: string
): Promise<PropertyWithImages | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq('id', id)
    .order('display_order', { referencedTable: 'property_images', ascending: true })
    .single();

  if (error) return null;
  return data as PropertyWithImages;
}

/**
 * Fetch featured properties (for homepage showcase).
 */
export async function getFeaturedProperties(
  limit: number = 6
): Promise<PropertyWithImages[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data as PropertyWithImages[]) || [];
}

/**
 * Create a new property.
 */
export async function createProperty(
  property: PropertyInsert
): Promise<Property> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Property;
}

/**
 * Update an existing property.
 */
export async function updateProperty(
  id: string,
  updates: PropertyUpdate
): Promise<Property> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('properties')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Property;
}

/**
 * Delete a property and its associated images.
 */
export async function deleteProperty(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('properties').delete().eq('id', id);

  if (error) throw new Error(error.message);
}

/**
 * Get total property count for stats.
 */
export async function getPropertyCount(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('properties')
    .select('*', { count: 'exact', head: true });

  if (error) throw new Error(error.message);
  return count || 0;
}
