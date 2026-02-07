import { AfterViewInit, AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Stripe, StripeElements, StripeCardNumberElement, StripeCardExpiryElement, StripeCardCvcElement } from '@stripe/stripe-js';
import { PaymentMethod } from '../../donate.models';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss']
})
export class PaymentMethodComponent implements AfterViewInit, AfterViewChecked, OnChanges {
  @Input() form!: FormGroup;
  @Input() stripe: Stripe | null = null;
  @Input() elements: StripeElements | null = null;
  @Input() walletAvailable = false;
  @Output() methodChanged = new EventEmitter<PaymentMethod>();
  @Output() walletClick = new EventEmitter<void>();

  @ViewChild('cardNumber') cardNumberRef?: ElementRef<HTMLDivElement>;
  @ViewChild('cardExpiry') cardExpiryRef?: ElementRef<HTMLDivElement>;
  @ViewChild('cardCvc') cardCvcRef?: ElementRef<HTMLDivElement>;

  cardNumberElement?: StripeCardNumberElement;
  cardExpiryElement?: StripeCardExpiryElement;
  cardCvcElement?: StripeCardCvcElement;
  cardError = '';
  private mounted = false;

  selectMethod(method: PaymentMethod): void {
    if (this.form) {
      this.form.patchValue({ paymentMethod: method });
      this.form.get('paymentMethod')?.markAsTouched();
    }
    this.methodChanged.emit(method);
    if (method === 'card') {
      setTimeout(() => this.mountCardElements(), 0);
    }
  }

  get cardGroup(): FormGroup {
    return this.form.get('card') as FormGroup;
  }

  ngAfterViewInit(): void {
    this.mountCardElements();
  }

  ngAfterViewChecked(): void {
    this.mountCardElements();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['elements'] && this.elements) {
      this.mountCardElements();
    }
  }

  private mountCardElements(): void {
    if (!this.elements || !this.cardNumberRef || !this.cardExpiryRef || !this.cardCvcRef) {
      return;
    }

    if (!this.cardNumberElement || !this.cardExpiryElement || !this.cardCvcElement) {
      const style = {
        base: {
          color: '#1d2939',
          fontSize: '16px',
          fontFamily: 'Roboto, Arial, sans-serif',
          '::placeholder': { color: '#98a2b3' }
        }
      };

      this.cardNumberElement = this.elements.create('cardNumber', { style });
      this.cardExpiryElement = this.elements.create('cardExpiry', { style });
      this.cardCvcElement = this.elements.create('cardCvc', { style });

      this.cardNumberElement.on('change', (event) => {
        this.cardError = event.error?.message || '';
      });
    }

    const numberHost = this.cardNumberRef.nativeElement;
    const expiryHost = this.cardExpiryRef.nativeElement;
    const cvcHost = this.cardCvcRef.nativeElement;

    const needsMount =
      numberHost.childNodes.length === 0 ||
      expiryHost.childNodes.length === 0 ||
      cvcHost.childNodes.length === 0;

    if (needsMount) {
      this.cardNumberElement?.mount(this.cardNumberRef.nativeElement);
      this.cardExpiryElement?.mount(this.cardExpiryRef.nativeElement);
      this.cardCvcElement?.mount(this.cardCvcRef.nativeElement);
      this.mounted = true;
      console.log('Stripe Elements montados.');
    }
  }
}
