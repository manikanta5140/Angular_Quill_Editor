import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'quillEditor';
}

// // app.component.ts
// import { Component, OnInit, AfterViewInit } from '@angular/core';
// import Typo from 'typo-js';
// import Quill from 'quill';

// @Component({
//   selector: 'app-root',
//   template: `
//     <quill-editor [(ngModel)]="content" (onContentChanged)="onContentChanged($event)"></quill-editor>
//   `,
//   styles: [
//     `.misspelled {
//         text-decoration: underline;
//         text-decoration-color: red;
//         text-decoration-style: wavy;
//       }`
//   ]
// })
// export class AppComponent implements OnInit, AfterViewInit {
//   content = '';
//   typo: any;

//   constructor() {}

//   ngOnInit() {
//     // Load the Typo dictionary
//     this.typo = new Typo('en_US');
//   }

//   ngAfterViewInit() {
//     // Get Quill editor instance after it initializes
//     const quillEditor = document.querySelector('quill-editor')?.querySelector('.ql-editor');
//     if (quillEditor) {
//       quillEditor.addEventListener('input', () => {
//         this.checkSpelling(quillEditor);
//       });
//     }
//   }

//   onContentChanged(event: any) {
//     const quillEditor = event.editor.root;
//     this.checkSpelling(quillEditor);
//   }

//   checkSpelling(editorElement: HTMLElement) {
//     // Reset previous highlights
//     const text = editorElement.innerText;
//     const words = text.split(/\s+/);
//     const quill = editorElement.closest('quill-editor');

//     // Remove previous spans
//     const previousHighlights = editorElement.querySelectorAll('.misspelled');
//     previousHighlights.forEach((el) => {
//       const parent = el.parentNode;
//       parent?.replaceChild(document.createTextNode(el.innerText), el);
//     });

//     // Recheck and add highlights
//     words.forEach((word) => {
//       if (!this.typo.check(word) && word.trim() !== '') {
//         const regex = new RegExp(`\\b${word}\\b`, 'g');
//         editorElement.innerHTML = editorElement.innerHTML.replace(
//           regex,
//           `<span class="misspelled">${word}</span>`
//         );
//       }
//     });
//   }
// }

