(async () => {
  const src = chrome.runtime.getURL("carakanjs.js");
  const carakanjs = await import(src);
  const isActive = (await chrome.storage.sync.get('isTransliterationActive')).isTransliterationActive;

  const getTokenToTransliterate = (str, isAtEnd = false) => {
    let foundInitialWhitespace = false;
    let foundNonWhitespace = false;
    let res = '';
    let matchStart = 0;
    let matchEnd = -1;
  
    for (let i = str.length; i >= 0; i--) {
      let currentChar = str.charAt(i);
      let isWhitespace = /\s/.test(currentChar);
  
      if (isWhitespace && !foundInitialWhitespace) {
        foundInitialWhitespace = true;
      } else if (isWhitespace && foundInitialWhitespace && !foundNonWhitespace) {
        return [String.fromCharCode(24), -1, -1];
      }
  
      if (!isWhitespace && !foundNonWhitespace && foundInitialWhitespace || !isWhitespace && !foundNonWhitespace && isAtEnd) {
        foundNonWhitespace = true;
        matchEnd = i + 1;
      }
  
      if (isWhitespace && foundNonWhitespace) {
        matchStart = i + 1;
        break;
      }
  
      if (!isWhitespace && foundNonWhitespace) {
        res = currentChar + res;
      }
    }
  
    return [res, matchStart, matchEnd];
  };
  
  const extractTextFromChildren = (el, n) => {
    if (el.innerText != '' && el.innerHTML.charAt(0) != '<') {
      return [el.innerText, el];
    }
  
    if (el.childNodes.length == 0) {
      return ['', el];
    }

    let offset = 0;

    if (el.childNodes.length >= n)
      offset = el.childNodes.length - n;
  
    return extractTextFromChildren(el.childNodes[offset], n);
  };

  const traverseElement = (el) => {
    if (el.innerText != '' && el.innerHTML.charAt(0) != '<') {
      return console.log(el.outerHTML);
    }
  
    if (el.childNodes.length == 0) {
      return console.log(el.outerHTML);
    }
  
    traverseElement(el.childNodes[0]);

    console.log(el.outerHTML);
  };
  
  const setCursorEditable = (editableEl, position) => {
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(editableEl.childNodes[0], position);
    range.collapse(true);
  
    sel.removeAllRanges();
    sel.addRange(range);
    editableEl.focus();
  };
  
  document.addEventListener('keyup', (e) => {
    if (isActive !== 'true')
      return;

    switch (e.code) {
      case "Space":
      case "Enter":
        if (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT') {
          let activeElement = document.activeElement;
          let pos = activeElement.selectionStart;
          let textContent = activeElement.value.substring(0, pos);
          let suffix = activeElement.value.substring(pos);
  
          let [tokenToTransliterate, tokenStart, tokenEnd] = getTokenToTransliterate(textContent);
          
          if (tokenToTransliterate !== String.fromCharCode(24) && tokenToTransliterate.match(/[a-z]/i)) {
            let replacement = carakanjs.toJavanese(tokenToTransliterate);
  
            textContent = textContent.slice(0, tokenStart) + replacement + textContent.slice(tokenEnd) + suffix;
            document.activeElement.value = textContent;
            document.activeElement.selectionEnd = tokenStart + replacement.length + 1;
          }
        } else if (document.activeElement.nodeName == 'DIV') {
          let [extractedText, extractedElement] = extractTextFromChildren(document.activeElement, 1);
          let [tokenToTransliterate, tokenStart, tokenEnd] = getTokenToTransliterate(extractedText);
          let isAtNewline = false;

          if (e.code === "Enter") {
            [extractedText, extractedElement] = extractTextFromChildren(document.activeElement, 2);
            [tokenToTransliterate, tokenStart, tokenEnd] = getTokenToTransliterate(extractedText, true);
            isAtNewline = true;
          }

          if (tokenToTransliterate !== String.fromCharCode(24) && tokenToTransliterate.match(/[a-z]/i) || tokenToTransliterate !== String.fromCharCode(24) && e.code === "Enter") {
            let replacement = carakanjs.toJavanese(extractedText);
            
            let textContent = extractedText.slice(0, tokenStart) + replacement + extractedText.slice(tokenEnd);
            extractedElement.innerText = textContent;
            extractedElement.innerText = textContent.substring(textContent.length - 1);
            extractedElement.innerText = extractedElement.innerText + 's';
            extractedElement.innerText = textContent;
            setCursorEditable(extractedElement, tokenStart + replacement.length);

            if (isAtNewline) {
              [extractedText, extractedElement] = extractTextFromChildren(document.activeElement, 1);
              extractedElement.parentNode.innerHTML = '<span data-text="true"> </span>';
              [extractedText, extractedElement] = extractTextFromChildren(document.activeElement, 1);

              setCursorEditable(extractedElement, 0);
            } else {
              setCursorEditable(extractedElement, tokenStart + replacement.length + 1);
            }
          }
        }
        break;
      default:
        if (document.activeElement.nodeName == 'DIV' && ["ControlLeft", "ControlRight", "ShiftLeft", "ShiftRight", "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].indexOf(e.code) === -1) {
          let [extractedText, extractedElement] = extractTextFromChildren(document.activeElement, 1);

          setCursorEditable(extractedElement, extractedText.length);
        }
    }
  });
})();

