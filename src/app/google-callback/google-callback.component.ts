import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5>Authentification Google Ads</h5>
            </div>
            <div class="card-body text-center">
              <div *ngIf="loading">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
                <p class="mt-3">Traitement de l'authentification...</p>
              </div>
              
              <div *ngIf="!loading">
                <div *ngIf="error" class="alert alert-danger">
                  <i class="bi bi-exclamation-triangle"></i>
                  {{ error }}
                </div>
                
                <div *ngIf="!error" class="alert alert-success">
                  <i class="bi bi-check-circle"></i>
                  Authentification réussie! Redirection...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class GoogleCallbackComponent implements OnInit {
  loading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.handleCallback();
  }

  handleCallback() {
    try {
      // Récupérer les paramètres de l'URL
      const fragment = window.location.hash.substring(1); // Enlever le #
      const params = new URLSearchParams(fragment);
      
      const accessToken = params.get('access_token');
      const error = params.get('error');
      
      if (error) {
        this.error = `Erreur d'authentification: ${error}`;
        this.loading = false;
        this.sendResultToParent(false, this.error);
        return;
      }
      
      if (accessToken) {
        // Sauvegarder le token
        localStorage.setItem('google_ads_access_token', accessToken);
        
        // Envoyer le succès à la fenêtre parente
        this.sendResultToParent(true, { access_token: accessToken });
        
        // Redirection après un court délai
        setTimeout(() => {
          window.close();
        }, 1000);
      } else {
        this.error = 'Token d\'accès non trouvé';
        this.loading = false;
        this.sendResultToParent(false, this.error);
      }
    } catch (err) {
      this.error = 'Erreur lors du traitement de l\'authentification';
      this.loading = false;
      this.sendResultToParent(false, this.error);
    }
  }

  private sendResultToParent(success: boolean, data: any) {
    if (window.opener) {
      window.opener.postMessage({
        type: 'google-ads-auth',
        success: success,
        data: data
      }, window.location.origin);
    }
  }
}
