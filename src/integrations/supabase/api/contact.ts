import { supabase } from '@/integrations/supabase/client'

export type Contact = {
  id: string
  phone1: string | null
  phone2: string | null
  email: string | null
  working_hours: string | null
  address_am: string | null
  address_en: string | null
  address_ru: string | null
  address_fa: string | null
  created_at: string
  updated_at: string
}

export async function getContact() {
  const { data, error } = await supabase.from('contact').select('*').single<Contact>()
  if (error) throw error
  return data
}
