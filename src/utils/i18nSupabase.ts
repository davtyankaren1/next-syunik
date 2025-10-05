export type LangCode = 'am' | 'en' | 'ru' | 'fa'

export function resolveLang(i18nLang?: string): LangCode {
  const l = (i18nLang || 'en').toLowerCase()
  if (l.startsWith('am')) return 'am'
  if (l.startsWith('ru')) return 'ru'
  if (l.startsWith('fa') || l.startsWith('ir')) return 'fa'
  return 'en'
}

// Picks a localized field from an object that has e.g. name_en, name_am, etc.
export function pickLocalized<T extends Record<string, any>>(
  obj: T,
  base: string,
  lang: LangCode
): string {
  const order: LangCode[] = [lang, 'en', 'am', 'ru', 'fa']
  for (const code of order) {
    const key = `${base}_${code}`
    const val = obj[key]
    if (val && typeof val === 'string' && val.trim().length > 0) return val
  }
  return ''
}
