/**
 * Property Images Service
 * 
 * CRUD operations for the property_images table.
 */
import { createClient } from '@/lib/supabase/server';
import type { PropertyImage, PropertyImageInsert } from '@/types';

/**
 * Get all images for a property, ordered by display_order.
 */
export async function getPropertyImages(
  propertyId: string
): Promise<PropertyImage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', propertyId)
    .order('display_order', { ascending: true });

  if (error) throw new Error(error.message);
  return (data as PropertyImage[]) || [];
}

/**
 * Add an image to a property.
 */
export async function addPropertyImage(
  image: PropertyImageInsert
): Promise<PropertyImage> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('property_images')
    .insert(image)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as PropertyImage;
}

/**
 * Delete a property image.
 */
export async function deletePropertyImage(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('property_images')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}

/**
 * Reorder property images by updating display_order.
 */
export async function reorderPropertyImages(
  images: { id: string; display_order: number }[]
): Promise<void> {
  const supabase = await createClient();

  const updates = images.map(({ id, display_order }) =>
    supabase
      .from('property_images')
      .update({ display_order })
      .eq('id', id)
  );

  await Promise.all(updates);
}
