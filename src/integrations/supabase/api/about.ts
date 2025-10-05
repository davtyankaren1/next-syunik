import { supabase } from '@/integrations/supabase/client'

export type AboutUs = {
  id: string
  about_text: string | null
  about_en_text: string | null
  about_ru_text: string | null
  about_fa_text: string | null
  image_1: string | null
  image_2: string | null
  image_3: string | null
  image_4: string | null
  created_at: string
  updated_at: string
}

export async function getAboutUs() {
  const { data, error } = await supabase
    .from('about_us')
    .select('*')
    .maybeSingle<AboutUs>()
  if (error) throw error
  return data || null
}
