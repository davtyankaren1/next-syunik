import { supabase } from '@/integrations/supabase/client'

export type Service = {
  id: string
  name_am: string | null
  name_en: string | null
  name_ru: string | null
  name_fa: string | null
  image: string | null
  created_at: string
  updated_at: string
}

export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: true })
    .returns<Service[]>()
  if (error) throw error
  return data
}
