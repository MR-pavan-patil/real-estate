/**
 * Inquiries Service
 * 
 * CRUD operations for the inquiries table.
 */
import { createClient } from '@/lib/supabase/server';
import type {
  Inquiry,
  InquiryInsert,
  InquiryUpdate,
  InquiryWithProperty,
  PaginatedResponse,
} from '@/types';

/**
 * Fetch all inquiries with optional pagination and status filter.
 */
export async function getInquiries(
  status?: string,
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<InquiryWithProperty>> {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('inquiries')
    .select('*, properties(id, title, slug)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    data: (data as InquiryWithProperty[]) || [],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize),
  };
}

/**
 * Create a new inquiry (public-facing, from contact form).
 */
export async function createInquiry(
  inquiry: InquiryInsert
): Promise<Inquiry> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inquiries')
    .insert(inquiry)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Inquiry;
}

/**
 * Update an inquiry status (admin action).
 */
export async function updateInquiry(
  id: string,
  updates: InquiryUpdate
): Promise<Inquiry> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('inquiries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Inquiry;
}

/**
 * Delete an inquiry.
 */
export async function deleteInquiry(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('inquiries').delete().eq('id', id);

  if (error) throw new Error(error.message);
}

/**
 * Get new inquiry count for dashboard stats.
 */
export async function getNewInquiryCount(): Promise<number> {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from('inquiries')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  if (error) throw new Error(error.message);
  return count || 0;
}
