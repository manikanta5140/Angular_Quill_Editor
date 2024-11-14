
import { Injectable } from '@angular/core';
import Typo from 'typo-js';

@Injectable({
  providedIn: 'root',
})
export class SpellCheckService {
  private dictionary: any;

  constructor() {
    this.dictionary = new Typo('en_US', false, false, { dictionaryPath: '/assets/dictionaries' });
  }

  checkSpelling(word: string): boolean {
    return this.dictionary.check(word);
  }

  getSuggestions(word: string): string[] {
    return this.dictionary.suggest(word);
  }
}

