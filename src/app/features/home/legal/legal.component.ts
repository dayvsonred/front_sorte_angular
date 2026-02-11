import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface LegalItem {
  id: string;
  title: string;
  content: string[];
}

@Component({
  selector: 'app-legal',
  templateUrl: './legal.component.html',
  styleUrls: ['./legal.component.css']
})
export class LegalComponent implements OnInit {
  items: LegalItem[] = [
    {
      id: 'termos',
      title: 'Termos',
      content: [
        'Este site de doações opera com foco em transparência, segurança e responsabilidade social.',
        'Ao utilizar a plataforma, você concorda com o uso adequado, ético e legal dos serviços oferecidos.',
        'Nos reservamos o direito de atualizar estes termos para manter a conformidade e a segurança da comunidade.'
      ]
    },
    {
      id: 'privacidade',
      title: 'Aviso de Privacidade',
      content: [
        'Coletamos apenas os dados necessários para processar doações e melhorar sua experiência.',
        'Seus dados são protegidos com práticas de segurança e não são vendidos a terceiros.',
        'Você pode solicitar acesso, correção ou exclusão de dados a qualquer momento.'
      ]
    },
    {
      id: 'legal',
      title: 'Informações de caráter legal',
      content: [
        'Atuamos em conformidade com a legislação vigente sobre doações, pagamentos e proteção de dados.',
        'Parcerias e campanhas passam por validações para garantir legitimidade e segurança.',
        'Em caso de dúvidas legais, entre em contato com nossa equipe de suporte.'
      ]
    },
    {
      id: 'cookies',
      title: 'Política de cookies',
      content: [
        'Usamos cookies para melhorar a navegação, medir desempenho e personalizar a experiência.',
        'Você pode gerenciar ou desativar cookies no seu navegador, sem comprometer funções essenciais.',
        'Ao continuar usando o site, você concorda com o uso de cookies conforme esta política.'
      ]
    }
  ];
  openIndex: number | null = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const id = params['item'];
      const index = this.items.findIndex((item) => item.id === id);
      this.openIndex = index >= 0 ? index : 0;
    });
  }
}
