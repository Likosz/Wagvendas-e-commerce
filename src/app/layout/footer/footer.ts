import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  LucideAngularModule,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Send,
  CreditCard,
  QrCode,
  Receipt,
  Shield,
  Truck,
  Clock,
} from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly icons = {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Send,
    CreditCard,
    Shield,
    Truck,
    Clock,
  };

  public newsletterEmail = new FormControl('', [Validators.required, Validators.email]);

  // Estado da newsletter
  public newsletterStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  public newsletterMessage = signal('');

  public currentYear = new Date().getFullYear();

  // Métodos de pagamento usando ícones (Pix/Cartão/Boleto)
  public payMethods = [
    { name: 'Cartão (crédito/débito)', icon: CreditCard },
    { name: 'Pix', icon: QrCode },
    { name: 'Boleto', icon: Receipt },
  ];

  public footerLinks = {
    institucional: [
      { label: 'Sobre Nós', path: '/sobre' },
      { label: 'Como Funciona', path: '/como-funciona' },
      { label: 'Trabalhe Conosco', path: '/carreiras' },
      { label: 'Imprensa', path: '/imprensa' },
    ],
    ajuda: [
      { label: 'Central de Ajuda', path: '/ajuda' },
      { label: 'Trocas e Devoluções', path: '/trocas' },
      { label: 'Rastrear Pedido', path: '/rastreio' },
      { label: 'Frete e Entrega', path: '/frete' },
    ],
    compras: [
      { label: 'Produtos', path: '/produtos' },
      { label: 'Ofertas', path: '/ofertas' },
      { label: 'Lançamentos', path: '/lancamentos' },
      { label: 'Mais Vendidos', path: '/mais-vendidos' },
    ],
    legal: [
      { label: 'Termos de Uso', path: '/termos' },
      { label: 'Política de Privacidade', path: '/privacidade' },
      { label: 'Política de Cookies', path: '/cookies' },
      { label: 'LGPD', path: '/lgpd' },
    ],
  };

  public socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com', color: 'hover:text-blue-600' },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com',
      color: 'hover:text-pink-600',
    },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com', color: 'hover:text-sky-500' },
    { name: 'YouTube', icon: Youtube, url: 'https://youtube.com', color: 'hover:text-red-600' },
  ];

  public paymentMethods = [
    { name: 'Visa', logo: '💳' },
    { name: 'Mastercard', logo: '💳' },
    { name: 'Elo', logo: '💳' },
    { name: 'Pix', logo: '📱' },
    { name: 'Boleto', logo: '🎫' },
  ];

  public submitNewsletter(): void {
    if (this.newsletterEmail.invalid) {
      this.newsletterEmail.markAsTouched();
      return;
    }

    this.newsletterStatus.set('loading');

    // a fazer: Integrar com service real
    setTimeout(() => {
      this.newsletterStatus.set('success');
      this.newsletterMessage.set('✅ Inscrição realizada com sucesso!');
      this.newsletterEmail.reset();

      setTimeout(() => {
        this.newsletterStatus.set('idle');
        this.newsletterMessage.set('');
      }, 5000);
    }, 1500);
  }

  public getEmailError(): string {
    if (this.newsletterEmail.hasError('required')) {
      return 'Email é obrigatório';
    }
    if (this.newsletterEmail.hasError('email')) {
      return 'Email inválido';
    }
    return '';
  }
}
