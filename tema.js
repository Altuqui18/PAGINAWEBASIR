(function () {
    const STORAGE_KEY = 'theme-preference';
    const THEME_DARK = 'dark';
    const THEME_LIGHT = 'light';

    function applyTheme(theme) {
        const isDark = theme === THEME_DARK;

        document.body.classList.toggle('modo-oscuro', isDark);
        document.body.dataset.theme = theme;
        document.documentElement.dataset.theme = theme;

        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (error) {
            console.warn('No se pudo guardar la preferencia del tema.', error);
        }
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY) || THEME_LIGHT;
        } catch (error) {
            return THEME_LIGHT;
        }
    }

    function initializeTheme() {
        applyTheme(getStoredTheme());
    }

    document.addEventListener('DOMContentLoaded', initializeTheme);
    window.applyTheme = applyTheme;
    window.getCurrentTheme = () => (document.body.classList.contains('modo-oscuro') ? THEME_DARK : THEME_LIGHT);
})();
