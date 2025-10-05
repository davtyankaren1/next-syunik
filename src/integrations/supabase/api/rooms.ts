import { supabase } from '@/integrations/supabase/client'

export type Room = {
  id: string
  name_am: string | null
  name_en: string | null
  name_ru: string | null
  name_fa: string | null
  description_am: string | null
  description_en: string | null
  description_ru: string | null
  description_fa: string | null
  capacity: number | null
  bed_type: string | null
  size: number | null
  floor: number | null
  price_standard: number | null
  price_persian: number | null
  image_1: string | null
  image_2: string | null
  image_3: string | null
  image_4: string | null
  created_at: string
  updated_at: string
}

export async function getRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .order('created_at', { ascending: true })
    .returns<Room[]>()
  if (error) throw error
  return data
}

export async function getRoomById(id: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single<Room>()
  if (error) throw error
  return data
}
