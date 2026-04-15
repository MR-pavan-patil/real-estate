# Estate Reserve — Premium Real Estate Platform

A highly optimized modern web application built for property listings and management. Featuring a complete public-facing consumer website coupled with a secure Admin Dashboard.

## App Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Custom Design System
- **Animations**: Framer Motion
- **Database & Auth**: Supabase
- **Image Storage & Optimization**: Cloudinary

---

## 🛠️ Environment Configuration Setup

To run this application, you must create a `.env.local` file at the root of the project. Include the following variables:

```env
# ============================================
# Supabase Configuration
# ============================================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ============================================
# Cloudinary Configuration
# ============================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ============================================
# App Configuration
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Estate Reserve"
```

---

## ☁️ Cloudinary Setup Guide (Important)

Estate Reserve uses Cloudinary for uploading and managing all property images. Unlike Supabase Storage, Cloudinary automatically handles advanced compression, dynamic cropping, and modern format conversions (like delivering WebP dynamically).

### 1. Create a Cloudinary Account
1. Go to [Cloudinary.com](https://cloudinary.com/) and sign up for a free tier account.
2. Once logged into the Console dashboard, locate your **Product Environment Credentials**.

### 2. Copy Your Keys
You will find three essential values on your Cloudinary Dashboard:
- **Cloud Name**: (e.g., `dabc1234`)
- **API Key**: (e.g., `827361928371928`)
- **API Secret**: (e.g., `xyzABC123_hidden_secret`)

Go to your `.env.local` file and paste them into the corresponding variables:
*   `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
*   `CLOUDINARY_API_KEY`
*   `CLOUDINARY_API_SECRET`

### 3. Setting Up an Unsigned Upload Preset (Optional but Recommended)
If the application shifts to client-side uploads at any point, Cloudinary requires an "Upload Preset". Currently, Estate Reserve utilizes a secure **Server-Side Upload API Route** (`/api/upload`) using the API Secret, meaning Presets are completely optional. The keys above are all that is required!

---

## 🔒 Supabase Admin Setup

The project relies heavily on Supabase for data management and Row Level Security (RLS). 

1. Ensure you run the initialization SQL scripts provided in the `supabase/` directory against your project via the Supabase SQL Editor. 
2. Use the `scripts/create-demo-admin.ts` script to generate a secure admin account if you don't already have one.

---

## 🚀 Running the App

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site or `/admin/login` for the Dashboard.
