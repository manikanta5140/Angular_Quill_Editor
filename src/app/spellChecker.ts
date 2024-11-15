// import Quill from "quill";
// import Typo from "typo-js";

// export default class SpellChecker {
//   quill: Quill;
//   options: any;
//   private dictionary: any;

//   constructor(quill: Quill, options: any) {
//     this.quill = quill;
//     this.options = options;
//     this.dictionary = new Typo("en_US", false, false, { dictionaryPath: "/assets/dictionaries" });

//     // Debounced spell-check on text change
//     const debouncedSpellCheck = this.debounce(() => {
//       this.spellCheck();
//       this.updateContainer();
//     }, 400);
//     this.quill.on("text-change", debouncedSpellCheck);
//   }

//   private debounce(func: Function, delay: number) {
//     let timer: any;
//     return (...args: any[]) => {
//       clearTimeout(timer);
//       timer = setTimeout(() => func(...args), delay);
//     };
//   }

//   private calculate() {
//     const text = this.quill.getText().trim();
//     return this.options.unit === "word" ? (text ? text.split(/\s+/).length : 0) : text.length;
//   }

//   spellCheck() {
//     const text = this.quill.getText().trim();
//     if (!text) return;

//     this.resetFormatting();

//     const words = text.split(" ");
//     let position = 0;

//     words.forEach((word: string) => {
//       const match = word.match(/^(\w+)([.,!?:;]*)$/);
//       if (match) {
//         const [fullWord, cleanWord, punctuation] = match;

//         if (!this.dictionary.check(cleanWord)) {
//           this.underlineWord(position, cleanWord.length);
//         }

//         position += fullWord.length + 1;
//       } else {
//         position += word.length + 1;
//       }
//     });
//   }

//   // Apply a wave underline style by wrapping the word in a span with the class
//   private underlineWord(position: number, length: number) {
//     const range = this.quill.getSelection();
//     if (!range) return;

//     const start = range.index + position;
//     const end = start + length;

//     // Insert a span element with the 'misspelled-wave' class around the word
//     const text = this.quill.getText(start, end - start);
//     const formattedText = `<span class="misspelled-wave">${text}</span>`;

//     this.quill.deleteText(start, end - start); // Delete the original text
//     this.quill.insertEmbed(start, "text", formattedText); // Insert the new text with the span
//   }

//   private resetFormatting() {
//     const textLength = this.quill.getText().length;
//     this.quill.formatText(0, textLength, { underline: false, color: null, "class": null });
//   }

//   private updateContainer() {
//     const length = this.calculate();
//     const container = document.querySelector(this.options.container);
//     container!.innerHTML = `<span style="color: blue; font-weight: bold;">${length} ${this.options.unit}s</span>`;
//   }
// }



import Quill from "quill";
import Typo from "typo-js";

const Inline = Quill.import("blots/inline");

// class HighlightBlot extends Inline {
//   static create(className: any) {
//     const node = super.create();
//     node.classList.add(className);
//     return node;
//   }

//   static formats(node: { className: any; }) {
//     return node.className || null;
//   }
// }

// HighlightBlot["blotName"] = "highlight";
// HighlightBlot["tagName"] = "span";

// Quill.register(HighlightBlot);

export default class SpellChecker {
  quill: Quill;
  options: any;
  private dictionary: any;
  
  constructor(quill: Quill, options: any) {
    this.quill = quill;
    this.options = options;
    this.dictionary = new Typo("en_US", false, false, { dictionaryPath: "/assets/dictionaries" });

    const debouncedSpellCheck = this.debounce(() => this.spellCheck(), 400);
    this.quill.on("text-change", debouncedSpellCheck);

    this.quill.root.addEventListener("click", (event: MouseEvent) => {
      const clickPosition = this.quill.getSelection()?.index || 0;
      this.showSuggestionsForMisspelledWord(clickPosition, event);
    });
  }

  debounce(func: Function, delay: number) {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }

  spellCheck() {
    const text = this.quill.getText().trim();
    if (!text) return;

    this.resetFormatting();

    const words = text.split(/\b/);
    let position = 0;

    words.forEach((segment: string) => {
      if (/^\w+$/.test(segment)) {
        if (!this.dictionary.check(segment)) {
          this.underlineWord(position, segment.length);
        }
      }
      position += segment.length;
    });
  }

  underlineWord(position: number, length: number) {
    const textLength = this.quill.getLength() - 1;
    if (position < textLength && position + length <= textLength) {
      this.quill.formatText(position, length, {color: "red" });
      // this.quill.formatText(position, length, "highlight", "my-custom-class");

    }
  }

