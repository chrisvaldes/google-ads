import { Injectable } from '@angular/core';

export interface StripePaymentData {
  amount: number;
  currency: string;
  email: string;
  name: string;
  method: string;
}

export interface PayPalPaymentData {
  method: string;
  order_id: string;
  payer_email: string;
  payer_name: string;
  amount: number;
  currency: string;
}

export interface MobileMoneyPaymentData {
  phone: string;
  amount: number;
  currency: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
}

export interface BinancePaymentData {
  email: string;
  name: string;
  amount: number;
  currency: string;
  method: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor() { }

  /**
   * Log les données de paiement Stripe
   */
  logStripePayment(data: StripePaymentData): void {
    console.log('%c💳 PAIEMENT STRIPE', 'color: #1976D2; font-weight: bold; font-size: 14px;');
    console.log('%cDonnées du formulaire reçues:', 'color: #1976D2; font-weight: bold;');
    console.table(data);
    
    console.log('%cDétails complets:', 'color: #1976D2; font-weight: bold;');
    console.log('  Email:', data.email);
    console.log('  Nom:', data.name);
    console.log('  Montant:', data.amount / 100 + ' ' + data.currency.toUpperCase());
    console.log('  Méthode:', data.method);
    console.log('  Timestamp:', new Date().toLocaleString());
  }

  /**
   * Log les données de paiement PayPal
   */
  logPayPalPayment(data: PayPalPaymentData): void {
    console.log('%c💰 PAIEMENT PAYPAL', 'color: #0070BA; font-weight: bold; font-size: 14px;');
    console.log('%cDonnées du formulaire reçues:', 'color: #0070BA; font-weight: bold;');
    console.table(data);
    
    console.log('%cDétails complets:', 'color: #0070BA; font-weight: bold;');
    console.log('  Email PayPal:', data.payer_email);
    console.log('  Nom PayPal:', data.payer_name);
    console.log('  Order ID:', data.order_id);
    console.log('  Montant:', data.amount / 100 + ' ' + data.currency.toUpperCase());
    console.log('  Timestamp:', new Date().toLocaleString());
  }

  /**
   * Log les données de paiement Mobile Money
   */
  logMobileMoneyPayment(data: MobileMoneyPaymentData): void {
    console.log('%c📱 PAIEMENT MOBILE MONEY', 'color: #FF9800; font-weight: bold; font-size: 14px;');
    console.log('%cDonnées du formulaire reçues:', 'color: #FF9800; font-weight: bold;');
    console.table(data);
    
    console.log('%cDétails complets:', 'color: #FF9800; font-weight: bold;');
    console.log('  Email:', data.email);
    console.log('  Nom:', data.name);
    console.log('  Prénom:', data.first_name);
    console.log('  Nom de famille:', data.last_name);
    console.log('  Téléphone:', data.phone);
    console.log('  Montant:', data.amount / 100 + ' ' + data.currency);
    console.log('  Timestamp:', new Date().toLocaleString());
  }

  /**
   * Log les données de paiement Binance
   */
  logBinancePayment(data: BinancePaymentData): void {
    console.log('%c₿ PAIEMENT BINANCE', 'color: #F3BA2F; font-weight: bold; font-size: 14px;');
    console.log('%cDonnées du formulaire reçues:', 'color: #F3BA2F; font-weight: bold;');
    console.table(data);
    
    console.log('%cDétails complets:', 'color: #F3BA2F; font-weight: bold;');
    console.log('  Email:', data.email);
    console.log('  Nom:', data.name);
    console.log('  Montant:', data.amount / 100 + ' ' + data.currency.toUpperCase());
    console.log('  Méthode:', data.method);
    console.log('  Timestamp:', new Date().toLocaleString());
  }

  /**
   * Log un résumé de tous les paiements
   */
  logPaymentSummary(method: string, email: string, amount: number, currency: string, name: string): void {
    const summary = {
      timestamp: new Date().toLocaleString(),
      method: method,
      email: email,
      name: name,
      amount: amount / 100 + ' ' + currency.toUpperCase(),
      status: 'Formulaire soumis'
    };

    console.log('%c📊 RÉSUMÉ PAIEMENT', 'color: #4CAF50; font-weight: bold; font-size: 14px;');
    console.table(summary);
  }
}

