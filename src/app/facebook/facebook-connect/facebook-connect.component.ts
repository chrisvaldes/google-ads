// import { Component } from '@angular/core';
// import { FacebookService } from '../../services/facebook.service';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-facebook-connect',
//   standalone: true,
//   imports: [],
//   templateUrl: './facebook-connect.component.html',
//   styleUrl: './facebook-connect.component.css'
// })
// export class FacebookConnectComponent {

//   firstName = '';
//   lastName = '';
//   pages: any[] = [];

//   constructor(
//     private fb: FacebookService,
//     private http: HttpClient
//   ) {}

//   async connectFacebook() {
//     await this.fb.login();
//     const pages = await this.fb.getPages();

//     this.pages = pages.map(p => ({
//       id: p.id,
//       name: p.name,
//       token: p.access_token,
//       selected: false
//     }));
//   }

//   submit() {
//     const selectedPages = this.pages.filter(p => p.selected);

//     this.http.post('http://localhost:8080/api/facebook/connect', {
//       firstName: this.firstName,
//       lastName: this.lastName,
//       pages: selectedPages
//     }).subscribe();
//   }
// }