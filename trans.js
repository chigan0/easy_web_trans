class TranslationManager {
    constructor(words, defaultLang='ru', delimiters = ['{%', '%}'], useLocalStorage = true) {
        // Constructor to initialize TranslationManager object
        // words: Object containing translations for different languages
        // defaultLang: Default language if current language is not set
        // delimiters: Delimiters used for dynamic text replacement
        // useLocalStorage: Flag to determine if localStorage should be used for language storage
        this.words = words;
        this.defaultLang = defaultLang;
        this.delimiters = delimiters;
        this.currentLang = this.getCurrentLanguage() || defaultLang; // Set current language
        this.useLocalStorage = useLocalStorage;
    }

    getCurrentLanguage() {
        // Get the current language from localStorage if available, otherwise use defaultLang
        return this.useLocalStorage ? localStorage.getItem('language') || this.defaultLang : this.defaultLang;
    }

    setCurrentLanguage(lang) {
        // Set the current language and store it in localStorage if enabled
        if (this.useLocalStorage) {
            localStorage.setItem('language', lang);
        }
        this.currentLang = lang;
    }

    initTransWord() {
        // Initialize translation of static text
        this.translateStaticText();
    }

    getWord(key) {
        // Get translation for a specific key in the current language
        // If translation not found, return the key itself
        const langWords = this.words[this.currentLang];
        return langWords && langWords[key] ? langWords[key] : key;
    }

    findWordIndices(text) {
        // Find the indices of the dynamic text within delimiters
        const pattern = new RegExp(`${this.delimiters[0]}\\s*(.*?)\\s*${this.delimiters[1]}`);
        const match = text.match(pattern);
        return match ? { key: match[1].trim(), startIndex: match.index, endIndex: match.index + match[0].length - 1 } : null;
    }

    translateStaticText() {
        // Translate static text elements on the page
        const elementsWithTrans = document.querySelectorAll('[trans], [trans-place], [trans-btn], [data-trans-dynamic], [delimiters-trans]');
        const langWord = this.words[this.currentLang] || {};

        elementsWithTrans.forEach(element => {
            const attributeName = this.getAttributeName(element);
            const attributeValue = element.getAttribute(attributeName);

            switch (attributeName) {
                case 'trans':
                    // Translate text attribute
                    const textToInsert = langWord[attributeValue] || '';
                    const insertToStart = element.hasAttribute('trans-to-start');
                    if (insertToStart) {
                        element.insertAdjacentHTML('afterbegin', textToInsert);
                    } else {
                        element.insertAdjacentHTML('beforeend', textToInsert);
                    }
                    break;
                
                case 'trans-place':
                    // Translate placeholder attribute
                    element.placeholder = langWord[attributeValue] || '';
                    break;
                
                case 'trans-btn':
                    // Translate button text content
                    const buttonText = langWord[attributeValue] || '';
                    element.textContent = buttonText;
                    break;
                
                case 'data-trans-dynamic':
                    // Translate dynamic text content
                    element.textContent = langWord[attributeValue] || '';
                    break;

                case 'delimiters-trans':
                    // Translate text within delimiters
                    this.translateTextWithDelimiters(element, langWord);
                    break;
                
                default:
                    break;
            }
        });
    }

    translateTextWithDelimiters(element, words) {
        // Translate text within delimiters
        let textContent = element.textContent.trim()
        const findResult = this.findWordIndices(textContent);

        if (!findResult)
            return null;

        const { key, startIndex, endIndex } = findResult;
        const newText = textContent.slice(0, startIndex) + (words[key] || key) + textContent.slice(endIndex+1);

        element.textContent = newText;
    }

    getAttributeName(element) {
        // Get the name of the translation attribute for an HTML element
        switch (true) {
            case element.hasAttribute('trans'):
                return 'trans';
            case element.hasAttribute('trans-place'):
                return 'trans-place';
            case element.hasAttribute('trans-btn'):
                return 'trans-btn';
            case element.hasAttribute('data-trans-dynamic'):
                return 'data-trans-dynamic';
            case element.hasAttribute('delimiters-trans'):
                return 'delimiters-trans';
            default:
                return '';
        }
    }
}
