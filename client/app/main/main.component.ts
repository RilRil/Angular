import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<h1>Hello {{name}}</h1>`,
})
export class MainComponent  { name = 'Angular'; }