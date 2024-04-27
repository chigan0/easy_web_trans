# Управление переводами текстовых элементов на веб-странице

## Описание

Класс `TranslationManager` предоставляет удобный способ управления переводами текстовых элементов на веб-странице. Он позволяет легко переводить различные текстовые элементы на разные языки, что делает ваш веб-сайт доступным для широкой аудитории.

## Использование

1. **Инициализация**

   Создайте экземпляр класса `TranslationManager`, передав объект с переводами и, при необходимости, другие параметры в конструктор:
   ```javascript
   const translations = {
     en: {
       greeting: "Hello",
       placeholder: "Enter text here",
       button: "Submit"
     },
     ru: {
       greeting: "Привет",
       placeholder: "Введите текст здесь",
       button: "Отправить"
     }
   };

   const translator = new TranslationManager(translations);


2. **Управле+ние языком**

Используйте методы getCurrentLanguage() и setCurrentLanguage(lang) для получения текущего языка и установки нового языка соответственно:

```
translator.setCurrentLanguage('en');
console.log(translator.getCurrentLanguage()); // Выведет: 'en'
```

3. **Инициализация перевода**

Вызовите метод initTransWord() для инициализации перевода текстовых элементов на странице:

```
translator.initTransWord();
```

4. **Перевод текста**

Добавьте атрибуты trans, trans-place, trans-btn, data-trans-dynamic к элементам текста, которые требуют перевода, и укажите соответствующие ключи из объекта переводов.

## Поддерживаемые атрибуты для перевода

-   trans: для статического текста.
-  trans-place: для текстовых полей (placeholder).
-  trans-btn: для текста на кнопках.
-  data-trans-dynamic: для динамически изменяемого текста.
-  delimiters-trans: для текста, который требует перевода между разделителями.


```
<div trans="greeting"></div>
<input type="text" trans-place="placeholder">
<button trans-btn="button"></button>
<span data-trans-dynamic="dynamicText"></span>
<p delimiters-trans>Привет, {% user %}! Как дела?</p>
```
