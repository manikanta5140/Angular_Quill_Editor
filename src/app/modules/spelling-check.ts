import { Quill } from 'quill';
import { SpellCheckService } from 'src/app/services/spell-check.service';

interface QuillInstance extends Quill {}

const Inline = Quill.import('blots/inline');

class MisspelledWordBlot extends Inline {
  static create() {
    const node = super.create();
    node.style.textDecoration = 'underline';
    node.style.textDecorationColor = 'red';
    return node;
  }
}

MisspelledWordBlot['blotName'] = 'misspelled';
MisspelledWordBlot['tagName'] = 'span';

Quill.register(MisspelledWordBlot);

export default class SpellingCheck {
  quill: QuillInstance;
  options: any;
  spellCheckService: SpellCheckService;

  constructor(quill: QuillInstance, options: any, spellCheckService: SpellCheckService) {
    this.quill = quill;
    this.options = options;
    this.spellCheckService = spellCheckService;

    Quill.register(MisspelledWordBlot);

    this.quill.on('text-change', () => {
      this.checkSpelling();
    });
  }

  checkSpelling() {
    const text = this.quill.getText();
    const words = text.split(/\s+/);

    let startIndex = 0;
    words.forEach((word: string) => {
      const isCorrect = this.spellCheckService.checkSpelling(word);
      const endIndex = startIndex + word.length;

      if (!isCorrect && word.trim()) {
        this.quill.formatText(startIndex, word.length, 'misspelled', true);
      } else {
        this.quill.formatText(startIndex, word.length, 'misspelled', false);
      }

      startIndex = endIndex + 1;
    });
  }
}
