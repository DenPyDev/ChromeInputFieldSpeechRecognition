// ==UserScript==
// @name         Chrome-Input-Field-Speech-Recognition
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Toggle speech recognition with ALT key, refresh with ALT key, right-click  on the microphone icon >> language selection
// @author       DenPyDev
// @match        *://*/*
// @updateURL    https://github.com/DenPyDev/ChromeInputFieldSpeechRecognition/raw/main/Chrome-Input-Field-Speech-Recognition.user.js
// @downloadURL  https://github.com/DenPyDev/ChromeInputFieldSpeechRecognition/raw/main/Chrome-Input-Field-Speech-Recognition.user.js
// @grant        none
// ==/UserScript==


(function() {

    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support the Web Speech API. Please upgrade.');
        return;
    }

    let savedLang = localStorage.getItem('speechRecogLang') || 'en-US';
    let isRecording = false;
    let recognitions = [];
    let micVisible = false;

    const languages = {
        "Afrikaans": "af-ZA",
        "Amharic": "am-ET",
        "Arabic": "ar-AE",
        "Azerbaijani": "az-AZ",
        "Basque": "eu-ES",
        "Bengali": "bn-BD",
        "Bulgarian": "bg-BG",
        "Catalan": "ca-ES",
        "Chinese": "cmn-Hans-CN",
        "Croatian": "hr-HR",
        "Czech": "cs-CZ",
        "Danish": "da-DK",
        "Dutch": "nl-NL",
        "English": "en-US",
        "Filipino": "fil-PH",
        "Finnish": "fi-FI",
        "French": "fr-FR",
        "Galician": "gl-ES",
        "German": "de-DE",
        "Greek": "el-GR",
        "Gujarati": "gu-IN",
        "Hebrew": "he-IL",
        "Hindi": "hi-IN",
        "Hungarian": "hu-HU",
        "Icelandic": "is-IS",
        "Indonesian": "id-ID",
        "Italian": "it-IT",
        "Japanese": "ja-JP",
        "Kannada": "kn-IN",
        "Khmer": "km-KH",
        "Korean": "ko-KR",
        "Lao": "lo-LA",
        "Lithuanian": "lt-LT",
        "Malay": "ms-MY",
        "Norwegian Bokmål": "nb-NO",
        "Persian": "fa-IR",
        "Polish": "pl-PL",
        "Portuguese": "pt-PT",
        "Romanian": "ro-RO",
        "Russian": "ru-RU",
        "Serbian": "sr-RS",
        "Slovak": "sk-SK",
        "Slovenian": "sl-SI",
        "Spanish": "es-ES",
        "Swedish": "sv-SE",
        "Thai": "th-TH",
        "Turkish": "tr-TR",
        "Ukrainian": "uk-UA",
        "Urdu": "ur-PK",
        "Vietnamese": "vi-VN",
        "Zulu": "zu-ZA"
    };

    function changeLanguage(lang) {
        savedLang = lang;
        localStorage.setItem('speechRecogLang', lang);
        recognitions.forEach(recognition => {
            if (recognition && recognition.lang !== savedLang) {
                if (recognition.recognizing) {
                    recognition.stop();
                }
                recognition.lang = savedLang;
            }
        });
    }

    function addVoiceRecognitionButton(inputField) {
        if (inputField.nextSibling && inputField.nextSibling.classList.contains('voice-recognition-btn')) {
            return;
        }

        let button = document.createElement('button');
        button.textContent = '🎤';
        button.className = 'voice-recognition-btn';
        button.style.position = 'absolute';
        button.style.zIndex = '9999';
        inputField.parentNode.insertBefore(button, inputField.nextSibling);

        let recognition = new webkitSpeechRecognition();
        recognition.lang = savedLang;
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = function(event) {
            let final_transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript + ' ';
                }
            }

            const start = inputField.selectionStart;
            const end = inputField.selectionEnd;
            const beforeText = inputField.value.substring(0, start);
            const afterText = inputField.value.substring(end);
            inputField.value = beforeText + final_transcript + afterText;
            inputField.selectionStart = start + final_transcript.length;
            inputField.selectionEnd = start + final_transcript.length;
        };

        recognition.onstart = function() {
            button.style.backgroundColor = 'red';
            isRecording = true;
        };

        recognition.onend = function() {
            button.style.backgroundColor = '';
            isRecording = false;
        };

        button.onclick = function() {
            if (isRecording) {
                recognition.stop();
            } else {
                recognition.start();
            }
        };

        button.oncontextmenu = function(event) {
            if (isRecording) {

                alert('Cannot change language during active recording. Please stop the recording before changing the language');
                event.preventDefault();
            } else {

                event.preventDefault();
                const buttonRect = this.getBoundingClientRect();
                showLanguageMenu(event.clientX, event.clientY, buttonRect);
            }
        };

        recognitions.push(recognition);
    }

    function showLanguageMenu(x, y) {

        const existingMenu = document.getElementById('speech-recog-lang-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.id = 'speech-recog-lang-menu';
        menu.style.position = 'fixed';
        menu.style.backgroundColor = 'black';
        menu.style.color = 'white';
        menu.style.border = '1px solid white';
        menu.style.padding = '5px';
        menu.style.zIndex = '10000';
        menu.style.maxHeight = '300px';
        menu.style.overflowY = 'scroll';

        Object.entries(languages).forEach(([name, code]) => {
            const langOption = document.createElement('div');
            langOption.textContent = name;
            langOption.style.padding = '2px 5px';
            if (savedLang === code) {
                langOption.style.fontWeight = 'bold';
                langOption.style.backgroundColor = '#DDD';
            }

            langOption.onclick = () => {
                changeLanguage(code);
                menu.remove();
            };

            menu.appendChild(langOption);
        });


        document.body.appendChild(menu);


        const menuRect = menu.getBoundingClientRect();
        const spaceRight = window.innerWidth - x;
        const spaceBelow = window.innerHeight - y;

        if (spaceRight < menuRect.width) {
            menu.style.left = `${x - menuRect.width}px`;
        } else {
            menu.style.left = `${x}px`;
        }

        if (spaceBelow < menuRect.height) {
            menu.style.top = `${y - menuRect.height}px`;
        } else {
            menu.style.top = `${y}px`;
        }
    }

    function shouldDisplayAbove(x, y) {
        const screenHeight = window.innerHeight;
        const menuHeight = 300;
        return (screenHeight - y) < menuHeight;
    }

    function toggleMicVisibility() {
        micVisible = !micVisible;
        document.querySelectorAll('.voice-recognition-btn').forEach(button => {
            button.style.display = micVisible ? '' : 'none';
        });
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Alt') {
            event.preventDefault();
            if (!isRecording) {
                toggleMicVisibility();
            }
            document.querySelectorAll('input[type="text"], textarea').forEach(inputField => {
                if (micVisible) {
                    addVoiceRecognitionButton(inputField);
                }
            });
        }
    });

})();