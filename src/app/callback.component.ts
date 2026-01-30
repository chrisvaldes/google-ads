import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TikTokService } from './services/tiktok.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-5">
      <div class="text-center">
        <h3>Connexion à TikTok...</h3>
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
    </div>
  `
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private ttService: TikTokService
  ) {}

  async ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    const error = this.route.snapshot.queryParamMap.get('error');

    if (code) {
      try {
        const data = await this.ttService.handleCallback(code);
        
        // Envoyer les données à la fenêtre parente
        window.opener?.postMessage({
          type: 'tiktok-auth',
          success: true,
          data: data
        }, window.location.origin);
        
        // Fermer la popup
        window.close();
      } catch (err) {
        window.opener?.postMessage({
          type: 'tiktok-auth',
          success: false,
          error: 'Erreur lors de la connexion'
        }, window.location.origin);
        window.close();
      }
    } else if (error) {
      window.opener?.postMessage({
        type: 'tiktok-auth',
        success: false,
        error: 'Connexion refusée'
      }, window.location.origin);
      window.close();
    }
  }
}
