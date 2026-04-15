/**
 * Utility helper functions used throughout the application.
 */

/**
 * Format a number as Indian Rupee currency.
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Generate a URL-friendly slug from a string.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date with time.
 */
export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Truncate text to a specified length with ellipsis.
 */
export function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format area in square feet with comma separation.
 */
export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString('en-IN')} sq.ft`;
}

/**
 * Capitalize the first letter of each word.
 */
export function titleCase(text: string): string {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Get the property type display label.
 */
export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    plot: 'Plot',
    house: 'House',
    apartment: 'Apartment',
    villa: 'Villa',
    commercial: 'Commercial',
    farmland: 'Farm Land',
  };
  return labels[type] || titleCase(type);
}

/**
 * Get the status display label with color information.
 */
export function getStatusInfo(status: string): {
  label: string;
  color: string;
  bgColor: string;
} {
  const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
    available: { label: 'Available', color: '#10B981', bgColor: '#ECFDF5' },
    sold: { label: 'Sold', color: '#EF4444', bgColor: '#FEF2F2' },
    upcoming: { label: 'Upcoming', color: '#F59E0B', bgColor: '#FFFBEB' },
    reserved: { label: 'Reserved', color: '#8B5CF6', bgColor: '#F5F3FF' },
  };
  return statusMap[status] || { label: titleCase(status), color: '#64748B', bgColor: '#F8FAFC' };
}

/**
 * Debounce a function call.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * Construct a classname string from conditional classes.
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
