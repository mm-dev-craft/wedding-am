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
    
    // Function to update icons based on current mode
    function updateIcons() {
      const isDark = html.classList.contains('dark')
      console.log('Updating icons, isDark:', isDark)
      
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
    <section class="py-16 sm:py-20 px-4">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Hearts decoration -->
        <div class="flex justify-center mb-6 sm:mb-8">
          <div class="flex space-x-2 text-rose-400">
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

  // Initialize language system first
  await initLanguage()

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
