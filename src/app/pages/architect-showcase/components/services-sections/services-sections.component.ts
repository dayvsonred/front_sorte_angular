import { Component, Input } from '@angular/core';
import { ServiceItem } from '../../architect-showcase.models';

@Component({
  selector: 'app-services-sections',
  templateUrl: './services-sections.component.html',
  styleUrls: ['./services-sections.component.css']
})
export class ServicesSectionsComponent {
  @Input() services: ServiceItem[] = [];

  getIcon(iconKey: string): string {
    const icons: Record<string, string> = {
      cloud: '?',
      email: '?',
      notification: '??',
      payment: '??',
      ai: '??',
      serverless: '?'
    };

    return icons[iconKey] || '?';
  }
}
