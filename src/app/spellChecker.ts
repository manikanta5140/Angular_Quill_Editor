import Quill from "quill";
import Typo from 'typo-js';
export default class SpellChecker {
  quill: any;
  options: any;
  private dictionary: any;
  private isUpdating = false;
  
  constructor(quill: Quill, options: any) {
    this.quill = quill;
    this.options = options;
    this.dictionary = new Typo('en_US', false, false, { dictionaryPath: '/assets/dictionaries' });

    const container = document.querySelector(this.options.container);

    this.quill.on('editor-change', () => {
      if (!this.isUpdating) { 
        this.spellCheck();
        const length = this.calculate();
        container!.innerHTML = `<span style="color: blue; font-weight: bold;">${length} ${this.options.unit}s</span>`;
      }
    });
  }

  calculate() {
    const text = this.quill.getText().trim();
    return this.options.unit === 'word' ? (text ? text.split(/\s+/).length : 0) : text.length;
  }

  spellCheck() {
    const text = this.quill.getText().trim();
    if (!text) return;
  
    this.quill.formatText(0, text.length, { underline: false, color: null });
  
    const words = text.split(" ");
    let position = 0;
  
    this.isUpdating = true;
  
    words.forEach((word: string | any[]) => {
      const wordLength = word.length;
      const isCorrect = this.dictionary.check(word);
      if(!isCorrect){
      this.quill.formatText(position, wordLength, { underline: true, color: 'red' });
      }
      position += wordLength + 1;
    });
    this.isUpdating = false;
  
   }
}





