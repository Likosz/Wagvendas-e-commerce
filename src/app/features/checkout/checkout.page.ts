import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import {
  LucideAngularModule,
  ArrowRight,
  ArrowLeft,
  MapPin,
  User,
  CreditCard,
  QrCode,
  Receipt,
  CheckCircle2,
} from 'lucide-angular';
import { CepService } from '../../core/services/cep.service';
import { CartService } from '../../core/services/cart.service';
import { PLATFORM_ID } from '@angular/core';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  templateUrl: './checkout.page.html',
  styleUrl: './checkout.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutPage {
  private fb = inject(FormBuilder);
  private cep = inject(CepService);
  private router = inject(Router);
  public cart = inject(CartService);
  private platformId = inject(PLATFORM_ID);

  private readonly STORAGE_KEY = 'wagsales_checkout_v1';

  readonly icons = {
    ArrowRight,
    ArrowLeft,
    MapPin,
    User,
    CreditCard,
    QrCode,
    Receipt,
    CheckCircle2,
  };

  public submitting = signal(false);
  public stage = signal<'details' | 'payment' | 'success'>('details');
  public orderId = signal<string | null>(null);
  public cepLoading = signal(false);
  public cepError = signal<string | null>(null);

  private phoneValidator = (control: AbstractControl): ValidationErrors | null => {
    const digits = (control.value || '').toString().replace(/\D/g, '');
    return digits.length === 10 || digits.length === 11 ? null : { phone: true };
  };

  private cepValidator = (control: AbstractControl): ValidationErrors | null => {
    const digits = (control.value || '').toString().replace(/\D/g, '');
    return digits.length === 8 ? null : { cep: true };
  };

  private cpfValidator = (control: AbstractControl): ValidationErrors | null => {
    const raw = (control.value || '').toString();
    const cpf = raw.replace(/\D/g, '');
    if (cpf.length !== 11) return { cpf: true };
    if (/^(\d)\1{10}$/.test(cpf)) return { cpf: true };
    const calc = (base: string, factor: number) => {
      let total = 0;
      for (let i = 0; i < base.length; i++) total += parseInt(base[i], 10) * (factor - i);
      const rest = (total * 10) % 11;
      return rest === 10 ? 0 : rest;
    };
    const d1 = calc(cpf.substring(0, 9), 10);
    const d2 = calc(cpf.substring(0, 10), 11);
    return d1 === parseInt(cpf[9], 10) && d2 === parseInt(cpf[10], 10) ? null : { cpf: true };
  };

  customerForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, this.phoneValidator]],
    document: ['', [Validators.required, this.cpfValidator]],
  });

  addressForm = this.fb.group({
    cep: ['', [Validators.required, this.cepValidator]],
    street: ['', [Validators.required]],
    number: ['', [Validators.required]],
    complement: [''],
    neighborhood: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}$/)]],
  });

  paymentForm = this.fb.group({
    method: ['credit', [Validators.required]], // credit | pix | boleto
    cardName: [''],
    cardNumber: [''],
    cardExp: [''],
    cardCvv: [''],
    installments: [1],
  });

  public canProceed = computed(() => this.customerForm.valid && this.addressForm.valid);

  async findCep(): Promise<void> {
    this.cepError.set(null);
    const raw = this.addressForm.controls.cep.value || '';
    const sanitized = raw.replace(/\D/g, '');
    if (sanitized.length !== 8) {
      this.cepError.set('CEP deve ter 8 dígitos.');
      return;
    }
    this.cepLoading.set(true);
    const result = await this.cep.lookup(sanitized);
    this.cepLoading.set(false);
    if (!result) {
      this.cepError.set('CEP não encontrado.');
      return;
    }
    this.addressForm.patchValue({
      street: result.street,
      neighborhood: result.neighborhood,
      city: result.city,
      state: result.state,
      complement: result.complement || this.addressForm.controls.complement.value,
    });
  }

  continueToPayment(): void {
    this.customerForm.markAllAsTouched();
    this.addressForm.markAllAsTouched();
    if (!this.customerForm.valid || !this.addressForm.valid) {
      this.focusFirstInvalid();
      return;
    }
    this.stage.set('payment');
  }

  backToDetails(): void {
    this.stage.set('details');
  }

  placeOrder(): void {
    if (!this.paymentForm.valid) return;
    const method = this.paymentForm.controls.method.value;
    if (method === 'credit') {
      const nameOk = !!this.paymentForm.controls.cardName.value?.toString().trim();
      const digits = (this.paymentForm.controls.cardNumber.value || '').replace(/\D/g, '');
      const numOk = digits.length >= 12; // relaxado para demo
      const expOk = /^\d{2}\/\d{2}$/.test(this.paymentForm.controls.cardExp.value || '');
      const cvvOk = /^\d{3,4}$/.test(this.paymentForm.controls.cardCvv.value || '');
      if (!(nameOk && numOk && expOk && cvvOk)) {
        this.paymentForm.markAllAsTouched();
        return;
      }
    }
    this.submitting.set(true);
    setTimeout(() => {
      this.submitting.set(false);
      const id = `WS-${Date.now().toString(36).toUpperCase()}`;
      this.orderId.set(id);
      this.stage.set('success');
      // clear cart
      try {
        this.cart.clear();
      } catch {}
      this.clearFormStorage();
    }, 1200);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }

  // Input masks
  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    input.value = this.formatPhone(digits);
    this.customerForm.controls.phone.setValue(input.value, { emitEvent: false });
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 11);
    input.value = this.formatCpf(digits);
    this.customerForm.controls.document.setValue(input.value, { emitEvent: false });
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 8);
    input.value = this.formatCep(digits);
    this.addressForm.controls.cep.setValue(input.value, { emitEvent: false });
  }

  onStateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = (input.value || '').toUpperCase().slice(0, 2);
    this.addressForm.controls.state.setValue(input.value, { emitEvent: false });
  }

  // Habilita o "Finalizar pedido" somente quando válido
  canPlaceOrder(): boolean {
    if (this.submitting()) return false;
    const method = this.paymentForm.controls.method.value;
    if (method === 'credit') {
      const nameOk = !!this.paymentForm.controls.cardName.value?.toString().trim();
      const digits = (this.paymentForm.controls.cardNumber.value || '').replace(/\D/g, '');
      const numOk = digits.length >= 12;
      const expOk = /^\d{2}\/\d{2}$/.test(this.paymentForm.controls.cardExp.value || '');
      const cvvOk = /^\d{3,4}$/.test(this.paymentForm.controls.cardCvv.value || '');
      return nameOk && numOk && expOk && cvvOk;
    }
    // Pix e Boleto: sem campos adicionais obrigatórios
    return true;
  }

  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 16);
    const chunks = digits.match(/.{1,4}/g) || [];
    input.value = chunks.join(' ');
    this.paymentForm.controls.cardNumber.setValue(input.value, { emitEvent: false });
  }

  onCardExpInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    let out = digits;
    if (digits.length > 2) out = digits.slice(0, 2) + '/' + digits.slice(2);
    input.value = out;
    this.paymentForm.controls.cardExp.setValue(input.value, { emitEvent: false });
  }

  onCardCvvInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '').slice(0, 4);
    input.value = digits;
    this.paymentForm.controls.cardCvv.setValue(input.value, { emitEvent: false });
  }

  private formatPhone(digits: string): string {
    if (digits.length <= 2) return `(${digits}`;
    const ddd = digits.slice(0, 2);
    if (digits.length <= 6) return `(${ddd}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${ddd}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
    return `(${ddd}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  private formatCpf(digits: string): string {
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 9);
    const p4 = digits.slice(9, 11);
    let out = p1;
    if (p2) out += `.${p2}`;
    if (p3) out += `.${p3}`;
    if (p4) out += `-${p4}`;
    return out;
  }

  private formatCep(digits: string): string {
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  }

  // Persistência leve dos formulários
  ngOnInit(): void {
    this.loadForm();
    if (isPlatformBrowser(this.platformId)) {
      this.customerForm.valueChanges.pipe(debounceTime(200)).subscribe(() => this.saveForm());
      this.addressForm.valueChanges.pipe(debounceTime(200)).subscribe(() => this.saveForm());
      this.paymentForm.valueChanges.pipe(debounceTime(200)).subscribe(() => this.saveForm());
    }
  }

  private saveForm(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const payload = {
        customer: this.customerForm.getRawValue(),
        address: this.addressForm.getRawValue(),
        payment: this.paymentForm.getRawValue(),
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }

  private loadForm(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as any;
      if (parsed?.customer) this.customerForm.patchValue(parsed.customer, { emitEvent: false });
      if (parsed?.address) this.addressForm.patchValue(parsed.address, { emitEvent: false });
      if (parsed?.payment) this.paymentForm.patchValue(parsed.payment, { emitEvent: false });
    } catch {}
  }

  private focusFirstInvalid(): void {
    const order = [
      'fullName',
      'email',
      'phone',
      'document',
      'cep',
      'street',
      'number',
      'neighborhood',
      'city',
      'state',
    ];
    for (const id of order) {
      const control =
        (this.customerForm.controls as any)[id] || (this.addressForm.controls as any)[id];
      if (control && control.invalid) {
        const el = document.getElementById(id);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        break;
      }
    }
  }

  private clearFormStorage(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {}
  }
}
