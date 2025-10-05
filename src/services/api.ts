import { supabase } from '@/integrations/supabase/client';
import type { AboutUs } from '@/integrations/supabase/api/about';
import type { Contact } from '@/integrations/supabase/api/contact';
import type { Room } from '@/integrations/supabase/api/rooms';

// About Us
export async function apiGetAboutUs(): Promise<AboutUs | null> {
  const { data, error } = await supabase
    .from('about_us')
    .select('*')
    .maybeSingle<AboutUs>();
  if (error) throw error;
  return data || null;
}

// Contact
export async function apiGetContact(): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('contact')
    .select('*')
    .maybeSingle<Contact>();
  if (error) throw error;
  return data || null;
}

// Rooms list
export async function apiGetRooms(): Promise<Room[]> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('id', { ascending: true }) as any;
  if (error) throw error;
  return (data as Room[]) || [];
}

// Single room
export async function apiGetRoomById(id: string): Promise<Room | null> {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .maybeSingle<Room>();
  if (error) throw error;
  return data || null;
}
