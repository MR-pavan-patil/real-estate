/**
 * Application-wide constants.
 */

/** Navigation links for the public site */
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '/properties' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

/** Admin sidebar navigation links */
export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Properties', href: '/admin/properties', icon: 'Building2' },
  { label: 'Add Property', href: '/admin/properties/new', icon: 'Plus' },
  { label: 'Inquiries', href: '/admin/inquiries', icon: 'MessageSquare' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const;

/** Property type options for forms and filters */
export const PROPERTY_TYPES = [
  { value: 'plot', label: 'Plot' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'farmland', label: 'Farm Land' },
] as const;

/** Property status options */
export const PROPERTY_STATUSES = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'reserved', label: 'Reserved' },
] as const;

/** Inquiry status options */
export const INQUIRY_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
] as const;

/** Common amenities for property listings */
export const AMENITIES = [
  'Water Supply',
  'Electricity',
  'Road Access',
  'Drainage',
  'Street Lights',
  'Park',
  'Security',
  'Gated Community',
  'Club House',
  'Swimming Pool',
  'Gym',
  'Parking',
  'CCTV',
  'Power Backup',
  'Children Play Area',
  'Temple',
] as const;

/** Items per page for pagination */
export const PAGE_SIZE = 12;

/** Default site settings for initial setup */
export const DEFAULT_SETTINGS = {
  site_name: 'Estate Reserve',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'info@estatereserve.com',
  office_address: 'Office No. 1, Main Road, Your City',
  hero_title: 'Find Your Dream Property',
  hero_subtitle: 'Premium plots and properties with complete transparency and trust.',
  about_text: 'We are a trusted real estate firm helping you find the perfect property for your needs.',
} as const;
