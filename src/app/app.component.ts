import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FacebookService } from './services/facebook.service';
import { TikTokService } from './services/tiktok.service';
import { GoogleAdsService } from './services/google-ads.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  isConnected = false;
  businesses: any[] = [];
  selectedBusinesses: string[] = [];
  selectedBusinessesData: any[] = [];
  pagesBusiness: any[] = [];
  loading = false;

  // Nouvelles propriétés pour la section 2
  selectedBusinessManagerId: string = '';
  businessPages: any[] = [];
  selectedPages: string[] = [];
  selectedPagesData: any[] = [];

  // Propriétés TikTok
  isTikTokConnected = false;
  tiktokUser: any = null;
  tiktokBusinessAccounts: any[] = [];

  // Propriétés Google Ads
  isGoogleAdsConnected = false;
  googleAdsUser: any = null;
  googleAdsAccounts: any[] = [];
  selectedGoogleAdsAccount: string = '';
  googleAdsCampaigns: any[] = [];

  constructor(private fbService: FacebookService, private ttService: TikTokService, private gaService: GoogleAdsService) { }

  async ngOnInit() {
    // Vérifier Facebook
    const status = await this.fbService.getLoginStatus();
    if (status.status === 'connected') {
      this.isConnected = true;
      await this.loadBusinesses();
    }

    // Vérifier TikTok
    if (this.ttService.isLoggedIn()) {
      this.isTikTokConnected = true;
      await this.loadTikTokData();
    }

    // Vérifier Google Ads
    if (this.gaService.isLoggedIn()) {
      this.isGoogleAdsConnected = true;
      await this.loadGoogleAdsData();
    }
  }

  async login() {
    try {
      await this.fbService.login();
      this.isConnected = true;
      await this.loadBusinesses();
    } catch (e) {
      console.error('Login error', e);
    }
  }

  async loginTikTok() {
    try {
      const data = await this.ttService.login();
      console.log('Connexion TikTok réussie:', data);
      this.isTikTokConnected = true;
      await this.loadTikTokData();
    } catch (e) {
      console.error('TikTok login error', e);
      alert('Erreur de connexion à TikTok: ' + e);
    }
  }

  async loadTikTokData() {
    try {
      this.tiktokUser = await this.ttService.getUserInfo();
      this.tiktokBusinessAccounts = await this.ttService.getBusinessAccounts();
      console.log('Utilisateur TikTok:', this.tiktokUser);
      console.log('Comptes business TikTok:', this.tiktokBusinessAccounts);
    } catch (e) {
      console.error('Erreur chargement données TikTok:', e);
    }
  }

  logoutTikTok() {
    this.ttService.logout();
    this.isTikTokConnected = false;
    this.tiktokUser = null;
    this.tiktokBusinessAccounts = [];
  }

  async loadBusinesses() {
    this.businesses = await this.fbService.getBusinesses();
  }

  toggleBusiness(businessId: string, event: any) {
    if (event.target.checked) {
      this.selectedBusinesses.push(businessId);
    } else {
      this.selectedBusinesses =
        this.selectedBusinesses.filter(id => id !== businessId);
    }
  }

  validateSelection() {
    this.selectedBusinessesData = this.businesses.filter(b => 
      this.selectedBusinesses.includes(b.id)
    );
    
    console.log('Business Managers sélectionnés:', this.selectedBusinessesData);
    
    this.selectedBusinessesData.forEach(b => {
      console.log(`Nom: ${b.name}, ID: ${b.id}`);
    });
  }

  // Nouvelles méthodes pour la section 2
  async onBusinessManagerChange(event: any) {
    this.selectedBusinessManagerId = event.target.value;
    this.businessPages = [];
    this.selectedPages = [];
    
    if (this.selectedBusinessManagerId) {
      this.loading = true;
      try {
        const pages = await this.fbService.getBusinessPages(this.selectedBusinessManagerId);
        this.businessPages = pages.map(p => ({
          ...p,
          businessId: this.selectedBusinessManagerId,
          businessName: this.getSelectedBusinessManagerName()
        }));
      } catch (e) {
        console.error('Erreur chargement pages:', e);
      } finally {
        this.loading = false;
      }
    }
  }

  getSelectedBusinessManagerName(): string {
    const business = this.selectedBusinessesData.find(b => b.id === this.selectedBusinessManagerId);
    return business ? business.name : '';
  }

  togglePage(pageId: string, event: any) {
    if (event.target.checked) {
      this.selectedPages.push(pageId);
    } else {
      this.selectedPages = this.selectedPages.filter(id => id !== pageId);
    }
  }

  validatePageSelection() {
    this.selectedPagesData = this.businessPages.filter(p => 
      this.selectedPages.includes(p.id)
    );
    
    console.log('Pages sélectionnées:', this.selectedPagesData);
    
    this.selectedPagesData.forEach(p => {
      console.log(`Nom: ${p.name}, ID: ${p.id}, Business: ${p.businessName}`);
    });
  }

  async loadPages() {
    this.loading = true;
    this.pagesBusiness = [];

    for (const businessId of this.selectedBusinesses) {
      const pages = await this.fbService.getBusinessPages(businessId);

      pages.forEach(p => {
        this.pagesBusiness.push({
          id: p.id,
          name: p.name,
          ownership: 'OWNED',
          businessId,
          businessName: this.businesses.find(b => b.id === businessId)?.name,
          tasks: p.tasks || []
        });
      });
    }

    this.loading = false;
  }

  // Méthodes Google Ads
  async loginGoogleAds() {
    try {
      await this.gaService.login();
      this.isGoogleAdsConnected = true;
      await this.loadGoogleAdsData();
    } catch (e) {
      console.error('Login Google Ads error', e);
    }
  }

  async loadGoogleAdsData() {
    try {
      this.googleAdsUser = await this.gaService.login();
      this.googleAdsAccounts = await this.gaService.getCustomerAccounts();
    } catch (e) {
      console.error('Load Google Ads data error', e);
    }
  }

  logoutGoogleAds() {
    this.gaService.logout();
    this.isGoogleAdsConnected = false;
    this.googleAdsUser = null;
    this.googleAdsAccounts = [];
    this.googleAdsCampaigns = [];
  }

  async onGoogleAdsAccountChange(event: any) {
    this.selectedGoogleAdsAccount = event.target.value;
    if (this.selectedGoogleAdsAccount) {
      try {
        this.googleAdsCampaigns = await this.gaService.getCampaigns(this.selectedGoogleAdsAccount);
      } catch (e) {
        console.error('Error loading campaigns', e);
      }
    }
  }

  async testGoogleAdsApi() {
    console.log('🧪 Lancement du test API Google Ads...');
    try {
      const result = await this.gaService.testGoogleAdsApi();
      console.log('📊 Résultat du test:', result);
      
      if (result.success) {
        console.log('✅ Test réussi !');
        console.log('👤 UserInfo:', result.userInfo);
        console.log('🔍 Google Ads Response:', result.googleAdsResponse);
      } else {
        console.error('❌ Test échoué:', result.error);
      }
    } catch (error: any) {
      console.error('❌ Erreur lors du test:', error);
    }
  }
}

