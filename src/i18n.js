// Internationalization utility
class I18n {
  constructor() {
    this.currentLanguage = 'de'
    this.translations = {}
    this.supportedLanguages = ['de', 'ru', 'sr']
  }

  // Load translation file for a specific language
  async loadLanguage(langCode) {
    if (this.translations[langCode]) {
      return this.translations[langCode]
    }

    try {
      const response = await fetch(`/locales/${langCode}.json`)
      if (!response.ok) {
        throw new Error(`Failed to load language file: ${langCode}`)
      }
      const translations = await response.json()
      this.translations[langCode] = translations
      return translations
    } catch (error) {
      console.error(`Error loading language ${langCode}:`, error)
      // Fallback to German if loading fails
      if (langCode !== 'de') {
        return this.loadLanguage('de')
      }
      return {}
    }
  }

  // Set current language and load translations
  async setLanguage(langCode) {
    if (!this.supportedLanguages.includes(langCode)) {
      console.warn(`Language ${langCode} not supported, fallback to German`)
      langCode = 'de'
    }

    this.currentLanguage = langCode
    const translations = await this.loadLanguage(langCode)
    localStorage.setItem('language', langCode)
    return translations
  }

  // Get translation by key path (e.g., "hero.title")
  t(keyPath, fallback = '') {
    const translations = this.translations[this.currentLanguage]
    if (!translations) return fallback

    const keys = keyPath.split('.')
    let value = translations

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      } else {
        return fallback || keyPath
      }
    }

    return value
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage
  }

  // Initialize i18n system
  async init() {
    // Get saved language or default to German
    const savedLanguage = localStorage.getItem('language') || 'de'
    await this.setLanguage(savedLanguage)
    return this.translations[this.currentLanguage]
  }
}

// Create global i18n instance
window.i18n = new I18n()

export default window.i18n
