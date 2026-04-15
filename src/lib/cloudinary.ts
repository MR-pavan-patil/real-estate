/**
 * Cloudinary Upload Utility
 * 
 * Handles image uploads to Cloudinary with optimization.
 * Returns hosted image URLs for storage in Supabase.
 * 
 * Features:
 * - Signed uploads via API route
 * - Automatic format optimization (WebP/AVIF)
 * - Quality auto-optimization
 * - Organized folder structure
 */
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary instance
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload an image buffer to Cloudinary.
 * Used in API Route Handlers for server-side uploads.
 * 
 * @param fileBuffer - The image file as a Buffer
 * @param folder - Cloudinary folder path (e.g., 'properties')
 * @returns Upload result with secure URL
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = 'estate-reserve/properties'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { quality: 'auto', fetch_format: 'auto' },
          ],
          // Optimization settings
          eager: [
            { width: 800, height: 600, crop: 'fill', quality: 'auto' },
            { width: 400, height: 300, crop: 'fill', quality: 'auto' },
          ],
          eager_async: true,
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'));
            return;
          }
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      )
      .end(fileBuffer);
  });
}

/**
 * Delete an image from Cloudinary by public_id.
 * 
 * @param publicId - The Cloudinary public_id of the image
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Generate an optimized Cloudinary URL for display.
 * Applies automatic format and quality optimization.
 * 
 * @param publicId - The Cloudinary public_id
 * @param width - Desired width
 * @param height - Desired height
 */
export function getOptimizedUrl(
  publicId: string,
  width: number = 800,
  height: number = 600
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  });
}

export default cloudinary;
