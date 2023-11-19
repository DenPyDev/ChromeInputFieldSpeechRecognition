# Chrome-Input-Field-Speech-Recognition

## Description
This userscript adds speech recognition functionality to text input fields and textareas across all websites in Chrome browser. Users can enable speech recognition by pressing the 'Alt' key and select their preferred language for recognition.

## Key Features
- **Language Selection**: Users can choose a language for speech recognition from a list of supported languages.
- **Speech Recognition Toggle**: Press the 'Alt' key to toggle the speech recognition mode on or off.
- **Speech Recognition Indicator**: A microphone button appears next to text input fields, indicating the activity of speech recognition.
- **Inserting Recognized Text**: Recognized speech is inserted into the input field.

## Installation and Usage
1. Install the [Tampermonkey for Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
2. Add the "Chrome-Input-Field-Speech-Recognition" script to Tampermonkey. [Click Here and Press Install](https://github.com/DenPyDev/ChromeInputFieldSpeechRecognition/raw/main/Chrome-Input-Field-Speech-Recognition.user.js)
3. Reload the web pages where you want to use speech recognition.
4. Press 'Alt' to display the microphone button next to text input fields.
5. Click the microphone button to start speech recognition.
6. Right-click on the microphone button to open a language selection menu for speech recognition.

## Handling Dynamic Input Fields
- If a new input field appears dynamically (e.g., from a span element) while you are on a page, you need to refresh the visibility of microphone buttons:
    - First, press 'Alt' to hide all microphone icons.
    - Then, press 'Alt' again to make them reappear, including in the newly appeared input field.
 

![Speech Recognition in Action](https://raw.githubusercontent.com/DenPyDev/ChromeInputFieldSpeechRecognition/main/example.png)
