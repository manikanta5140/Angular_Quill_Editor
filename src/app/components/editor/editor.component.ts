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
