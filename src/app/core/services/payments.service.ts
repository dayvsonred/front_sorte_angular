import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface CreateDonationRequest {
  campaignId: string;
  amount: string;
  currency: string;
  donor: {
    name: string;
    email: string;
  };
}

export interface CreateDonationResponse {
  donationId: string;
}

export interface CreatePaymentIntentRequest {
  donationId: string;
}

export interface CreatePaymentIntentResponse {
  client_secret: string;
  paymentIntentId: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private baseUrl = environment.paymentsBaseUrl || environment.urlBase;

  constructor(private http: HttpClient) {}

  createDonation(payload: CreateDonationRequest): Observable<CreateDonationResponse> {
    return this.http.post<CreateDonationResponse>(`${this.baseUrl}/payments/donations`, payload);
  }

  createPaymentIntent(payload: CreatePaymentIntentRequest): Observable<CreatePaymentIntentResponse> {
    return this.http.post<CreatePaymentIntentResponse>(`${this.baseUrl}/payments/intents`, payload);
  }
}
