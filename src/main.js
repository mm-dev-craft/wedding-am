import './style.css'
import i18n from './i18n.js'

// Language Management
const languages = {
  de: { name: 'Deutsch', flag: '🇩🇪' },
  ru: { name: 'Русский', flag: '🇷🇺' },
  sr: { name: 'Српски', flag: '🇷🇸' }
}

const languageOrder = ['de', 'ru', 'sr']

// Function to apply language
async function applyLanguage(langCode) {
  try {
    // Load translations for the selected language
    await i18n.setLanguage(langCode)
    
    // Update language button display
    const languageButton = document.getElementById('languageButton')
    const currentFlag = document.getElementById('currentFlag')
    const currentLanguageName = document.getElementById('currentLanguageName')
    
    if (languageButton && currentFlag && currentLanguageName) {
      const language = languages[langCode]
      currentFlag.textContent = language.flag
      currentLanguageName.textContent = i18n.t('header.language')
      
      // Update tooltip with next language
      updateLanguageTooltip(langCode)
    }
    
    // Update page content with new translations
    updatePageContent()
    
    console.log('Language applied:', langCode)
  } catch (error) {
    console.error('Error applying language:', error)
  }
}

// Function to update all page content with current translations
function updatePageContent() {
  // Update HTML lang attribute
  const htmlRoot = document.getElementById('htmlRoot') || document.documentElement
  htmlRoot.setAttribute('lang', i18n.getCurrentLanguage())
  
  // Update meta tags
  document.title = i18n.t('meta.title')
  
  const pageTitle = document.getElementById('pageTitle')
  if (pageTitle) {
    pageTitle.textContent = i18n.t('meta.title')
  }
  
  const pageDescription = document.getElementById('pageDescription')
  if (pageDescription) {
    pageDescription.content = i18n.t('meta.description')
  }

  // Update all translatable elements
  updateTranslatableElements()
}

// Function to update elements with data-i18n attributes
function updateTranslatableElements() {
  const elements = document.querySelectorAll('[data-i18n]')
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n')
    const translation = i18n.t(key)
    
    if (element.getAttribute('data-i18n-attr')) {
      // Update attribute instead of text content
      const attr = element.getAttribute('data-i18n-attr')
      element.setAttribute(attr, translation)
    } else if (element.getAttribute('data-i18n-html')) {
      // Update innerHTML (for elements with HTML content)
      element.innerHTML = translation.replace(/\n/g, '<br>')
    } else {
      // Update text content
      element.textContent = translation
    }
  })

  // Handle special cases like lists
  updateInfoList()
}

// Function to update the info list items
function updateInfoList() {
  const infoList = document.querySelector('[data-i18n-list="party.info.items"]')
  if (infoList) {
    const items = i18n.t('party.info.items', [])
    infoList.innerHTML = items.map(item => `• ${item}<br>`).join('')
  }
}

// Function to get next language in cycle
function getNextLanguage(currentLang) {
  const currentIndex = languageOrder.indexOf(currentLang)
  const nextIndex = (currentIndex + 1) % languageOrder.length
  return languageOrder[nextIndex]
}

// Function to update language tooltip
function updateLanguageTooltip(currentLang) {
  const tooltip = document.getElementById('languageTooltip')
  if (tooltip) {
    const nextLang = getNextLanguage(currentLang)
    const nextLanguage = languages[nextLang]
    if (nextLanguage) {
      tooltip.textContent = `Zu ${nextLanguage.flag} ${nextLanguage.name}`
    }
  }
}

// Initialize language system
async function initLanguage() {
  console.log('initLanguage function called')
  
  // Initialize i18n system first
  await i18n.init()
  
  const waitForLanguageElements = () => {
    const languageButton = document.getElementById('languageButton')
    const currentFlag = document.getElementById('currentFlag')
    const currentLanguageName = document.getElementById('currentLanguageName')
    
    if (!languageButton || !currentFlag || !currentLanguageName) {
      console.log('Language elements not yet available, retrying...')
      setTimeout(waitForLanguageElements, 10)
      return
    }
    
    console.log('All language elements found successfully')
    
    // Check if already initialized
    if (languageButton.hasAttribute('data-language-initialized')) {
      console.log('Language already initialized, skipping...')
      return
    }
    
    // Get saved language or default to German
    const savedLanguage = localStorage.getItem('language') || 'de'
    console.log('Saved language:', savedLanguage)
    
    // Update the initial display and content
    const language = languages[savedLanguage]
    currentFlag.textContent = language.flag
    currentLanguageName.textContent = i18n.t('header.language')
    updateLanguageTooltip(savedLanguage)
    updatePageContent()
    
    // Add click event listener
    languageButton.addEventListener('click', async (e) => {
      e.preventDefault()
      console.log('Language button clicked!')
      
      // Add visual feedback during language switch
      const currentFlag = document.getElementById('currentFlag')
      if (currentFlag) {
        currentFlag.style.transform = 'scale(1.2) rotate(5deg)'
        setTimeout(() => {
          currentFlag.style.transform = ''
        }, 200)
      }
      
      const currentLanguage = localStorage.getItem('language') || 'de'
      const nextLanguage = getNextLanguage(currentLanguage)
      
      console.log('Current language:', currentLanguage)
      console.log('Switching to:', nextLanguage)
      
      await applyLanguage(nextLanguage)
    })
    
    // Mark as initialized
    languageButton.setAttribute('data-language-initialized', 'true')
    console.log('Language event listener added')
  }
  
  // Start waiting for elements
  waitForLanguageElements()
}

// Function to apply dark mode
function applyDarkMode(isDark) {
  const html = document.documentElement
  html.classList.toggle('dark', isDark)
  localStorage.setItem('theme', isDark ? 'dark' : 'light')

  // Icons mit smooth animation umschalten
  const sunIcon = document.getElementById('sunIcon')
  const moonIcon = document.getElementById('moonIcon')
  
  if (sunIcon && moonIcon) {
    if (isDark) {
      // Dark mode: Zeige Sonne (um zu Light zu wechseln)
      sunIcon.classList.remove('opacity-0', 'scale-75')
      sunIcon.classList.add('opacity-100', 'scale-100')
      moonIcon.classList.remove('opacity-100', 'scale-100')
      moonIcon.classList.add('opacity-0', 'scale-75')
    } else {
      // Light mode: Zeige Mond (um zu Dark zu wechseln)
      sunIcon.classList.remove('opacity-100', 'scale-100')
      sunIcon.classList.add('opacity-0', 'scale-75')
      moonIcon.classList.remove('opacity-0', 'scale-75')
      moonIcon.classList.add('opacity-100', 'scale-100')
    }
  }
}

