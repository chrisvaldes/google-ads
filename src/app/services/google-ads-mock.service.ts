import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleAdsMockService {

  // Mock de vos comptes Google Ads - remplacez avec vos vrais comptes
  private mockAccounts = [
    {
      resourceName: 'customers/1234567890',
      id: '1234567890',
      customer: {
        resourceName: 'customers/1234567890',
        id: 1234567890,
        displayName: 'Compte Google Ads Principal',
        currencyCode: 'EUR',
        timeZone: 'Europe/Paris'
      }
    },
    {
      resourceName: 'customers/9876543210',
      id: '9876543210',
      customer: {
        resourceName: 'customers/9876543210',
        id: 9876543210,
        displayName: 'Compte Google Ads Secondaire',
        currencyCode: 'EUR',
        timeZone: 'Europe/Paris'
      }
    }
  ];

  private mockCampaigns = [
    {
      campaign: {
        id: '1',
        name: 'Campagne Test 1',
        status: 'ENABLED'
      }
    },
    {
      campaign: {
        id: '2',
        name: 'Campagne Test 2',
        status: 'PAUSED'
      }
    }
  ];

  async getCustomerAccounts(): Promise<any[]> {
    console.log('🔄 Utilisation mock service pour Google Ads');
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('✅ Mock comptes:', this.mockAccounts);
        resolve(this.mockAccounts);
      }, 1000);
    });
  }

  async getCustomerDetails(customerId: string): Promise<any> {
    console.log('🔄 Mock détails compte:', customerId);
    const account = this.mockAccounts.find(acc => acc.id === customerId);
    return account?.customer || {};
  }

  async getCampaigns(customerId: string): Promise<any[]> {
    console.log('🔄 Mock campagnes pour:', customerId);
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('✅ Mock campagnes:', this.mockCampaigns);
        resolve(this.mockCampaigns);
      }, 500);
    });
  }

  isLoggedIn(): boolean {
    return !!(sessionStorage.getItem('google_ads_access_token') || localStorage.getItem('google_ads_access_token'));
  }

  logout(): void {
    sessionStorage.removeItem('google_ads_access_token');
    localStorage.removeItem('google_ads_access_token');
  }
}
