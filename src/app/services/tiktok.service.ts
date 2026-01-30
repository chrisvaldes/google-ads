import { Injectable } from '@angular/core';

declare global {
  interface Window {
    TikTok: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class TikTokService {

  private clientId = (window as any).TIKTOK_CONFIG?.appId || '7600764377586927627';
  private clientKey = (window as any).TIKTOK_CONFIG?.clientKey || '7600764377586927627'; // TikTok utilise un ID numérique
  private clientSecret = (window as any).TIKTOK_CONFIG?.clientSecret || 'PEf186c0tw3YHF06vw2qIda777EkTqOq';
  private redirectUri = (window as any).TIKTOK_CONFIG?.redirectUri || 'https://localhost:4201/callback';
  private scope = (window as any).TIKTOK_CONFIG?.scope || 'user.info.basic';

  constructor() { }

  async initializeTikTokSDK(): Promise<void> {
    return new Promise((resolve) => {
      // Charger le SDK TikTok
      const script = document.createElement('script');
      script.src = 'https://business-api.tiktok.com/portal/api';
      script.async = true;
      script.onload = () => {
        console.log('TikTok SDK chargé');
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  async login(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      // Générer PKCE
      const codeVerifier = this.generateCodeVerifier();
      const codeChallenge = await this.generateCodeChallenge(codeVerifier);
      
      // Stocker le code_verifier pour l'échange de token
      sessionStorage.setItem('tiktok_code_verifier', codeVerifier);
      
      // Utiliser l'URL correcte pour TikTok avec PKCE
      const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${this.clientKey}&redirect_uri=${encodeURIComponent(this.redirectUri)}&response_type=code&scope=${this.scope}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      
      const popup = window.open(
        authUrl,
        'tiktokLogin',
        'width=600,height=600,scrollbars=yes,resizable=yes'
      );

      // Écouter la fermeture de la popup
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          reject(new Error('Connexion annulée'));
        }
      }, 1000);

      // Écouter les messages de la popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin === window.location.origin && event.data.type === 'tiktok-auth') {
          clearInterval(checkClosed);
          popup?.close();
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

  // Générer un code verifier pour PKCE
  private generateCodeVerifier(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode.apply(null, Array.from(array)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  // Générer un code challenge pour PKCE
  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  async handleCallback(code: string): Promise<any> {
    try {
      // Utiliser l'endpoint correct pour TikTok
      const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_key: this.clientKey,
          client_secret: this.clientSecret,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
          code_verifier: sessionStorage.getItem('tiktok_code_verifier') || ''
        })
      });

      const data = await response.json();
      
      if (data.access_token) {
        localStorage.setItem('tiktok_access_token', data.access_token);
        return data;
      } else {
        throw new Error('Erreur lors de l\'obtention du token');
      }
    } catch (error) {
      console.error('Erreur callback TikTok:', error);
      throw error;
    }
  }

  async getUserInfo(): Promise<any> {
    const accessToken = localStorage.getItem('tiktok_access_token');
    if (!accessToken) {
      throw new Error('Non connecté à TikTok');
    }

    try {
      const response = await fetch('https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur récupération infos utilisateur TikTok:', error);
      throw error;
    }
  }

  async getBusinessAccounts(): Promise<any[]> {
    const accessToken = localStorage.getItem('tiktok_access_token');
    if (!accessToken) {
      throw new Error('Non connecté à TikTok');
    }

    try {
      const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/business/get/', {
        method: 'GET',
        headers: {
          'Access-Token': accessToken,
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();
      return data.data?.business_info || [];
    } catch (error) {
      console.error('Erreur récupération business accounts TikTok:', error);
      throw error;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('tiktok_access_token');
  }

  logout(): void {
    localStorage.removeItem('tiktok_access_token');
  }
}