// Dark Mode Toggle Functionality
function initDarkMode() {
  console.log('initDarkMode function called')
  
  // Wait for DOM elements to be available
  const waitForElements = () => {
    const darkModeToggle = document.getElementById('darkModeToggle')
    const html = document.documentElement
    const sunIcon = document.getElementById('sunIcon')
    const moonIcon = document.getElementById('moonIcon')
    
    if (!darkModeToggle || !sunIcon || !moonIcon) {
      console.log('Elements not yet available, retrying...')
      setTimeout(waitForElements, 10)
      return
    }

    console.log('All dark mode elements found successfully')
    console.log('Initial HTML classes:', html.classList.toString())
    
    // Check if already initialized to prevent duplicate event listeners
    if (darkModeToggle.hasAttribute('data-initialized')) {
      console.log('Dark mode already initialized, skipping...')
      return
    }


    
    // Check for saved dark mode preference or default to system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    console.log('Saved theme:', savedTheme)
    console.log('System prefers dark:', systemPrefersDark)
    
    let isDarkMode = false
    if (savedTheme === 'dark') {
      isDarkMode = true
    } else if (savedTheme === 'light') {
      isDarkMode = false
    } else if (savedTheme === null) {
      // No saved preference, use system preference
      isDarkMode = systemPrefersDark
    }
    
    // Apply initial dark mode state
    applyDarkMode(isDarkMode)
    console.log('Dark mode applied:', isDarkMode)
    
    // Toggle dark mode
    darkModeToggle.addEventListener('click', (e) => {
      e.preventDefault()
      console.log('Dark mode button clicked!')
      const isCurrentlyDark = html.classList.contains('dark')
      const newDarkMode = !isCurrentlyDark
      
      console.log('Current dark mode state:', isCurrentlyDark)
      console.log('Switching to:', newDarkMode ? 'dark' : 'light')
      
      applyDarkMode(newDarkMode)
      
      // Save preference to localStorage
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
      console.log('Theme saved to localStorage:', newDarkMode ? 'dark' : 'light')
      console.log('HTML classes after toggle:', html.classList.toString())
    })
    
    // Mark as initialized to prevent duplicate event listeners
    darkModeToggle.setAttribute('data-initialized', 'true')
    
    console.log('Event listener added to dark mode button')
  }
  
  // Start waiting for elements
  waitForElements()
}

