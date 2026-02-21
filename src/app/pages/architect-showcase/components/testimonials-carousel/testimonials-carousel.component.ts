import { Component, Input } from '@angular/core';
import { TestimonialItem } from '../../architect-showcase.models';

@Component({
  selector: 'app-testimonials-carousel',
  templateUrl: './testimonials-carousel.component.html',
  styleUrls: ['./testimonials-carousel.component.css']
})
export class TestimonialsCarouselComponent {
  @Input() testimonials: TestimonialItem[] = [];

  activeIndex = 0;

  prev(): void {
    if (!this.testimonials.length) {
      return;
    }
    this.activeIndex = (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  next(): void {
    if (!this.testimonials.length) {
      return;
    }
    this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
  }

  goTo(index: number): void {
    this.activeIndex = index;
  }
}
