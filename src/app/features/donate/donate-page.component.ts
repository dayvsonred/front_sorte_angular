import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripeCardNumberElement } from '@stripe/stripe-js';
import { DonationFrequency, DonationSummary, PaymentMethod, SuggestedAmount } from './donate.models';
import { PaymentsService } from 'src/app/core/services/payments.service';
import { environment } from 'src/environments/environment';
import { PaymentMethodComponent } from './components/payment-method/payment-method.component';

@Component({
  selector: 'app-donate-page',
  templateUrl: './donate-page.component.html',
  styleUrls: ['./donate-page.component.scss']
})
export class DonatePageComponent implements OnInit {
  form!: FormGroup;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  paymentRequest: any = null;
  walletAvailable = false;
  isSubmitting = false;
  campaignId = '';
  private walletClientSecret = '';
  stripeStatusMessage = '';

  @ViewChild(PaymentMethodComponent) paymentMethodComponent?: PaymentMethodComponent;
  suggestedAmounts: SuggestedAmount[] = [
    { value: 5 },
    { value: 10 },
    { value: 25 },
    { value: 50 },
    { value: 100 },
    { value: 200 }
  ];

  categories = ['Doacao', 'Saude', 'Educacao', 'Emergencia'];
  frequencies: { label: string; value: DonationFrequency }[] = [
    { label: 'Unica', value: 'once' },
    { label: 'Mensal', value: 'monthly' }
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      frequency: ['once', Validators.required],
      category: ['Doacao', Validators.required],
      amount: [25, [Validators.required, Validators.min(5)]],
      tipPercent: [10, [Validators.min(0), Validators.max(30)]],
      paymentMethod: ['card', Validators.required],
      hideName: [false],
      anonymous: [false],
      card: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        country: ['Brasil', Validators.required],
        postalCode: ['', Validators.required],
        saveCard: [false]
      })
    });

    this.form.get('paymentMethod')?.valueChanges.subscribe((method: PaymentMethod) => {
      this.toggleCardValidators(method === 'card');
    });

    this.toggleCardValidators(true);

    this.campaignId = this.route.snapshot.queryParamMap.get('campaignId')
      || this.route.snapshot.queryParamMap.get('donationId')
      || environment.defaultCampaignId
      || '';

    console.log('DonatePage init:', {
      campaignId: this.campaignId,
      hasPublishableKey: !!environment.stripePublishableKey && !environment.stripePublishableKey.includes('SUBSTITUIR')
    });

    this.initStripe();
  }

  constructor(
    private fb: FormBuilder,
    private paymentsService: PaymentsService,
    private route: ActivatedRoute
  ) {}

  get summary(): DonationSummary {
    const donation = this.form.get('amount')?.value || 0;
    const tipPercent = this.form.get('tipPercent')?.value || 0;
    const tip = donation * (tipPercent / 100);
    return {
      donation,
      tip,
      total: donation + tip
    };
  }

  onFrequencyChange(value: DonationFrequency): void {
    this.form.patchValue({ frequency: value });
  }

  onAmountSelected(amount: number): void {
    this.form.patchValue({ amount });
  }

  onAmountChanged(amount: number): void {
    this.form.patchValue({ amount });
  }

  onTipChanged(percent: number): void {
    this.form.patchValue({ tipPercent: percent });
  }

  onPaymentMethodChange(method: PaymentMethod): void {
    this.form.patchValue({ paymentMethod: method });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      console.warn('Formulario invalido:', this.form.value);
      return;
    }
    if (!this.campaignId) {
      alert('CampaignId nao informado. Use /donate?campaignId=SEU_ID');
      console.warn('CampaignId ausente');
      return;
    }
    if (!this.stripe || !this.elements) {
      alert('Stripe nao inicializado. Configure stripePublishableKey no environment.');
      console.warn('Stripe nao inicializado');
      return;
    }

    if (this.form.get('paymentMethod')?.value === 'google_pay') {
      this.startWalletPayment();
      return;
    }

    const email = this.form.get('card.email')?.value || '';
    const name = `${this.form.get('card.firstName')?.value || ''} ${this.form.get('card.lastName')?.value || ''}`.trim();
    const total = this.summary.total;

    this.isSubmitting = true;
    this.paymentsService.createDonation({
      campaignId: this.campaignId,
      amount: total.toFixed(2),
      currency: 'BRL',
      donor: {
        name,
        email
      }
    }).subscribe({
      next: (donation) => {
        this.paymentsService.createPaymentIntent({ donationId: donation.donationId }).subscribe({
          next: async (intent) => {
            const cardElement = this.paymentMethodComponent?.cardNumberElement as StripeCardNumberElement | undefined;
            if (!cardElement) {
              alert('Cartao nao inicializado.');
              this.isSubmitting = false;
              return;
            }
            const result = await this.stripe!.confirmCardPayment(intent.client_secret, {
              payment_method: {
                card: cardElement,
                billing_details: {
                  name,
                  email
                }
              }
            });
            this.isSubmitting = false;
            if (result.error) {
              alert(result.error.message || 'Erro ao processar pagamento.');
              return;
            }
            alert('Pagamento realizado com sucesso!');
          },
          error: () => {
            this.isSubmitting = false;
            alert('Erro ao criar pagamento.');
          }
        });
      },
      error: () => {
        this.isSubmitting = false;
        alert('Erro ao criar doacao.');
      }
    });
  }

  private toggleCardValidators(enabled: boolean): void {
    const cardGroup = this.form.get('card') as FormGroup;
    if (!cardGroup) return;

    Object.keys(cardGroup.controls).forEach((key) => {
      const control = cardGroup.get(key);
      if (!control) return;
      if (key === 'saveCard') return;
      if (enabled) {
        control.enable({ emitEvent: false });
      } else {
        control.disable({ emitEvent: false });
      }
    });
  }

  private async initStripe(): Promise<void> {
    if (!environment.stripePublishableKey || environment.stripePublishableKey.includes('SUBSTITUIR')) {
      this.stripeStatusMessage = 'Stripe key ausente ou placeholder.';
      console.warn('Stripe publishable key ausente ou placeholder.', environment.stripePublishableKey);
      return;
    }

    if (environment.stripePublishableKey.startsWith('pk_live') && window.location.protocol !== 'https:') {
      this.stripeStatusMessage = 'Chave LIVE exige HTTPS. Use pk_test no localhost.';
      console.warn('Stripe live key em HTTP. Use HTTPS ou pk_test.');
      return;
    }

    this.stripe = await loadStripe(environment.stripePublishableKey, { locale: 'pt-BR' });
    if (!this.stripe) {
      this.stripeStatusMessage = 'Stripe nao inicializado (loadStripe retornou null).';
      console.warn('Stripe nao inicializado: loadStripe retornou null');
      return;
    }
    this.stripeStatusMessage = '';

    this.elements = this.stripe.elements({
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#1a4235',
          colorText: '#1d2939',
          borderRadius: '12px'
        }
      }
    });

    const total = this.summary.total || 0;
    this.paymentRequest = this.stripe.paymentRequest({
      country: 'BR',
      currency: 'brl',
      total: { label: 'Doacao', amount: Math.round(total * 100) },
      requestPayerName: true,
      requestPayerEmail: true
    });

    const result = await this.paymentRequest.canMakePayment();
    this.walletAvailable = !!result;
    console.log('Stripe inicializado:', {
      stripe: !!this.stripe,
      elements: !!this.elements,
      walletAvailable: this.walletAvailable,
      publishableKey: environment.stripePublishableKey ? 'ok' : 'missing'
    });

    this.paymentRequest.on('paymentmethod', async (ev: any) => {
      if (!this.walletClientSecret) {
        ev.complete('fail');
        return;
      }
      const { error } = await this.stripe!.confirmCardPayment(this.walletClientSecret, {
        payment_method: ev.paymentMethod.id
      }, { handleActions: false });

      if (error) {
        ev.complete('fail');
        this.isSubmitting = false;
        alert(error.message || 'Pagamento falhou.');
        return;
      }
      ev.complete('success');
      this.isSubmitting = false;
      alert('Pagamento realizado com sucesso!');
    });

    this.form.valueChanges.subscribe(() => {
      if (this.paymentRequest) {
        const updatedTotal = this.summary.total || 0;
        this.paymentRequest.update({
          total: { label: 'Doacao', amount: Math.round(updatedTotal * 100) }
        });
      }
    });
  }

  async startWalletPayment(): Promise<void> {
    if (!this.paymentRequest || !this.walletAvailable || !this.stripe) {
      alert('Carteira digital indisponivel.');
      return;
    }
    if (!this.campaignId) {
      alert('CampaignId nao informado. Use /donate?campaignId=SEU_ID');
      return;
    }

    const email = this.form.get('card.email')?.value || '';
    const name = `${this.form.get('card.firstName')?.value || ''} ${this.form.get('card.lastName')?.value || ''}`.trim();
    const total = this.summary.total || 0;

    this.isSubmitting = true;
    this.paymentsService.createDonation({
      campaignId: this.campaignId,
      amount: total.toFixed(2),
      currency: 'BRL',
      donor: { name: name || 'Doador', email: email || 'doador@exemplo.com' }
    }).subscribe({
      next: (donation) => {
        this.paymentsService.createPaymentIntent({ donationId: donation.donationId }).subscribe({
          next: async (intent) => {
            this.walletClientSecret = intent.client_secret;
            this.paymentRequest.show();
          },
          error: () => {
            this.isSubmitting = false;
            alert('Erro ao criar pagamento.');
          }
        });
      },
      error: () => {
        this.isSubmitting = false;
        alert('Erro ao criar doacao.');
      }
    });
  }

  get stripeReady(): boolean {
    return !!this.stripe && !!this.elements;
  }
}
