import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArchitectProfile, BrandContent, HeroContent, ShowcaseLanguage } from '../../architect-showcase.models';

@Component({
  selector: 'app-hero-section',
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {
  @Input() brand!: BrandContent;
  @Input() hero!: HeroContent;
  @Input() architect!: ArchitectProfile;
  @Input() selectedLanguage: ShowcaseLanguage = 'pt';
  @Output() languageChange = new EventEmitter<ShowcaseLanguage>();

  readonly languages: Array<{ code: ShowcaseLanguage; flag: string; label: string }> = [
    { code: 'pt', flag: '🇧🇷', label: 'Portugues' },
    { code: 'en', flag: '🇺🇸', label: 'English' },
    { code: 'es', flag: '🇪🇸', label: 'Espanol' }
  ];

  selectLanguage(language: ShowcaseLanguage): void {
    if (this.selectedLanguage === language) {
      return;
    }
    this.languageChange.emit(language);
  }
}