document.querySelector('#app').innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300">
    <!-- Header Controls -->
    <div class="fixed top-2 sm:top-4 right-2 sm:right-4 z-50 flex flex-col sm:flex-row gap-2 sm:gap-3">
      <!-- Language Toggle Button -->
      <button id="languageButton" class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 min-w-[44px] sm:min-w-[120px] flex items-center justify-center gap-2 hover:scale-105 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 relative group" title="Sprache wechseln">
        <span id="currentFlag" class="text-xl sm:text-2xl filter drop-shadow-sm transition-transform duration-200 hover:scale-110">🇩🇪</span>
        <span id="currentLanguageName" class="text-xs sm:text-sm font-medium hidden sm:inline whitespace-nowrap transition-opacity duration-200" data-i18n="header.language">Deutsch</span>
        <!-- Tooltip -->
        <div id="languageTooltip" class="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Klicke zum Wechseln
        </div>
      </button>
      
      <!-- Dark Mode Toggle Button -->
      <button id="darkModeToggle" class="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-600 relative">
        <svg id="sunIcon" class="w-5 h-5 sm:w-6 sm:h-6 absolute inset-0 m-auto opacity-0 transition-all duration-500 ease-in-out transform scale-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
        <svg id="moonIcon" class="w-5 h-5 sm:w-6 sm:h-6 transition-all duration-500 ease-in-out transform scale-100 opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
        </svg>
      </button>
    </div>

    <!-- Hero Section -->
    <section class="py-16 sm:py-20 px-4 relative overflow-hidden">
      <!-- Background Video -->
      <div class="absolute inset-0 z-0">
        <video 
          id="backgroundVideo"
          autoplay 
          muted 
          loop 
          playsinline
          class="w-full h-full object-cover object-top opacity-80"
          preload="metadata"
          style="object-position: center 30%;"
        >
          <source src="/media/hochzeitsvideo.webm" type="video/webm">
          <source src="/media/hochzeitsvideo.mp4" type="video/mp4">
          <source src="/media/hochzeitsvideo.mov" type="video/quicktime">
          <!-- Fallback für ältere Browser -->
          Ihr Browser unterstützt das Video-Element nicht.
        </video>
        <!-- Overlay für bessere Lesbarkeit des Textes -->
        <div class="absolute inset-0 bg-gradient-to-br from-rose-50/30 via-pink-50/25 to-purple-50/30 dark:from-gray-900/40 dark:via-gray-800/35 dark:to-purple-900/40"></div>
      </div>
      
      <div class="max-w-4xl mx-auto text-center relative z-10">
        <!-- Hearts decoration -->
        <div class="flex justify-center mb-6 sm:mb-8">
          <div class="flex space-x-2 text-rose-400 drop-shadow-lg">
            <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
            <svg class="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
            <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
        
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 transition-colors duration-300 leading-tight" data-i18n="hero.title">
          Wir heiraten!
        </h1>
        
        <div class="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 mb-6 sm:mb-8 font-light transition-colors duration-300">
          <p class="mb-2" data-i18n="hero.names">Anna & Michell</p>
          <p class="text-base sm:text-lg md:text-xl text-rose-600 dark:text-rose-400" data-i18n="hero.date">03. Juni 2025</p>
        </div>
        
        <p class="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-xl sm:max-w-2xl mx-auto leading-relaxed transition-colors duration-300 px-4 sm:px-0" data-i18n="hero.description">
          Liebe Familie und Freunde, wir freuen uns riesig, diesen besonderen Tag mit euch zu teilen! 
          Hier findet ihr alle wichtigen Informationen zu unserer Hochzeit.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4 sm:px-0">
          <a href="#trauung" class="w-full sm:w-auto bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 text-center text-sm sm:text-base whitespace-nowrap" data-i18n="hero.buttons.ceremony">
            Zur Trauung
          </a>
          <a href="#fotos" class="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 text-center text-sm sm:text-base whitespace-nowrap" data-i18n="hero.buttons.photos">
            Zu den Fotos
          </a>
          <a href="#feier" class="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 sm:px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 text-center text-sm sm:text-base whitespace-nowrap" data-i18n="hero.buttons.party">
            Zur Feier
          </a>
        </div>
      </div>
    </section>

    <!-- Hero Galerie Section (separate from video background) -->
    <section class="py-8 sm:py-12 px-4 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300">
      <!-- Hero Galerie -->
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-6">
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2" data-i18n="hero.gallery.title">Unsere schönsten Momente</h3>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300" data-i18n="hero.gallery.subtitle">Erinnerungen, die uns verbinden</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4" id="heroGalleryContainer">
          <div class="aspect-square bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer gallery-item"
               data-image="/media/ringtausch.jpg">
            <div class="w-full h-full relative">
              <img class="w-full h-full object-cover opacity-0 transition-opacity duration-500 lazy-image" 
                   data-src="/media/ringtausch.jpg" 
                   loading="lazy">
              <!-- Loading placeholder -->
              <div class="absolute inset-0 flex items-center justify-center image-placeholder">
                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer gallery-item"
               data-image="/media/jubel.jpg">
            <div class="w-full h-full relative">
              <img class="w-full h-full object-cover opacity-0 transition-opacity duration-500 lazy-image" 
                   data-src="/media/jubel.jpg" 
                   loading="lazy">
              <!-- Loading placeholder -->
              <div class="absolute inset-0 flex items-center justify-center image-placeholder">
                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer gallery-item"
               data-image="/media/ringtausch-2.jpg">
            <div class="w-full h-full relative">
              <img class="w-full h-full object-cover opacity-0 transition-opacity duration-500 lazy-image" 
                   data-src="/media/ringtausch-2.jpg" 
                   loading="lazy">
              <!-- Loading placeholder -->
              <div class="absolute inset-0 flex items-center justify-center image-placeholder">
                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer gallery-item"
               data-image="/media/first-sight.jpg">
            <div class="w-full h-full relative">
              <img class="w-full h-full object-cover opacity-0 transition-opacity duration-500 lazy-image" 
                   data-src="/media/first-sight.jpg" 
                   loading="lazy">
              <!-- Loading placeholder -->
              <div class="absolute inset-0 flex items-center justify-center image-placeholder">
                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer gallery-item"
               data-image="/media/gruppe-vor-roemer.jpg">
            <div class="w-full h-full relative">
              <img class="w-full h-full object-cover opacity-0 transition-opacity duration-500 lazy-image" 
                   data-src="/media/gruppe-vor-roemer.jpg" 
                   loading="lazy">
              <!-- Loading placeholder -->
              <div class="absolute inset-0 flex items-center justify-center image-placeholder">
                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          <div class="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer gallery-item"
               data-image="/media/trauzeugen.jpg">
            <div class="w-full h-full relative">
              <img class="w-full h-full object-cover opacity-0 transition-opacity duration-500 lazy-image" 
                   data-src="/media/trauzeugen.jpg" 
                   loading="lazy">
              <!-- Loading placeholder -->
              <div class="absolute inset-0 flex items-center justify-center image-placeholder">
                <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trauung Section -->
    <section id="trauung" class="py-16 sm:py-20 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12 sm:mb-16">
          <div class="flex justify-center mb-4">
            <svg class="w-12 h-12 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300" data-i18n="ceremony.title">Die Trauung</h2>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300" data-i18n="ceremony.subtitle">Hier beginnt unser gemeinsamer Weg</p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div class="space-y-4 sm:space-y-6">
            <div class="bg-rose-50 dark:bg-rose-900/20 p-4 sm:p-6 rounded-lg border border-rose-200 dark:border-rose-800 transition-colors duration-300">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center transition-colors duration-300">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 dark:text-rose-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span data-i18n="ceremony.when.title">Wann?</span>
              </h3>
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors duration-300">
                <strong data-i18n="ceremony.when.date">Datum:</strong> <span data-i18n="ceremony.when.dateValue">03. Juni 2025</span><br>
                <strong data-i18n="ceremony.when.meeting">Treffpunkt:</strong> <span data-i18n="ceremony.when.meetingValue">12:00 Uhr vor dem Römer</span>
              </p>
            </div>
            
            <div class="bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-6 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors duration-300">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center transition-colors duration-300">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span data-i18n="ceremony.where.title">Wo?</span>
              </h3>
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors duration-300">
                <strong data-i18n="ceremony.where.venue">Standesamt Frankfurt am Main</strong><br>
                <span data-i18n="ceremony.where.address" data-i18n-html="true">Römerberg 27<br>60311 Frankfurt am Main</span>
              </p>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="bg-gray-100 rounded-lg overflow-hidden shadow-lg relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.469!2d8.6803065!3d50.1107447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd096dd347d1cb%3A0xd2b69b5dba8a6df4!2sStandesamt%20Frankfurt%20am%20Main!5e0!3m2!1sde!2sde!4v1735105200000!5m2!1sde!2sde"
                width="100%" 
                height="300" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                class="w-full h-80">
              </iframe>
              
              <!-- Google Maps Link Overlay auf der Karte -->
              <div class="absolute bottom-4 left-4 right-4">
                <a href="https://maps.google.com/?q=Römerberg+27,+60311+Frankfurt+am+Main" target="_blank" class="inline-flex items-center bg-white hover:bg-gray-50 text-purple-600 hover:text-purple-800 font-semibold px-4 py-2 rounded-lg shadow-lg border border-gray-200 transition-all duration-200">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  <span data-i18n="ceremony.maps.openInGoogleMaps">In Google Maps öffnen</span>
                </a>
              </div>
            </div>
            
            <!-- Parkplatz Button unter der Karte -->
            <a href="https://maps.google.com/?q=Parkhaus+Dom+Römer,+Domstraße+1,+60311+Frankfurt+am+Main" target="_blank" class="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200" data-i18n="ceremony.maps.parking">
              Parkplatz
            </a>
          </div>
        </div>
        
        <!-- Trauung Galerie -->
        <div class="mt-12 sm:mt-16">
          <div class="text-center mb-6 sm:mb-8">
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2" data-i18n="ceremony.gallery.title">Trauungsmomente</h3>
            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300" data-i18n="ceremony.gallery.subtitle">Der Beginn unserer gemeinsamen Reise</p>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div class="aspect-square bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center group hover:scale-105 transition-transform duration-300 shadow-md">
              <div class="text-center">
                <svg class="w-8 h-8 sm:w-12 sm:h-12 text-rose-400 dark:text-rose-300 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
                <p class="text-xs text-gray-500 dark:text-gray-400" data-i18n="gallery.placeholder">Foto kommt bald</p>
              </div>
            </div>
            <div class="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center group hover:scale-105 transition-transform duration-300 shadow-md">
              <div class="text-center">
                <svg class="w-8 h-8 sm:w-12 sm:h-12 text-purple-400 dark:text-purple-300 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <p class="text-xs text-gray-500 dark:text-gray-400" data-i18n="gallery.placeholder">Foto kommt bald</p>
              </div>
            </div>
            <div class="aspect-square bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg flex items-center justify-center group hover:scale-105 transition-transform duration-300 shadow-md">
              <div class="text-center">
                <svg class="w-8 h-8 sm:w-12 sm:h-12 text-amber-400 dark:text-amber-300 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <p class="text-xs text-gray-500 dark:text-gray-400" data-i18n="gallery.placeholder">Foto kommt bald</p>
              </div>
            </div>
            <div class="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg flex items-center justify-center group hover:scale-105 transition-transform duration-300 shadow-md">
              <div class="text-center">
                <svg class="w-8 h-8 sm:w-12 sm:h-12 text-emerald-400 dark:text-emerald-300 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
                <p class="text-xs text-gray-500 dark:text-gray-400" data-i18n="gallery.placeholder">Foto kommt bald</p>
              </div>
            </div>
            <div class="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg flex items-center justify-center group hover:scale-105 transition-transform duration-300 shadow-md">
              <div class="text-center">
                <svg class="w-8 h-8 sm:w-12 sm:h-12 text-blue-400 dark:text-blue-300 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <p class="text-xs text-gray-500 dark:text-gray-400" data-i18n="gallery.placeholder">Foto kommt bald</p>
              </div>
            </div>
            <div class="aspect-square bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg flex items-center justify-center group hover:scale-105 transition-transform duration-300 shadow-md">
              <div class="text-center">
                <svg class="w-8 h-8 sm:w-12 sm:h-12 text-pink-400 dark:text-pink-300 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                </svg>
                <p class="text-xs text-gray-500 dark:text-gray-400" data-i18n="gallery.placeholder">Foto kommt bald</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fotos Section -->
    <section id="fotos" class="py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-indigo-900 dark:to-purple-900 transition-colors duration-300">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12 sm:mb-16">
          <div class="flex justify-center mb-4">
            <svg class="w-12 h-12 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300" data-i18n="photos.title">Fotos</h2>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300" data-i18n="photos.subtitle">Festhalten der schönsten Momente</p>
        </div>
        
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <!-- Gruppenfotos -->
          <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg transition-colors duration-300">
            <div class="flex justify-center mb-3 sm:mb-4">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 text-center transition-colors duration-300" data-i18n="photos.gruppenfotos.title">Gruppenfotos</h3>
            <div class="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p class="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <strong data-i18n="photos.gruppenfotos.time">Nach der Trauung</strong>
              </p>
              <p class="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <span class="text-indigo-600 dark:text-indigo-400 font-medium" data-i18n="photos.gruppenfotos.location">Vor dem Römer</span>
              </p>
              <p class="text-gray-700 dark:text-gray-300 mt-2 sm:mt-3 transition-colors duration-300 text-xs sm:text-sm leading-relaxed" data-i18n="photos.gruppenfotos.description">
                Wir werden direkt nach der Trauung gemeinsame Gruppenfotos vor dem historischen Römer machen.
              </p>
            </div>
          </div>

          <!-- Brautpaarfotos -->
          <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg transition-colors duration-300">
            <div class="flex justify-center mb-3 sm:mb-4">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 text-center transition-colors duration-300" data-i18n="photos.brautpaarfotos.title">Brautpaarfotos</h3>
            <div class="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p class="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <strong data-i18n="photos.brautpaarfotos.time">Nach den Gruppenfotos</strong>
              </p>
              <p class="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <span class="text-rose-600 dark:text-rose-400 font-medium" data-i18n="photos.brautpaarfotos.location">Neue Altstadt Frankfurt</span>
              </p>
              <p class="text-gray-700 dark:text-gray-300 mt-2 sm:mt-3 transition-colors duration-300 text-xs sm:text-sm leading-relaxed" data-i18n="photos.brautpaarfotos.description">
                Anschließend machen wir romantische Brautpaarfotos in der neuen Altstadt. Die anderen Gäste können währenddessen bereits zur Location fahren.
              </p>
            </div>
          </div>

          <!-- Sektempfang Fotos -->
          <div class="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg transition-colors duration-300 sm:col-span-2 lg:col-span-1">
            <div class="flex justify-center mb-3 sm:mb-4">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 text-center transition-colors duration-300" data-i18n="photos.sektempfang.title">Weitere Fotos</h3>
            <div class="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <p class="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <strong data-i18n="photos.sektempfang.time">Beim Sektempfang</strong>
              </p>
              <p class="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <span class="text-amber-600 dark:text-amber-400 font-medium" data-i18n="photos.sektempfang.location">MANO im Engelhof</span>
              </p>
              <p class="text-gray-700 dark:text-gray-300 mt-2 sm:mt-3 transition-colors duration-300 text-xs sm:text-sm leading-relaxed" data-i18n="photos.sektempfang.description">
                Ein paar weitere schöne Fotos werden beim Sektempfang in der Location gemacht.
              </p>
            </div>
          </div>
        </div>

        <!-- Verfügbarkeit Hinweis -->
        <div class="bg-indigo-50 dark:bg-indigo-900/20 p-6 sm:p-8 rounded-lg border border-indigo-200 dark:border-indigo-800 text-center transition-colors duration-300">
          <div class="flex justify-center mb-3 sm:mb-4">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3 transition-colors duration-300" data-i18n="photos.availability.title">Verfügbarkeit</h3>
          <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors duration-300" data-i18n="photos.availability.description">
            Der Link zu allen Fotos wird später auf dieser Webseite verfügbar sein.
          </p>
        </div>
        
        <!-- Danksagung -->
        <div class="mt-16 sm:mt-20">
          <div class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div class="text-center mb-6">
              <div class="flex justify-center mb-4">
                <svg class="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2" data-i18n="photos.thanks.title">Danksagung</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-6" data-i18n="photos.thanks.subtitle">Ein besonderer Dank geht an unsere talentierten Fotografen:</p>
            </div>
            
            <div class="grid sm:grid-cols-3 gap-4 sm:gap-6">
              <!-- Leon -->
              <div class="text-center group">
                <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 group-hover:shadow-md transition-all duration-300">
                  <div class="flex justify-center mb-3">
                    <svg class="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h4 class="font-semibold text-gray-800 dark:text-white mb-2">Leon</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Fotograf</p>
                </div>
              </div>
              
              <!-- Daniel -->
              <div class="text-center group">
                <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 group-hover:shadow-md transition-all duration-300">
                  <div class="flex justify-center mb-3">
                    <svg class="w-6 h-6 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h4 class="font-semibold text-gray-800 dark:text-white mb-2">Daniel</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Fotograf</p>
                </div>
              </div>
              
              <!-- Maja -->
              <div class="text-center group">
                <div class="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 group-hover:shadow-md transition-all duration-300">
                  <div class="flex justify-center mb-3">
                    <svg class="w-6 h-6 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h4 class="font-semibold text-gray-800 dark:text-white mb-2">Maja</h4>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Fotografin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Galerie -->
        <div class="mt-12 sm:mt-16">
          <div class="text-center mb-6 sm:mb-8">
            <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2" data-i18n="party.gallery.title">Bilder Gallerie</h3>
            <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300" data-i18n="party.gallery.subtitle">Die schönsten Momente unserer Hochzeitsfeier</p>
          </div>
          <div id="galleryContainer" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <!-- Gallery items will be loaded here dynamically -->
          </div>
          
          <!-- Loading indicator -->
          <div id="galleryLoading" class="text-center py-8">
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 transition ease-in-out duration-150 cursor-not-allowed">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Bilder werden geladen...
            </div>
          </div>
          
          <!-- Lightbox Modal -->
          <div id="lightboxModal" class="fixed inset-0 bg-black bg-opacity-90 z-50 hidden items-center justify-center p-4">
            <div class="relative max-w-4xl max-h-full">
              <button id="closeLightbox" class="absolute top-4 right-4 text-white hover:text-gray-300 z-10">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              
              <!-- Previous Image Button -->
              <button id="prevImage" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all duration-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              
              <!-- Next Image Button -->
              <button id="nextImage" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all duration-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              
              <img id="lightboxImage" class="max-w-full max-h-full object-contain rounded-lg cursor-pointer" src="" alt="">
              
              <!-- Image Counter -->
              <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
                <span id="imageCounter">1 / 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Feier Section -->
    <section id="feier" class="py-16 sm:py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-purple-900 transition-colors duration-300">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center mb-12 sm:mb-16">
          <div class="flex justify-center mb-4">
            <svg class="w-12 h-12 text-purple-500 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 3h12l-1 5c-.5 2.5-2.5 4.5-5 4.5s-4.5-2-5-4.5L6 3z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12.5V19"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 21h6"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300" data-i18n="party.title">Die Hochzeitsfeier</h2>
          <p class="text-base sm:text-lg text-gray-600 dark:text-gray-300 transition-colors duration-300" data-i18n="party.subtitle">Lasst uns gemeinsam feiern!</p>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div class="bg-gray-100 rounded-lg overflow-hidden shadow-lg order-2 md:order-1 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.1!2d8.6773!3d50.1129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd0969a7b1e6e5%3A0x5f3c5c8a9b1c2d3e!2sLeinwebergasse%206%2C%2060311%20Frankfurt%20am%20Main!5e0!3m2!1sde!2sde!4v1735105300000!5m2!1sde!2sde"
              width="100%" 
              height="300" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy" 
              referrerpolicy="no-referrer-when-downgrade"
              class="w-full h-80">
            </iframe>
            
            <!-- Google Maps Link Overlay auf der Karte -->              <div class="absolute bottom-4 left-4 right-4">
                <a href="https://maps.google.com/?q=Leinwebergasse+6,+60311+Frankfurt+am+Main" target="_blank" class="inline-flex items-center bg-white hover:bg-gray-50 text-purple-600 hover:text-purple-800 font-semibold px-4 py-2 rounded-lg shadow-lg border border-gray-200 transition-all duration-200">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  <span data-i18n="party.maps.openInGoogleMaps">In Google Maps öffnen</span>
                </a>
              </div>
          </div>
          
          <div class="space-y-4 sm:space-y-6 order-1 md:order-2">
            <div class="bg-purple-50 dark:bg-purple-900/20 p-4 sm:p-6 rounded-lg border border-purple-200 dark:border-purple-800 transition-colors duration-300">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center transition-colors duration-300">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 dark:text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span data-i18n="party.when.title">Wann?</span>
              </h3>
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors duration-300">
                <strong data-i18n="party.when.date">Datum:</strong> <span data-i18n="party.when.dateValue">03. Juni 2025</span><br>
                <strong data-i18n="party.when.start">Beginn:</strong> <span data-i18n="party.when.startValue">14:30 Uhr</span><br>
                <strong data-i18n="party.when.end">Ende:</strong> <span data-i18n="party.when.endValue">open end</span>
              </p>
            </div>
            
            <div class="bg-rose-50 dark:bg-rose-900/20 p-4 sm:p-6 rounded-lg border border-rose-200 dark:border-rose-800 transition-colors duration-300">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center transition-colors duration-300">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 dark:text-rose-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span data-i18n="party.where.title">Wo?</span>
              </h3>
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors duration-300">
                <strong data-i18n="party.where.venue">MANO im Engelhof</strong><br>
                <span data-i18n="party.where.address" data-i18n-html="true">Leinwebergasse 6<br>60311 Frankfurt am Main</span><br>
                <a href="tel:+496921234567" class="text-rose-600 dark:text-rose-400 hover:underline" data-i18n="party.where.phone">Tel: 069 212345-67</a>
              </p>
            </div>
            
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 sm:p-6 rounded-lg border border-yellow-200 dark:border-yellow-800 transition-colors duration-300">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center transition-colors duration-300">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 dark:text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span data-i18n="party.info.title">Wichtige Infos</span>
              </h3>
              <p class="text-sm sm:text-base text-gray-700 dark:text-gray-300 transition-colors duration-300" data-i18n-list="party.info.items">
                • Dinner & Tanz<br>
                • Cocktailbar<br>
                • Parkplätze vorhanden<br>
                • Dresscode: Festlich
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 dark:bg-gray-900 text-white py-8 sm:py-12 transition-colors duration-300">
      <div class="max-w-4xl mx-auto text-center px-4">
        <div class="flex justify-center mb-4 sm:mb-6">
          <div class="flex space-x-2 text-rose-400 dark:text-rose-300">
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
            <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
            <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4" data-i18n="footer.names">Anna & Michell</h3>
        <p class="text-sm sm:text-base text-gray-300 dark:text-gray-400 mb-4 sm:mb-6 transition-colors duration-300" data-i18n="footer.message">
          Wir freuen uns darauf, diesen besonderen Tag mit euch zu teilen!
        </p>
      </div>
    </footer>
  </div>
