document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const navLinks = document.querySelectorAll('.nav-link');
    const langToggle = document.getElementById('main-language-toggle');
    let currentPage = 'home'; 

    
    async function loadPage(pageName) {
        try {
            
            appContent.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i></div>';
            
            
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) {
                throw new Error(`Page ${pageName} not found.`);
            }
            const html = await response.text();
            
            
            appContent.innerHTML = html;
            
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === pageName) {
                    link.classList.add('active');
                }
            });

           
            applyLanguage(localStorage.getItem('language') || 'en');
            
            
            if (pageName === 'page3') {
                const pageToggle = document.getElementById('page-toggle');
                if(pageToggle) {
                   
                }
            }
            
            currentPage = pageName;

        } catch (error) {
            appContent.innerHTML = `<div class="error-message"><h2>Content Not Found</h2><p>Sorry, the page you requested could not be loaded.</p></div>`;
            console.error('Error loading page:', error);
        }
    }

 
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
        
       
        const toggleText = langToggle.querySelector('span');
        if (toggleText) {
            toggleText.textContent = lang === 'bn' ? 'English' : 'বাংলা';
        }
    }

    
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

   
    langToggle.addEventListener('click', () => {
        const currentLang = localStorage.getItem('language') || 'en';
        const newLang = currentLang === 'en' ? 'bn' : 'en';
        localStorage.setItem('language', newLang);
        applyLanguage(newLang);
    });

   
    function init() {
        const savedLang = localStorage.getItem('language') || 'en';
        applyLanguage(savedLang);
        loadPage('home'); 
    }

    init();
});