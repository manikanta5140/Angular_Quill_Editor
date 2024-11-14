import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  editorContent: string = '';

  modules: object = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],  
      ['blockquote', 'code-block'],
  
      [{ 'header': 1 }, { 'header': 2 }],              
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],     
      [{ 'indent': '-1'}, { 'indent': '+1' }],        
      [{ 'direction': 'rtl' }],                        
  
      [{ 'size': ['small', false, 'large', 'huge'] }], 
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
      [{ 'color': [] }, { 'background': [] }],        
      [{ 'font': [] }],
      [{ 'align': [] }],
  
      ['clean'],                                        
  
      ['link', 'image', 'video']                        
    ]
  };

}




// import { Component, AfterViewInit, ViewChild } from '@angular/core';
// import { SpellCheckService } from 'src/app/services/spell-check.service';

// @Component({
//   selector: 'app-editor',
//   templateUrl: './editor.component.html',
//   styleUrls: ['./editor.component.css']
// })
// export class EditorComponent implements AfterViewInit {
//   @ViewChild('editor', { static: false }) editor: any;
//   editorContent: string = '';

//   modules: object = {
//     toolbar: [
//       ['bold', 'italic', 'underline', 'strike'],
//       ['blockquote', 'code-block'],
//       [{ header: 1 }, { header: 2 }],
//       [{ list: 'ordered' }, { list: 'bullet' }],
//       [{ script: 'sub' }, { script: 'super' }],
//       [{ indent: '-1' }, { indent: '+1' }],
//       [{ direction: 'rtl' }],
//       [{ size: ['small', false, 'large', 'huge'] }],
//       [{ header: [1, 2, 3, 4, 5, 6, false] }],
//       [{ color: [] }, { background: [] }],
//       [{ font: [] }],
//       [{ align: [] }],
//       ['clean'],
//       ['link', 'image', 'video']
//     ],
//     spellingCheck: {
//       container: '#spelling-count',  // Optional: define the container for the spelling check count
//       unit: 'word'  // or 'char'
//     }
//   };

//   constructor(private spellCheckService: SpellCheckService) {}

//   ngAfterViewInit(): void {
//     // Quill initialization logic if needed
//   }
// }


