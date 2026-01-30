import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAdsService {

  private clientId = environment.googleClientId || 'VOTRE_CLIENT_ID'; // OAuth2 Client ID
  private clientSecret = environment.googleClientSecret || 'VOTRE_CLIENT_SECRET'; // Client Secret
  private developerToken = environment.googleDeveloperToken || 'VOTRE_DEVELOPER_TOKEN'; // Developer Token Google Ads
  private apiKey = environment.googleApiKey || 'VOTRE_API_KEY'; // Clé API Google
  private redirectUri = environment.googleRedirectUri || 'https://localhost:4200/callback';

  constructor(private http: HttpClient) { }

  async initializeGoogleAdsSDK(): Promise<void> {
    return new Promise((resolve) => {
      // Charger Google API
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        console.log('Google API SDK chargé');
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  async login(): Promise<any> {
    console.log('🔍 Client ID utilisé:', this.clientId);
    console.log('🔍 Redirect URI:', this.redirectUri);

    return new Promise((resolve, reject) => {
      // Construction de l'URL OAuth2 avec tous les scopes nécessaires
      const authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
        `client_id=${this.clientId}&` +
        `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
        `response_type=token&` +
        `scope=https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&` +
        `state=${Math.random().toString(36).substring(7)}`;

      // Utiliser le flux OAuth2 standard avec popup
      const popup = window.open(
        authUrl,
        'googleAdsLogin',
        'width=600,height=600,scrollbars=yes,resizable=yes'
      );

      // Timeout après 2 minutes (pas de vérification popup.closed pour éviter COOP)
      const timeoutId = setTimeout(() => {
        window.removeEventListener('message', messageHandler);
        try {
          popup?.close();
        } catch (e) {
          // Ignorer les erreurs de fermeture
        }
        reject(new Error('Timeout de connexion'));
      }, 120000);

      // Écouter les messages de la popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin === window.location.origin && event.data.type === 'google-ads-auth') {
          clearTimeout(timeoutId);
          try {
            popup?.close();
          } catch (e) {
            // Ignorer les erreurs de fermeture de popup
          }
          window.removeEventListener('message', messageHandler);
          
          if (event.data.success) {
            resolve(event.data.data);
          } else {
            reject(new Error(event.data.error || 'Erreur de connexion'));
          }
        }
      };

      window.addEventListener('message', messageHandler);
    });
  }

  async initializeGoogleIdentityServices(): Promise<void> {
    return new Promise((resolve) => {
      // Charger Google Identity Services
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = () => {
        console.log('Google Identity Services chargé');
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  // Récupérer VOS vrais comptes Google Ads - utilise le proxy en production, direct en local
  async getCustomerAccounts(): Promise<any[]> {
    const accessToken = sessionStorage.getItem('google_ads_access_token') || localStorage.getItem('google_ads_access_token');
    if (!accessToken) {
      throw new Error('Non connecté à Google Ads');
    }

    console.log('🔍 Debug - Token:', accessToken.substring(0, 20) + '...');
    console.log('🔍 Debug - Developer Token:', this.developerToken);

    try {
      // En production, utiliser le proxy serverless
      const isProduction = window.location.hostname !== 'localhost';
      
      if (isProduction) {
        // Utiliser le proxy serverless sur Vercel
        const response = await fetch('/api/google-ads-proxy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            endpoint: 'customers:listAccessibleCustomers',
            method: 'GET',
            accessToken: accessToken,
            developerToken: this.developerToken
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Réponse API Google Ads (production):', data);
        
        let allAccounts = [];
        
        if (data?.resourceNames && data.resourceNames.length > 0) {
          const promises = data.resourceNames.map(async (resourceName: string) => {
            try {
              const details = await this.getCustomerDetails(resourceName);
              return {
                resourceName: resourceName,
                id: resourceName.replace('customers/', ''),
                ...details
              };
            } catch (e) {
              console.error('❌ Erreur détails compte', resourceName, e);
              return null;
            }
          });
          
          const results = await Promise.all(promises);
          allAccounts = results.filter(account => account !== null);
        }

        console.log('📊 Total comptes trouvés (production):', allAccounts.length);
        return allAccounts;
        
      } else {
        // En local, essayer direct (échouera à cause de CORS mais on affiche le message)
        console.log('🔄 Mode local détecté - les appels API échoueront à cause de CORS');
        console.log('💡 Solution : Déployez sur Vercel pour contourner CORS');
        
        // Message clair pour l'utilisateur
        throw new Error('Déployez l\'application sur Vercel pour accéder à vos comptes Google Ads. Les appels API sont bloqués par CORS en local.');
      }
      
    } catch (error: any) {
      console.error('❌ Erreur API Google Ads:', error);
      throw error;
    }
  }

  async getCustomerDetails(customerId: string): Promise<any> {
    const accessToken = sessionStorage.getItem('google_ads_access_token') || localStorage.getItem('google_ads_access_token');
    if (!accessToken) {
      throw new Error('Non connecté à Google Ads');
    }

    console.log('🔄 Récupération détails compte:', customerId);

    try {
      // Utiliser un proxy CORS alternatif
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `https://googleads.googleapis.com/v17/customers/${customerId}:get`;
      
      const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': this.developerToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          resourceName: `customers/${customerId}`
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Détails compte reçus:', data);
      return data?.customer || {};
      
    } catch (error: any) {
      console.error('❌ Erreur détails compte:', error);
      return {};
    }
  }

  async getCampaigns(customerId: string): Promise<any[]> {
    const accessToken = sessionStorage.getItem('google_ads_access_token') || localStorage.getItem('google_ads_access_token');
    if (!accessToken) {
      throw new Error('Non connecté à Google Ads');
    }

    console.log('🔄 Récupération campagnes pour:', customerId);

    try {
      // Utiliser un proxy CORS alternatif
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `https://googleads.googleapis.com/v17/customers/${customerId}:search`;
      
      const response = await fetch(proxyUrl + encodeURIComponent(apiUrl), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'developer-token': this.developerToken,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          query: 'SELECT campaign.id, campaign.name, campaign.status FROM campaign ORDER BY campaign.name'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Campagnes reçues:', data);
      return data?.results || [];
      
    } catch (error: any) {
      console.error('❌ Erreur campagnes:', error);
      throw error;
    }
  }

  // Tester l'API Google Ads directement pour diagnostiquer
  async testGoogleAdsApi(): Promise<any> {
    const accessToken = sessionStorage.getItem('google_ads_access_token') || localStorage.getItem('google_ads_access_token');
    if (!accessToken) {
      throw new Error('Non connecté à Google Ads');
    }

    console.log('🧪 Test API Google Ads...');
    console.log('🔍 Token:', accessToken.substring(0, 50) + '...');
    console.log('🔍 Developer Token:', this.developerToken);

    try {
      // Test 1: Vérifier le token OAuth
      const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
      const userInfo = await userInfoResponse.json();
      console.log('✅ UserInfo OAuth:', userInfo);

      // Test 2: Essayer l'API Google Ads avec différentes approches
      const testUrl1 = `https://googleads.googleapis.com/v17/customers:listAccessibleCustomers?` +
        `access_token=${encodeURIComponent(accessToken)}&` +
        `developer_token=${encodeURIComponent(this.developerToken)}`;

      console.log('🔗 Test URL:', testUrl1);

      // Test avec proxy
      const proxyResponse = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(testUrl1)}`);
      const proxyData = await proxyResponse.json();
      console.log('✅ Réponse proxy:', proxyData);

      return {
        userInfo: userInfo,
        googleAdsResponse: proxyData,
        success: true
      };

    } catch (error: any) {
      console.error('❌ Erreur test API:', error);
      return {
        error: error.message,
        success: false
      };
    }
  }

  isLoggedIn(): boolean {
    return !!(sessionStorage.getItem('google_ads_access_token') || localStorage.getItem('google_ads_access_token'));
  }

  logout(): void {
    sessionStorage.removeItem('google_ads_access_token');
    localStorage.removeItem('google_ads_access_token');
    // Révoquer le token si possible avec Google Identity Services
    if (window.google?.accounts.oauth2) {
      window.google.accounts.oauth2.revoke(localStorage.getItem('google_ads_access_token'));
    }
  }
}
