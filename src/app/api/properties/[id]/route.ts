/**
 * Single Property API Route
 *
 * PUT: Update a property and sync images.
 * DELETE: Remove a property and cascade images.
 * Requires admin authentication.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { deleteFromCloudinary } from '@/lib/cloudinary';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// Helper to extract Cloudinary public_id from secure_url
function extractCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const uploadPaths = url.split('/upload/');
    if (uploadPaths.length < 2) return null;
    
    let path = uploadPaths[1];
    // Remove version tag (e.g., v1234567890/)
    path = path.replace(/^v\d+\//, '');
    // Remove file extension
    const extensionIndex = path.lastIndexOf('.');
    if (extensionIndex !== -1) {
      path = path.substring(0, extensionIndex);
    }
    return path;
  } catch (error) {
    console.error('Error extracting public_id:', error);
    return null;
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: admin } = await supabase.from('admins').select('id').eq('auth_id', user.id).single();
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const {
      title, slug, description, price, location, address,
      landmark, area_sqft, property_type, status, featured,
      amenities, map_link, images, extra_details,
    } = body;

    // Update property
    const { data: property, error: propError } = await supabase
      .from('properties')
      .update({
        title,
        slug,
        description: description || '',
        price: Number(price),
        location,
        address: address || '',
        landmark: landmark || '',
        area_sqft: Number(area_sqft),
        property_type,
        status,
        featured: featured || false,
        amenities: amenities || [],
        map_link: map_link || null,
        extra_details: extra_details || {},
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (propError) {
      return NextResponse.json({ error: propError.message }, { status: 500 });
    }

    // Sync images: delete old, insert new
    if (images) {
      await supabase.from('property_images').delete().eq('property_id', id);

      if (images.length > 0) {
        const imageRecords = images.map((img: { url: string; display_order: number }) => ({
          property_id: id,
          image_url: img.url,
          display_order: img.display_order || 0,
        }));

        await supabase.from('property_images').insert(imageRecords);
      }
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error('Property update error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: admin } = await supabase.from('admins').select('id').eq('auth_id', user.id).single();
    if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Step 1: Fetch all associated property images
    const { data: images, error: imagesFetchError } = await supabase
      .from('property_images')
      .select('image_url')
      .eq('property_id', id);

    if (imagesFetchError) {
      console.error('Error fetching property images for deletion:', imagesFetchError);
      return NextResponse.json({ error: 'Failed to fetch associated images.' }, { status: 500 });
    }

    // Step 2: Delete all related images from Cloudinary storage
    if (images && images.length > 0) {
      const deletionPromises = images.map(async (img) => {
        const publicId = extractCloudinaryPublicId(img.image_url);
        if (publicId) {
          try {
            await deleteFromCloudinary(publicId);
          } catch (cloudinaryError) {
            console.error(`Failed to delete image ${publicId} from Cloudinary:`, cloudinaryError);
          }
        }
      });
      
      // Use allSettled to ensure we process all deletions even if one fails
      await Promise.allSettled(deletionPromises);
    }

    // Step 3: Delete related records from property_images table explicitly
    // (Though ON DELETE CASCADE exists, this ensures explicit sequencing)
    const { error: dbImagesDeleteError } = await supabase
      .from('property_images')
      .delete()
      .eq('property_id', id);

    if (dbImagesDeleteError) {
      console.error('Error deleting property_images records:', dbImagesDeleteError);
      // We continue to Step 4 since the CASCADE constraint will catch any remaining rows
    }

    // Step 4: Delete main property record from database
    const { error: propertyDeleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (propertyDeleteError) {
      console.error('Error deleting property record:', propertyDeleteError);
      return NextResponse.json({ error: propertyDeleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Property and correlated assets fully deleted.' });
  } catch (error) {
    console.error('Property delete error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