`

// Initialize after DOM content is loaded
document.addEventListener('DOMContentLoaded', async () => {
  const toggle   = document.getElementById('darkModeToggle')
  window.sunIcon = document.getElementById('sunIcon')
  window.moonIcon = document.getElementById('moonIcon')

  // Initialize background video
  initBackgroundVideo()

  // Initialize language system first
  await initLanguage()

  // PHASE 1: Load hero gallery images first (priority)
  console.log('🎯 Phase 1: Loading hero gallery images...')
  await loadHeroGalleryImages()

  // PHASE 2: Initialize main gallery structure (without loading images yet)
  console.log('🎯 Phase 2: Setting up main gallery structure...')
  await setupGalleryStructure()

  // PHASE 3: Load remaining images with delay
  console.log('🎯 Phase 3: Loading remaining gallery images...')
  setTimeout(async () => {
    await loadRemainingGalleryImages()
  }, 1000) // 1 second delay to prioritize hero images

  // Initialer Zustand: gespeicherte Präferenz, sonst hell
  const saved = localStorage.getItem('theme')
  console.log('Saved theme:', saved)
  const isDark = saved === 'dark'
  console.log('Is dark mode:', isDark)
  applyDarkMode(isDark)

  toggle.addEventListener('click', () =>
    applyDarkMode(!document.documentElement.classList.contains('dark'))
  )
})

// Function to initialize background video
function initBackgroundVideo() {
  const video = document.getElementById('backgroundVideo')
  if (video) {
    // Ensure video plays properly on mobile devices
    video.setAttribute('playsinline', 'true')
    video.setAttribute('webkit-playsinline', 'true')
    
    // Try to play the video
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Video autoplay failed:', error)
        // Fallback: User interaction required for video play
        document.addEventListener('click', () => {
          video.play().catch(e => console.log('Video play failed:', e))
        }, { once: true })
      })
    }
    
    // Handle video load errors
    video.addEventListener('error', (e) => {
      console.log('Video load error:', e)
      // Hide video on error
      video.style.display = 'none'
    })
    
    // Ensure video is muted
    video.muted = true
    video.volume = 0
  }
}

// Smooth scrolling for navigation links
document.addEventListener('click', function(e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault()
    const targetId = e.target.getAttribute('href').substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }
})

// Gallery functionality for loading media asynchronously
const galleryImages = [
  '1-Preview-1.jpg',
  '2-Preview-2.jpg',
  '28-Preview-28.jpg',
  '30-Preview-30.jpg',
  '31-Preview-31.jpg',
  '32-Preview-32.jpg',
  '33-Preview-33.jpg',
  '34-Preview-34.jpg',
  '35-Preview-35.jpg',
  '36-Preview-36.jpg',
  '37-Preview-37.jpg',
  '39-Preview-39.jpg',
  '4-Preview-4.jpg',
  '41-Preview-41.jpg',
  '42-Preview-42.jpg',
  '43-Preview-43.jpg',
  '44-Preview-44.jpg',
  '45-Preview-45.jpg',
  '46-Preview-46.jpg',
  '47-Preview-47.jpg',
  '48-Preview-48.jpg',
  '49-Preview-49.jpg',
  '5-Preview-5.jpg',
  '50-Preview-50.jpg',
  '51-Preview-51.jpg',
  '52-Preview-52.jpg',
  '53-Preview-53.jpg',
  '55-Preview-55.jpg',
  '56-Preview-56.jpg',
  '57-Preview-57.jpg',
  '58-Preview-58.jpg',
  '59-Preview-59.jpg',
  '6-Preview-6.jpg',
  '60-Preview-60.jpg',
  '61-Preview-61.jpg',
  '62-Preview-62.jpg',
  '63-Preview-63.jpg',
  '64-Preview-64.jpg',
  '65-Preview-65.jpg',
  '66-Preview-66.jpg',
  '67-Preview-67.jpg',
  '68-Preview-68.jpg',
  '69-Preview-69.jpg',
  '7-Preview-7.jpg',
  '70-Preview-70.jpg',
  '71-Preview-71.jpg',
  '72-Preview-72.jpg',
  '73-Preview-73.jpg',
  '74-Preview-74.jpg',
  '75-Preview-75.jpg',
  '76-Preview-76.jpg',
  '77-Preview-77.jpg',
  '78-Preview-78.jpg',
  '79-Preview-79.jpg',
  '8-Preview-8.jpg',
  '80-Preview-80.jpg',
  '81-Preview-81.jpg',
  '82-Preview-82.jpg',
  '83-Preview-83.jpg',
  '85-Preview-85.jpg',
  'alena.jpg',
  'aljona-anna-michell-geschenk.jpg',
  'aljona-kristina.jpg',
  'aljona-torte.jpg',
  'anna-hinten.jpg',
  'anna-michell.jpg',
  'anna-sophia-alena-torte.jpg',
  'dragan-lachend.jpg',
  'dragan-nikola-maja.jpg',
  'gb-kuchen.jpg',
  'geschenke-michell.jpg',
  'heiko-ankommen.jpg',
  'heiko-kristina-anna-michell.jpg',
  'heiko-michell.jpg',
  'iphone-kristina-sophia.jpg',
  'kristina-anna-michell.jpg',
  'lisa.jpg',
  'maja-foto.jpg',
  'maja-lachend.jpg',
  'mama-lida.jpg',
  'michell-anna-torte.jpg',
  'nikola-maja-rede.jpg',
  'ralf.jpg',
  'sascha.jpg',
  'shayan-2.jpg',
  'shayan.jpg',
  'snack-tisch.jpg',
  'snacks-1.jpg',
  'snacks-2.jpg',
  'tisch-anstoßen.jpg',
  'tisch.jpg',
  'torte.jpg',
  'verheiratet.jpg',
  'viktor-rede.jpg',
  'viktor.jpg',
  'willkommenschild.jpg',
  'wowa.jpg'
];

// Hero gallery images - these are loaded first (priority)
const heroGalleryImages = [
  'ringtausch.jpg',
  'jubel.jpg', 
  'ringtausch-2.jpg',
  'first-sight.jpg',
  'gruppe-vor-roemer.jpg',
  'trauzeugen.jpg'
];

// PHASE 1: Load hero gallery images with priority
async function loadHeroGalleryImages() {
  const heroItems = document.querySelectorAll('#heroGalleryContainer .lazy-image');
  
  if (heroItems.length === 0) {
    console.log('No hero gallery items found');
    return;
  }

  console.log(`Loading ${heroItems.length} hero gallery images...`);
  
  // Load all hero images with promise tracking
  const loadPromises = Array.from(heroItems).map((img, index) => {
    return new Promise((resolve, reject) => {
      const placeholder = img.parentElement.querySelector('.image-placeholder');
      const imageSrc = img.dataset.src;
      
      if (!imageSrc) {
        resolve();
        return;
      }

      console.log(`📸 Loading hero image ${index + 1}: ${imageSrc}`);

      img.onload = () => {
        img.classList.remove('opacity-0');
        if (placeholder) {
          placeholder.style.display = 'none';
        }
        console.log(`✅ Hero image loaded: ${imageSrc}`);
        resolve();
      };
      
      img.onerror = () => {
        if (placeholder) {
          placeholder.innerHTML = `
            <svg class="w-8 h-8 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          `;
        }
        console.warn(`❌ Failed to load hero image: ${imageSrc}`);
        resolve(); // Continue even if image fails
      };
      
      // Start loading the image
      img.src = imageSrc;
    });
  });

  // Wait for all hero images to complete loading
  await Promise.allSettled(loadPromises);
  console.log('🎉 All hero gallery images processing completed!');
  
  // Setup initial lightbox functionality for hero images
  setupLightbox();
}

