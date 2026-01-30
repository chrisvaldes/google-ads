// import { Injectable } from '@angular/core';

// // ad.service.ts
// import { HttpClient } from '@angular/common/http';

// @Injectable({ providedIn: 'root' })
// export class AdService {
//   private BASE_URL = 'http://localhost:8080/api/facebook';

//   constructor(private http: HttpClient) {}

//   createAd() {
//     return this.http.post(`${this.BASE_URL}/createAd`, {});
//   }

//   getAds() {
//     return this.http.get(`${this.BASE_URL}/ads`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacebookAdService {

  private API_URL = 'http://localhost:8080/api/facebook';

  constructor(private http: HttpClient) {}

  // 🔹 Créer une publicité
  createAd(pageId: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/createAd`,
      null,
      {
        params: {
          pageId: pageId
        }
      }
    );
  }

  // 🔹 Récupérer toutes les publicités
  getAds(): Observable<any> {
    return this.http.get(`${this.API_URL}/ads`);
  }
}
