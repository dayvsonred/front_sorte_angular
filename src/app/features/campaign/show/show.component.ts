import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { PaymentsService } from 'src/app/core/services/payments.service';
import { environment } from '../../../../environments/environment';
import { DialogSimpleMessageComponent } from '../dialog-simple-message/dialog-simple-message.component';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
  donation: any = null;
  mensagens: any[] = [];
  totalMensagensValor: any = 0;
  pixTotais: { valor_total: string; total_doadores: number } | null = null;
  total_doadores: any = 0;
  valor_total: any = 0;
  alcancado = 0;
  Logado = false;
  usuario = { name: "", email: "", date_create: "" };
  profileImageUrl = "";
  donateForm!: FormGroup;
  suggestedAmounts = [5, 10, 25, 50, 100, 200];
  isSubmitting = false;

  constructor(
    private notificationService: NotificationService,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private paymentsService: PaymentsService
  ) {}

  ngOnInit() {
    this.donateForm = this.fb.group({
      amount: [25, [Validators.required, Validators.min(5)]],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    const queryParams = this.route.snapshot.queryParams;
    if (queryParams['firstTime'] === 'true') {
      this.showWelcomeDialog();
    }

    const logado = this.globalService.getCurrentUser();
    if (logado != null) {
      this.Logado = true;
    }

    const nomeLink = this.route.snapshot.paramMap.get('id');
    if (nomeLink) {
      this.fetchDonation(nomeLink);
    }
  }

  fetchDonation(nomeLink: string): void {
    this.globalService.getDonationByLink(nomeLink)
      .subscribe({
        next: (response) => {
          this.donation = response;
          console.log('Doacao recebida:', this.donation);
          this.showMensagens();
          this.loadPixTotais();
          this.fetchUser(this.donation.id_user);
          this.getIMGPerfil(this.donation.id_user);
        },
        error: (error) => {
          console.error('Erro ao buscar doacao:', error);
        }
      });
  }

  openDonationModal(): void {
    this.startCheckout();
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${environment.urlBase}/images/${imagePath}`;
  }

  calculateDaysAgo(date: string): number {
    const donationDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - donationDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  resetPassword() {
    this.router.navigate(['/auth/reset-request']);
  }

  createUser() {
    this.router.navigate(['/auth/new-user']);
  }

  showMensagens() {
    this.donationOpen(this.donation.id);
    this.globalService.getDonationMensagens(this.donation.id).subscribe({
      next: (mensagens) => {
        this.mensagens = mensagens;
        console.log('Mensagens recebidas:', mensagens);
        console.log('Total arrecadado nas mensagens:', this.totalMensagensValor);
      },
      error: (err) => {
        this.notificationService.openSnackBar(err);
      }
    });
  }

  loadPixTotais(): void {
    this.globalService.getPixTotais(this.donation.id).subscribe({
      next: (data) => {
        this.pixTotais = data;
        console.log('Totais:', data);
        this.totalMensagensValor = data.valor_total;
        this.valor_total = data.valor_total;
        this.total_doadores = data.total_doadores;
      },
      error: (err) => {
        this.notificationService.openSnackBar(err);
      }
    });
  }

  calculateProgress() {
    const pt1 = this.donation.valor / this.valor_total;
    this.alcancado = 100 / pt1;
    return this.alcancado;
  }

  onAmountSelected(amount: number): void {
    this.donateForm.patchValue({ amount });
  }

  startCheckout(): void {
    if (!this.donation?.id) {
      this.notificationService.openSnackBar('Campanha nao encontrada.');
      return;
    }
    if (this.donateForm.invalid || this.isSubmitting) {
      this.donateForm.markAllAsTouched();
      return;
    }

    const amount = this.donateForm.get('amount')?.value || 0;
    const name = this.donateForm.get('name')?.value || '';
    const email = this.donateForm.get('email')?.value || '';

    const currentUrl = new URL(window.location.href);
    const successUrl = new URL(currentUrl.toString());
    const cancelUrl = new URL(currentUrl.toString());
    successUrl.searchParams.set('status', 'success');
    cancelUrl.searchParams.set('status', 'cancel');

    this.isSubmitting = true;
    this.paymentsService.createCheckoutSession({
      campaignId: this.donation.id,
      amount: Number(amount).toFixed(2),
      currency: 'BRL',
      successUrl: successUrl.toString(),
      cancelUrl: cancelUrl.toString(),
      donor: {
        name,
        email
      }
    }).subscribe({
      next: (session) => {
        this.isSubmitting = false;
        if (!session.url) {
          this.notificationService.openSnackBar('Checkout indisponivel.');
          return;
        }
        window.location.href = session.url;
      },
      error: () => {
        this.isSubmitting = false;
        this.notificationService.openSnackBar('Erro ao iniciar checkout.');
      }
    });
  }

  donationOpen(id_doacao: string) {
    this.globalService.sendDonationVisualization({
      id_doacao: id_doacao,
      id_user: "",
      visuaization: true,
      donation_like: false,
      love: false,
      shared: false,
      acesse_donation: true,
      create_pix: false,
      create_cartao: false,
      create_paypal: false,
      create_google: false,
      create_pag1: false,
      create_pag2: false,
      create_pag3: true,
      idioma: 'pt-BR',
      tema: 'normal',
      form: 'desktop',
      google: 'false',
      google_maps: 'false',
      google_ads: 'false',
      meta_pixel: 'false',
      Cookies_Stripe: 'false',
      Cookies_PayPal: 'false',
      visitor_info1_live: 'false'
    }).subscribe({
      next: () => {
        console.log('Visualizacao enviada com sucesso');
      },
      error: (err) => {
        console.error('Erro:', err);
      }
    });
  }

  fetchUser(userId: string): void {
    this.globalService.getUserById(userId).subscribe({
      next: (response) => {
        this.usuario = response;
        console.log('Usuario recebido:', response);
        this.usuario.date_create = this.formatDateCreate(response.date_create);
      },
      error: (error) => {
        console.error('Erro ao buscar usuario:', error);
      }
    });
  }

  formatDateCreate(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
    const formatted = date.toLocaleDateString('pt-BR', options);
    return `Usuario ativo desde ${formatted}`;
  }

  getIMGPerfil(id_user: string) {
    this.globalService.getUserProfileImage(id_user).subscribe({
      next: (url) => {
        this.profileImageUrl = url || 'assets/default-user.png';
      },
      error: (err) => {
        this.notificationService.openSnackBar(err);
      }
    });
  }

  showWelcomeDialog(): void {
    const baseUrl = window.location.origin + window.location.pathname;

    this.dialog.open(DialogSimpleMessageComponent, {
      width: '500px',
      data: {
        title: 'Bem-vindo!',
        message: `✔️ Este é seu link para compartilhar sua campanha: <a href="${baseUrl}" target="_blank" rel="noopener noreferrer">${baseUrl}</a>
      
✔️ Você pode acessar o site com o email e senha cadastrados.

✔️ O sistema tem um processo automático para transferir os valores doados. Um e-mail com instruções foi enviado para você.`
      }
    });
  }
}
