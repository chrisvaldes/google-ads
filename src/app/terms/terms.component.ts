import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h2>Terms of Service</h2>
            </div>
            <div class="card-body">
              <h5>1. Acceptance of Terms</h5>
              <p>By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h5>2. Use License</h5>
              <p>Permission is granted to temporarily download one copy of the materials on our application for personal, non-commercial transitory viewing only.</p>
              
              <h5>3. Disclaimer</h5>
              <p>The materials on our application are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
              
              <h5>4. Limitations</h5>
              <p>In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our application.</p>
              
              <h5>5. Privacy Policy</h5>
              <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our application.</p>
              
              <h5>6. Revisions and Errata</h5>
              <p>The materials appearing on our application could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its application are accurate, complete, or current.</p>
              
              <h5>7. Governing Law</h5>
              <p>These terms and conditions are governed by and construed in accordance with the laws of your jurisdiction and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>
              
              <hr>
              <p class="text-muted">Last updated: {{currentDate | date:'longDate'}}</p>
              <a routerLink="/" class="btn btn-primary">Back to Home</a>
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
    .card-header {
      background-color: #007bff;
      color: white;
    }
    h5 {
      color: #007bff;
      margin-top: 20px;
    }
  `]
})
export class TermsComponent {
  currentDate = new Date();
}
