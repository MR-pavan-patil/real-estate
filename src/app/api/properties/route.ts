/**
 * Properties API Route
 *
 * POST: Create a new property with images.
 * Requires admin authentication.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: admin } = await supabase
      .from('admins')
      .select('id')
      .eq('auth_id', user.id)
      .single();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
      title, slug, description, price, location, address,
      landmark, area_sqft, property_type, status, featured,
      amenities, map_link, images, extra_details,
    } = body;

    // Validate
    if (!title || !slug || !price || !location || !area_sqft) {
      return NextResponse.json(
        { error: 'Title, slug, price, location, and area are required.' },
        { status: 400 }
      );
    }

    // Create property
    const { data: property, error: propError } = await supabase
      .from('properties')
      .insert({
        title,
        slug,
        description: description || '',
        price: Number(price),
        location,
        address: address || '',
        landmark: landmark || '',
        area_sqft: Number(area_sqft),
        property_type: property_type || 'plot',
        status: status || 'available',
        featured: featured || false,
        amenities: amenities || [],
        map_link: map_link || null,
        extra_details: extra_details || {},
      })
      .select()
      .single();

    if (propError) {
      console.error('Property creation error:', propError);
      return NextResponse.json({ error: propError.message }, { status: 500 });
    }

    // Insert images if provided
    if (images && images.length > 0) {
      const imageRecords = images.map((img: { url: string; display_order: number }) => ({
        property_id: property.id,
        image_url: img.url,
        display_order: img.display_order || 0,
      }));

      const { error: imgError } = await supabase
        .from('property_images')
        .insert(imageRecords);

      if (imgError) {
        console.error('Image insert error:', imgError);
      }
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error('Properties API error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
