import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, Zap, TrendingUp, Package } from 'lucide-angular';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  readonly icons = {
    ArrowRight,
    Zap,
    TrendingUp,
    Package,
  };

  // Badges promocionais animados
  public badges = [
    {
      icon: Zap,
      text: 'Frete Grátis acima de R$ 199',
      color: 'bg-accent-500',
    },
    {
      icon: TrendingUp,
      text: 'Até 50% OFF em eletrônicos',
      color: 'bg-success-500',
    },
    {
      icon: Package,
      text: 'Entrega expressa disponível',
      color: 'bg-primary-600',
    },
  ];

  public isVisible = signal(true);
}
