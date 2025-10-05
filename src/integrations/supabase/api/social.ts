import { supabase } from '@/integrations/supabase/client'

export type SocialLink = {
  id: string
  url: string
  image: string | null
  display_order: number | null
  created_at: string
  updated_at: string
}

export async function getSocialLinks() {
  const { data, error } = await supabase
    .from('social_media')
    .select('*')
    .order('display_order', { ascending: true })
    .returns<SocialLink[]>()
  if (error) throw error
  return data
}
