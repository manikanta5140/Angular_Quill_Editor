// import Quill from "quill";
// import Typo from 'typo-js';
// export default class SpellChecker {
//   quill: any;
//   options: any;
//   private dictionary: any;
//   private isUpdating = false;
  
//   constructor(quill: Quill, options: any) {
//     this.quill = quill;
//     this.options = options;
//     this.dictionary = new Typo('en_US', false, false, { dictionaryPath: '/assets/dictionaries' });

//     const container = document.querySelector(this.options.container);

//     this.quill.on('editor-change', () => {
//       if (!this.isUpdating) { 
//         this.spellCheck();
//         const length = this.calculate();
//         container!.innerHTML = `<span style="color: blue; font-weight: bold;">${length} ${this.options.unit}s</span>`;
//       }
//     });
//   }

//   calculate() {
//     const text = this.quill.getText().trim();
//     return this.options.unit === 'word' ? (text ? text.split(/\s+/).length : 0) : text.length;
//   }

//   spellCheck() {
//     const text = this.quill.getText().trim();
//     if (!text) return;
  
//     this.quill.formatText(0, text.length, { underline: false, color: null });
  
//     const words = text.split(" ");
//     let position = 0;
  
//     this.isUpdating = true;
  
//     words.forEach((word: string | any[]) => {
//       const wordLength = word.length;
//       const isCorrect = this.dictionary.check(word);
//       if(!isCorrect){
//       this.quill.formatText(position, wordLength, { underline: true, color: 'red' });
//       }
//       position += wordLength + 1;
//     });
//     this.isUpdating = false;
  
//    }
// }



import Quill from "quill";
import Delta from "quill-delta";
import Typo from 'typo-js';

export default class SpellChecker {
  quill: any;
  options: any;
  private dictionary: any;
  private isUpdating = false;
  private debouncedSpellCheck: Function;

  constructor(quill: Quill, options: any) {
    this.quill = quill;
    this.options = options;
    this.dictionary = new Typo('en_US', false, false, { dictionaryPath: '/assets/dictionaries' });

    const container = document.querySelector(this.options.container);

    // Initialize debounced spell check with a custom delay time from options
    const delay = this.options.delay || 100; // default to 300ms if not provided
    this.debouncedSpellCheck = this.debounce(this.spellCheck.bind(this), delay);

    this.quill.on('editor-change', () => {
      if (!this.isUpdating) { 
        this.debouncedSpellCheck();
        const length = this.calculate();
        container!.innerHTML = `<span style="color: blue; font-weight: bold;">${length} ${this.options.unit}s</span>`;
      }
    });
  }

  calculate() {
    const text = this.quill.getText().trim();
    return this.options.unit === 'word' ? (text ? text.split(/\s+/).length : 0) : text.length;
  }

  // Custom debounce function with generic timer type
  debounce(func: Function, delay: number) {
    let timer: any; // Use `any` type here
    return  (...args: any[]) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  }

  spellCheck() {
    const text = this.quill.getText().trim();
    if (!text) return;

    // Clear all underlines first
    this.quill.formatText(0, text.length, { underline: false, color: null });

    const words = text.split(/\s+/);
    let position = 0;

    this.isUpdating = true;

    // Collect a delta to batch formatting
    let delta = new Delta();

    words.forEach((word: string) => {
      const wordLength = word.length;
      const isCorrect = this.dictionary.check(word);

      // Only apply underline if the word is incorrect
      if (!isCorrect) {
        delta.retain(position).retain(wordLength, { underline: true, color: 'red' });
      }
      position += wordLength + 1; // Move to the next word, accounting for space
    });

    // Apply the accumulated delta all at once to prevent redundant renders
    this.quill.updateContents(delta);
    this.isUpdating = false;
  }
}



// import Quill from "quill";
// import Typo from 'typo-js';
// import { debounce } from 'lodash'; // Consider lodash's debounce for better control

// export default class SpellChecker {
//   quill: any;
//   options: any;
//   private dictionary: any;
//   private isUpdating = false;

//   constructor(quill: Quill, options: any) {
//     this.quill = quill;
//     this.options = options;
//     this.dictionary = new Typo('en_US', false, false, { dictionaryPath: '/assets/dictionaries' });

//     const container = document.querySelector(this.options.container);

//     // Debounced function to reduce frequency of spell checks
//     this.spellCheck = debounce(this.spellCheck.bind(this), 300);

//     this.quill.on('editor-change', () => {
//       if (!this.isUpdating) { 
//         this.spellCheck();
//         const length = this.calculate();
//         container!.innerHTML = `<span style="color: blue; font-weight: bold;">${length} ${this.options.unit}s</span>`;
//       }
//     });
//   }

//   calculate() {
//     const text = this.quill.getText().trim();
//     return this.options.unit === 'word' ? (text ? text.split(/\s+/).length : 0) : text.length;
//   }

//   spellCheck() {
//     const text = this.quill.getText().trim();
//     if (!text) return;

//     // Remove underlines only from previously misspelled words (not the whole content)
//     const currentFormat = this.quill.getContents().ops || [];
//     currentFormat.forEach((op: { attributes: { underline: any; }; insert: string | any[]; }, index: any) => {
//       if (op.attributes && op.attributes.underline) {
//         this.quill.formatText(index, op.insert.length, { underline: false, color: null });
//       }
//     });

//     const words = text.split(/\s+/);
//     let position = 0;

//     this.isUpdating = true;

//     words.forEach((word: string) => {
//       const wordLength = word.length;
//       if (!this.dictionary.check(word)) {
//         this.quill.formatText(position, wordLength, { underline: true, color: 'red' });
//       }
//       position += wordLength + 1; // account for space
//     });

//     this.isUpdating = false;
//   }
// }






