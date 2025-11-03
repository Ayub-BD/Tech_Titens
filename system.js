document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const langToggle = document.getElementById('main-language-toggle');
    let currentPage = 'home'; // Default page

    // Function to load content from a file
    async function loadPage(pageName) {
        try {
            // Show loading spinner
            appContent.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
            
            // Fetch the content of the page
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`Page ${pageName} not found.`);
            }
            const html = await response.text();
            
            // Inject the new content
            appContent.innerHTML = html;
            
            // Update active navigation link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === pageName) {
                    link.classList.add('active');
                }
            });

            // Apply the current language to the new content
            applyLanguage(localStorage.getItem('language') || 'en');
            
            // Re-attach any page-specific event listeners if needed
            // For example, the submit button in Page 3
            if (pageName === 'page3') {
                const pageToggle = document.getElementById('page-toggle');
                if(pageToggle) {
                   // The logic is already in the CSS, but if it were JS, we'd re-attach it here.
                }
            }
            
            currentPage = pageName;

        } catch (error) {
            appContent.innerHTML = `<div class="error-message"><h2>Content Not Found</h2><p>Sorry, the page you requested could not be loaded.</p></div>`;
            console.error('Error loading page:', error);
        }
    }

    // Function to apply language
    function applyLanguage(lang) {
        document.body.setAttribute('data-lang', lang);
        const elementsToTranslate = document.querySelectorAll('[data-en], [data-bn]');
        
        elementsToTranslate.forEach(el => {
            if (lang === 'bn' && el.hasAttribute('data-bn')) {
                el.textContent = el.getAttribute('data-bn');
            } else {
                el.textContent = el.getAttribute('data-en');
            }
        });
        
        // Update toggle button text
        const toggleText = langToggle.querySelector('span');
        if (toggleText) {
            toggleText.textContent = lang === 'bn' ? 'English' : 'বাংলা';
        }
    }

    // Event listener for navigation clicks
    document.querySelector('.main-nav').addEventListener('click', (e) => {
        e.preventDefault();
        const link = e.target.closest('.nav-link');
        if (link) {
            const pageName = link.getAttribute('data-page');
            if (pageName && pageName !== currentPage) {
                loadPage(pageName);
            }
        }
    });

    // Event listener for language toggle
    langToggle.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'en';
        const newLang = currentLang === 'en' ? 'bn' : 'en';
        localStorage.setItem('language', newLang);
        applyLanguage(newLang);
    });

    // Initialize the app
    function init() {
        const savedLang = localStorage.getItem('language') || 'en';
        applyLanguage(savedLang);
        loadPage('home'); // Load the default home page
    }

    init();
});