import { Component, Input } from '@angular/core';
import { ArchitectProfile, BrandContent, HeroContent } from '../../architect-showcase.models';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {
  @Input() brand!: BrandContent;
  @Input() hero!: HeroContent;
  @Input() architect!: ArchitectProfile;
}
