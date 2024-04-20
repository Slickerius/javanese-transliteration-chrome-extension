# Javanese Transliteration Chrome Extension

by sl0ck

![logo](./logo.png)

---

This is a Chrome extension that automatically transliterates Latin text to Javanese script (*hånåcåråkå*) in real-time, inspired by Chinese keyboards. It can be toggled on or off via the popup.

## Compatibility

This extension works best on sites whose input fields use the native input elements `<input>` and `<textarea>`. Limited support is currently available for sites with custom-made input fields. However, support for X/Twitter has been worked on and is now somewhat functional although still rather buggy.

### Confirmed to work well
- Google
- YouTube
- PasteBin
- etc.

### Works (so-so)
- X/Twitter

### Does not work
- Discord
- WhatsApp Web

## Dependencies

This extension is powered by [carakan.js](https://github.com/masnormen/carakanjs/), and uses Vite + React for its popup rendering.

## Installation

```
npm install
npm run build
```

Then, load the generated `dist/` folder to Chrome by enabling developer mode.

Chrome Web Store entry is in consideration.