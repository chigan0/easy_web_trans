class TranslationManager {
    constructor(words, defaultLang='ru', delimiters = ['{%', '%}'], useLocalStorage = true) {
        this.words = words;
        this.defaultLang = defaultLang;
        this.delimiters = delimiters;
        this.currentLang = this.getCurrentLanguage() || defaultLang;
        this.useLocalStorage = useLocalStorage;
    }

    getCurrentLanguage() {
        return this.useLocalStorage ? localStorage.getItem('language') || this.defaultLang : this.defaultLang;
    }

    setCurrentLanguage(lang) {
        if (this.useLocalStorage) {
            localStorage.setItem('language', lang);
        }
        this.currentLang = lang;
    }

    initTransWord() {
        this.translateStaticText();
    }

    findWordIndices(text) {
        const pattern = new RegExp(`${this.delimiters[0]}\\s*(.*?)\\s*${this.delimiters[1]}`);
        const match = text.match(pattern);
        return match ? { key: match[1].trim(), startIndex: match.index, endIndex: match.index + match[0].length - 1 } : null;
    }

    translateStaticText() {
        const elementsWithTrans = document.querySelectorAll('[trans], [trans-place], [trans-btn], [data-trans-dynamic], [delimiters-trans]');
        const langWord = this.words[this.currentLang] || {};

        elementsWithTrans.forEach(element => {
            const attributeName = this.getAttributeName(element);
            const attributeValue = element.getAttribute(attributeName);

            switch (attributeName) {
                case 'trans':
                    const textToInsert = langWord[attributeValue] || '';
                    const insertToStart = element.hasAttribute('trans-to-start');
                    if (insertToStart) {
                        element.insertAdjacentHTML('afterbegin', textToInsert);
                    } else {
                        element.insertAdjacentHTML('beforeend', textToInsert);
                    }
                    break;
                
                case 'trans-place':
                    element.placeholder = langWord[attributeValue] || '';
                    break;
                
                case 'trans-btn':
                    const buttonText = langWord[attributeValue] || '';
                    element.textContent = buttonText;
                    break;
                
                case 'data-trans-dynamic':
                    element.textContent = langWord[attributeValue] || '';
                    break;

                case 'delimiters-trans':
                    this.translateTextWithDelimiters(element, langWord); // Вызываем метод для замены текста между разделителями
                
                default:
                    break;
            }
        });
    }

    translateTextWithDelimiters(element, words) {
        let textContent = element.textContent.trim()
        const findResutl = this.findWordIndices(textContent);

        if (!findResutl)
            return null;

        const {key, startIndex, endIndex} = findResutl;
        const newText = textContent.slice(0, startIndex) + (words[key] || key) + textContent.slice(endIndex+1);

        element.textContent = newText;
    }

    getAttributeName(element) {
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
