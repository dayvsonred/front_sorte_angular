import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Meta, Title } from '@angular/platform-browser';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { GlobalService } from 'src/app/core/services/global.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { APP_NAME } from 'src/app/core/constants/branding';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  appName = APP_NAME;
  Logado = false;
  contactForm: FormGroup;
  impactInView = false;
  metrics = [
    { label: 'Doações Realizadas', target: 20000, suffix: '+', display: 0 },
    { label: 'Projetos Financiados', target: 200, suffix: '+', display: 0 },
    { label: 'Vidas Impactadas', target: 4000, suffix: '+', display: 0 },
  ];
  private impactObserver?: IntersectionObserver;
  private metricsAnimated = false;
  @ViewChild('impactSection') impactSection?: ElementRef<HTMLElement>;
  testimonials = [
    { name: 'João Silva', text: 'Minha doação fez a diferença! A plataforma é fácil de usar e transparente.', role: 'Doador' },
    { name: 'Laís Oliveira', text: 'Apoiar esta causa foi emocionante. A história deles me inspirou!', role: 'Voluntária' },
  ];
  blogPosts = [
    { title: 'Nosso Impacto em 2025', excerpt: 'Saiba como suas doações transformaram vidas este ano.', link: '/blog/impacto-2025' },
    { title: 'Nova Campanha de Educação', excerpt: 'Lançamos uma iniciativa para apoiar escolas locais.', link: '/blog/educacao-2025' },
  ];
  teamMembers = [
    { name: 'Marina Oliveira', role: 'CMO – Chief Marketing Officer (Diretor de Marketing)', email: 'domains@thepuregrace.com', image: 'assets/cmo_v1.png', style: "" },
    { name: 'Dayvson Vicente', role: ' CTO – Chief Technology Officer (Diretor de Tecnologia) ', email: 'admin@thepuregrace.com', image: 'assets/cto_v1.png', style: "" },
  ];
  router: any;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private notificationService: NotificationService,
    private meta: Meta,
    private authenticationService: AuthenticationService,
    private globalService: GlobalService,
    private http: HttpClient
  ) {
    this.titleService.setTitle(APP_NAME + ' - Apoie Nossa Causa');
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
    this.meta.addTags([
      { name: 'description', content: 'Doe para causas que transformam vidas com a ' + APP_NAME + ' Creative Agency.' },
      { name: 'keywords', content: 'doação, nonprofit, caridade, impacto social' },
    ]);
  }

  ngOnInit(): void {

    const currentUser = this.globalService.getCurrentUser();
    if (currentUser) {
      this.Logado = true;
    }


  }

  ngAfterViewInit(): void {
    const section = this.impactSection?.nativeElement;
    if (!section) {
      return;
    }

    this.impactObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          this.impactInView = true;
          if (!this.metricsAnimated) {
            this.metricsAnimated = true;
            this.animateMetrics();
          }
        }
      },
      { threshold: 0.35 }
    );

    this.impactObserver.observe(section);
  }

  ngOnDestroy(): void {
    this.impactObserver?.disconnect();
  }

  logout(): void {
    this.authenticationService.logout();
    this.Logado = false;
    this.router.navigate(['/']);
  }

  async submitContact(): Promise<void> {
    if (this.contactForm.invalid) {
      this.notificationService.openSnackBar('Preencha todos os campos corretamente.');
      this.contactForm.markAllAsTouched();
      return;
    }

    const ip = await this.getUserIP(); // Aguarda IP

    const formValues = this.contactForm.value;
    const payload = {
      nome: formValues.name,
      email: formValues.email,
      mensagem: formValues.message,
      ip: ip,
      location: 'Desconhecida', // Pode adicionar geolocalização no futuro
      token: 'browser-123',     // Ou gerar dinamicamente
    };

    this.globalService.sendContactMessage(payload).subscribe({
      next: () => {
        this.notificationService.openSnackBar('Mensagem enviada com sucesso!');
        this.contactForm.reset();
        // Reset com valores padrão
        this.contactForm.reset({
          name: '',
          email: '',
          message: ''
        });

        Object.keys(this.contactForm.controls).forEach(key => {
          const control = this.contactForm.get(key);
          control?.markAsPristine();
          control?.markAsUntouched();
          control?.updateValueAndValidity();
        });

      },
      error: (err) => {
        this.notificationService.openSnackBar(err);
      }
    });
  }


  getUserIP(): Promise<string> {
    return this.http.get<any>('https://api.ipify.org?format=json')
      .toPromise()
      .then((res) => res.ip)
      .catch(() => '0.0.0.0');
  }

  formatMetricValue(metric: { display: number; target: number; suffix: string }): string {
    const formatted = Math.round(metric.display).toLocaleString('pt-BR');
    return `${formatted}${metric.suffix}`;
  }

  private animateMetrics(): void {
    const duration = 1400;
    const start = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.metrics = this.metrics.map((metric) => ({
        ...metric,
        display: metric.target * eased,
      }));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}





