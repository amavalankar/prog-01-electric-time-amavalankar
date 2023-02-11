(() => {
    'use strict'

    const darkIcon = "bi bi-moon-stars-fill"
    const lightIcon = "bi bi-sun-fill"
    const autoIcon = "bi bi-circle-half"
  
    const storedTheme = localStorage.getItem('theme')
  
    const getPreferredTheme = () => {
      if (storedTheme) {
        return storedTheme
      } else {
        return 'auto'
      }
    }

    const getPreferredThemeIcon = () => {
        const currentTheme = getPreferredTheme()

        switch (currentTheme) {
            case 'light':
                return lightIcon
            case 'dark':
                return darkIcon
            case 'auto':
                return autoIcon
            default:
                return autoIcon
        }
    }

    const getSystemTheme = () => {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)");

        if (isDark.matches) {
            return 'dark'
        } else {
            return 'light'
        }
    }
  
    const setTheme = function (theme, icon_label) {
      const systemPref = getSystemTheme()
      const togglerIcon = document.querySelector('#theme-toggler-icon')

      togglerIcon.setAttribute('class', icon_label)

      if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', systemPref)
      } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
      }
    }
    
    const showActiveTheme = (theme, icon_label) => {
      const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`)

      document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
        element.classList.remove('active')
      })
  
      setTheme(theme, icon_label)
      btnToActive.classList.add('active')
    }

    showActiveTheme(getPreferredTheme(), getPreferredThemeIcon())

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const storedPref = localStorage.getItem('theme')

        if (storedPref === 'auto' || storedPref === null) {
            if (storedTheme !== 'light' || storedTheme !== 'dark') {
                setTheme(getPreferredTheme(), getPreferredThemeIcon())
            } 
        }
      
    })
  
    window.addEventListener('DOMContentLoaded', () => {
      showActiveTheme(getPreferredTheme(), getPreferredThemeIcon())
  
      document.querySelectorAll('[data-bs-theme-value]')
        .forEach(toggle => {
          toggle.addEventListener('click', () => {
            const theme = toggle.getAttribute('data-bs-theme-value')
            const icon_label = toggle.getAttribute('data-bs-bi-icon')
            localStorage.setItem('theme', theme)
            showActiveTheme(theme, icon_label)
          })
        })
    })
  })()