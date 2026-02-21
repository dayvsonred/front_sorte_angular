import { Component } from '@angular/core';
import { ARCHITECT_SHOWCASE_DATA } from './architect-showcase.data';

@Component({
  selector: 'app-architect-showcase-page',
  templateUrl: './architect-showcase-page.component.html',
  styleUrls: ['./architect-showcase-page.component.css']
})
export class ArchitectShowcasePageComponent {
  readonly data = ARCHITECT_SHOWCASE_DATA;
}