// PHASE 2: Setup main gallery structure without loading images
async function setupGalleryStructure() {
  const container = document.getElementById('galleryContainer');
  const loading = document.getElementById('galleryLoading');
  
  if (!container || !loading) return;
  
  try {
    // Create gallery items HTML without triggering image loads
    const galleryHTML = galleryImages.map((imageName, index) => 
      createGalleryItem(imageName, index)
    ).join('');
    
    // Insert gallery items
    container.innerHTML = galleryHTML;
    
    // Update loading indicator to show phase 2 status
    loading.innerHTML = `
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 transition ease-in-out duration-150">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Hauptgalerie wird vorbereitet...
      </div>
    `;
    
    // Set up lightbox functionality (structure is ready)
    setupLightbox();
    
    console.log('Gallery structure set up successfully');
    
  } catch (error) {
    console.error('Error setting up gallery structure:', error);
  }
}

// PHASE 3: Load remaining gallery images with optimized strategy
async function loadRemainingGalleryImages() {
  const container = document.getElementById('galleryContainer');
  const loading = document.getElementById('galleryLoading');
  const lazyImages = document.querySelectorAll('#galleryContainer .lazy-image');
  
  if (!container || lazyImages.length === 0) {
    console.log('No gallery images to load');
    if (loading) loading.style.display = 'none';
    return;
  }

  console.log(`Starting to load ${lazyImages.length} main gallery images...`);
  
  // Update loading indicator
  loading.innerHTML = `
    <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 transition ease-in-out duration-150">
      <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Galerie wird geladen... <span id="loadingProgress">0/${lazyImages.length}</span>
    </div>
  `;

  let loadedCount = 0;
  const progressElement = document.getElementById('loadingProgress');

  // Load images in batches to prevent overwhelming the browser
  const batchSize = 6; // Load 6 images at a time
  const batches = [];
  
  for (let i = 0; i < lazyImages.length; i += batchSize) {
    batches.push(Array.from(lazyImages).slice(i, i + batchSize));
  }

  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    
    console.log(`📦 Loading batch ${batchIndex + 1}/${batches.length} (${batch.length} images)`);
    
    // Load all images in current batch concurrently
    const batchPromises = batch.map((img, imgIndex) => {
      return new Promise((resolve) => {
        const placeholder = img.parentElement.querySelector('.image-placeholder');
        const imageSrc = img.dataset.src;
        
        if (!imageSrc) {
          resolve();
          return;
        }

        img.onload = () => {
          img.classList.remove('opacity-0');
          if (placeholder) {
            placeholder.style.display = 'none';
          }
          loadedCount++;
          if (progressElement) {
            progressElement.textContent = `${loadedCount}/${lazyImages.length}`;
          }
          console.log(`✅ Gallery image loaded (${loadedCount}/${lazyImages.length}): ${imageSrc}`);
          resolve();
        };
        
        img.onerror = () => {
          if (placeholder) {
            placeholder.innerHTML = `
              <svg class="w-8 h-8 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            `;
          }
          loadedCount++;
          if (progressElement) {
            progressElement.textContent = `${loadedCount}/${lazyImages.length}`;
          }
          console.warn(`❌ Failed to load gallery image: ${imageSrc}`);
          resolve();
        };
        
        // Start loading the image
        img.src = imageSrc;
      });
    });

    // Wait for current batch to complete before starting next batch
    await Promise.allSettled(batchPromises);
    
    // Small delay between batches to prevent browser overload
    if (batchIndex < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  // Hide loading indicator
  loading.style.display = 'none';
  console.log('🎉 All gallery images loading completed!');
  
  // Re-setup lightbox functionality now that all images are loaded
  setupLightbox();
}

// Function to create a gallery item with lazy loading
function createGalleryItem(imageName, index) {
  const imagePath = `/media/${imageName}`;
  
  const gradients = [
    'from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
    'from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
    'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20',
    'from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20',
    'from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20',
    'from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20'
  ];
  
  const gradient = gradients[index % gradients.length];
  
  return `
    <div class="aspect-square bg-gradient-to-br ${gradient} rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300 shadow-md cursor-pointer gallery-item"
         data-image="${imagePath}">
      <div class="w-full h-full relative">
        <img class="w-full h-full object-cover opacity-0 transition-opacity duration-500 lazy-image" 
             data-src="${imagePath}" 
             loading="lazy">
        <!-- Loading placeholder -->
        <div class="absolute inset-0 flex items-center justify-center image-placeholder">
          <svg class="w-8 h-8 text-gray-400 dark:text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>
    </div>
  `;
}

// Function to set up lightbox functionality
function setupLightbox() {
  // Get ALL gallery items (both hero and main gallery)
  const heroGalleryItems = document.querySelectorAll('#heroGalleryContainer .gallery-item:not([data-lightbox-initialized])');
  const mainGalleryItems = document.querySelectorAll('#galleryContainer .gallery-item:not([data-lightbox-initialized])');
  
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeLightbox = document.getElementById('closeLightbox');
  const prevImageBtn = document.getElementById('prevImage');
  const nextImageBtn = document.getElementById('nextImage');
  const imageCounter = document.getElementById('imageCounter');
  
  if (!lightboxModal || !lightboxImage || !closeLightbox) return;
  
  // Create combined images list: hero images + main gallery images
  const allImages = [...heroGalleryImages, ...galleryImages];
  let currentImageIndex = 0;
  
  // Function to update image counter
  function updateImageCounter() {
    if (imageCounter) {
      imageCounter.textContent = `${currentImageIndex + 1} / ${allImages.length}`;
    }
  }
  
  // Function to show image at specific index
  function showImageAtIndex(index) {
    if (index >= 0 && index < allImages.length) {
      currentImageIndex = index;
      const imagePath = `/media/${allImages[index]}`;
      lightboxImage.src = imagePath;
      updateImageCounter();
    }
  }
  
  // Function to show next image
  function showNextImage() {
    const nextIndex = (currentImageIndex + 1) % allImages.length;
    showImageAtIndex(nextIndex);
  }
  
  // Function to show previous image
  function showPreviousImage() {
    const prevIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    showImageAtIndex(prevIndex);
  }
  
  // Add click handlers to hero gallery items (only new ones)
  heroGalleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentImageIndex = index; // Hero images start at index 0
      const imageSrc = item.dataset.image;
      
      lightboxImage.src = imageSrc;
      lightboxModal.classList.remove('hidden');
      lightboxModal.classList.add('flex');
      updateImageCounter();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    });
    
    // Mark as initialized
    item.setAttribute('data-lightbox-initialized', 'true');
  });
  
  // Add click handlers to main gallery items (only new ones)
  mainGalleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      currentImageIndex = heroGalleryImages.length + index; // Main gallery starts after hero images
      const imageSrc = item.dataset.image;
      
      lightboxImage.src = imageSrc;
      lightboxModal.classList.remove('hidden');
      lightboxModal.classList.add('flex');
      updateImageCounter();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    });
    
    // Mark as initialized
    item.setAttribute('data-lightbox-initialized', 'true');
  });
  
  // Only add navigation handlers once
  if (!lightboxModal.hasAttribute('data-navigation-initialized')) {
    // Add click handler to navigation buttons
    if (prevImageBtn) {
      prevImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPreviousImage();
      });
    }
    
    if (nextImageBtn) {
      nextImageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNextImage();
      });
    }
    
    // Add click handler to lightbox image for next image
    lightboxImage.addEventListener('click', (e) => {
      e.stopPropagation();
      showNextImage();
    });
    
    // Add touch support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightboxImage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
    
    lightboxImage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
    
    function handleSwipe() {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;
      
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          // Swipe right - previous image
          showPreviousImage();
        } else {
          // Swipe left - next image
          showNextImage();
        }
      } else {
        // Small swipe or tap - next image
        showNextImage();
      }
    }
    
    // Close lightbox functionality
    function closeLightboxModal() {
      lightboxModal.classList.add('hidden');
      lightboxModal.classList.remove('flex');
      document.body.style.overflow = 'auto';
    }
    
    closeLightbox.addEventListener('click', closeLightboxModal);
    
    // Close on backdrop click
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightboxModal();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('hidden')) {
        switch(e.key) {
          case 'Escape':
            closeLightboxModal();
            break;
          case 'ArrowRight':
          case ' ': // Spacebar
            e.preventDefault();
            showNextImage();
            break;
          case 'ArrowLeft':
            e.preventDefault();
            showPreviousImage();
            break;
        }
      }
    });
    
    // Mark navigation as initialized
    lightboxModal.setAttribute('data-navigation-initialized', 'true');
  }
}
