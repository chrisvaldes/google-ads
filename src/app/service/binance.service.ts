import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class BinanceService {

  private apiUrl = 'http://localhost:8080/api/binance';

  constructor(private http: HttpClient) {}

  getAccount(): Observable<any> {
    console.log("********************");
    console.log("********************");
    console.log("********************");
    console.log("********************");
    
    return this.http.get(`${this.apiUrl}/account`);
  }
}