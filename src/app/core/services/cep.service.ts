import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CepResult {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // cidade
  uf: string; // estado
  erro?: boolean;
}

export interface AddressFromCep {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
}

@Injectable({ providedIn: 'root' })
export class CepService {
  private platformId = inject(PLATFORM_ID);

  async lookup(cep: string): Promise<AddressFromCep | null> {
    const sanitized = (cep || '').replace(/\D/g, '');
    if (sanitized.length !== 8) return null;
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${sanitized}/json/`);
      if (!res.ok) return null;
      const data = (await res.json()) as CepResult;
      if ((data as any).erro) return null;
      return {
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
        complement: data.complemento || '',
      };
    } catch {
      return null;
    }
  }
}