  resetFormatting() {
    const textLength = this.quill.getLength() - 1;
    this.quill.formatText(0, textLength, {color: null });
    // this.quill.formatText(0, textLength, "highlight", "my-custom-class");

  }

  showSuggestionsForMisspelledWord(position: number, event: MouseEvent) {
    const [wordStart, wordEnd] = this.findWordBounds(position);
    if (wordStart === -1 || wordEnd === -1) return;

    const word = this.quill.getText(wordStart, wordEnd - wordStart).trim();

    if (!this.dictionary.check(word)) {
      const suggestions = this.dictionary.suggest(word);

      if (suggestions.length > 0) {
        this.showSuggestionsMenu(event, suggestions, wordStart, wordEnd);
      }
    }
  }

  showSuggestionsMenu(event: MouseEvent, suggestions: string[], wordStart: number, wordEnd: number) {
    const existingMenu = document.querySelector(".suggestions-menu");
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement("div");
    menu.className = "suggestions-menu";
    menu.style.position = "absolute";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY + 10}px`;
    menu.style.backgroundColor = "#fff";
    menu.style.border = "1px solid #ccc";
    menu.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.2)";
    menu.style.padding = "8px";
    menu.style.borderRadius = "4px";
    menu.style.zIndex = "1";

    suggestions.forEach((suggestion) => {
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.style.padding = "4px 8px";
      item.style.cursor = "pointer";
      item.textContent = suggestion;

      item.onclick = (e) => {
        e.stopPropagation();
        this.replaceWord(wordStart, wordEnd, suggestion);
        menu.remove();
      };

      menu.appendChild(item);
    });

    document.body.appendChild(menu);

    const removeMenu = () => {
      menu.remove();
      document.removeEventListener("click", removeMenu);
    };
    setTimeout(() => document.addEventListener("click", removeMenu), 0);
  }

  replaceWord(start: number, end: number, newWord: string) {
    this.quill.deleteText(start, end - start);
    this.quill.insertText(start, newWord);
  }

  findWordBounds(position: number): [number, number] {
    const text = this.quill.getText();
    let start = position;
    let end = position;

    while (start > 0 && /\w/.test(text[start - 1])) start--;
    while (end < text.length && /\w/.test(text[end])) end++;

    const textLength = this.quill.getLength() - 1;
    start = Math.max(0, Math.min(start, textLength));
    end = Math.max(0, Math.min(end, textLength));

    return [start, end];
  }
}



























// import Quill from "quill";
// import Typo from 'typo-js';

// export default class SpellChecker {
//   quill: Quill;
//   options: any;
//   private dictionary: any;

//   constructor(quill: Quill, options: any) {
//     this.quill = quill;
//     this.options = options;
//     this.dictionary = new Typo('en_US', false, false, { dictionaryPath: '/assets/dictionaries' });

//     const debouncedSpellCheck = this.debounce(() =>{
//       this.spellCheck();
//       this.updateContainer();
//     }, 400);
//     this.quill.on("text-change", debouncedSpellCheck);
//   }

//   private debounce(func: Function, delay: number) {
//     let timer: any;
//     return (...args: any[]) => {
//       clearTimeout(timer);
//       timer = setTimeout(() => func(...args), delay);
//     };
//   }

//   private calculate() {
//     const text = this.quill.getText().trim();
//     return this.options.unit === 'word' ? (text ? text.split(/\s+/).length : 0) : text.length;
//   }

//   spellCheck() {
//     const text = this.quill.getText().trim();
//     if (!text) return;

//     this.resetFormatting();

//     const words = text.split(" ");
//     let position = 0;

//     words.forEach((word: string) => {
//       const match = word.match(/^(\w+)([.,!?:;]*)$/);
//       if (match) {
//         const [fullWord, cleanWord, punctuation] = match;

//         if (!this.dictionary.check(cleanWord)) {
//           this.underlineWord(position, cleanWord.length);
//         }

//         position += fullWord.length + 1;
//       } else {
//         position += word.length + 1;
//       }
//     });
//   }

//   private underlineWord(position: number, length: number) {
//     this.quill.formatText(position, length, { underline: true, color: 'red' });
//   }

//   private resetFormatting() {
//     const textLength = this.quill.getText().length;
//     this.quill.formatText(0, textLength, { underline: false, color: null });
//   }

//   private updateContainer() {
//     const length = this.calculate();
//     const container = document.querySelector(this.options.container);
//     container!.innerHTML = `<span style="color: blue; font-weight: bold;">${length} ${this.options.unit}s</span>`;
//   }
// }