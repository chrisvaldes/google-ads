import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header">
              <h2>Privacy Policy</h2>
            </div>
            <div class="card-body">
              <h5>1. Information We Collect</h5>
              <p>We collect information you provide directly to us, such as when you create an account, connect with social media services, or contact us for support.</p>
              
              <h5>2. How We Use Your Information</h5>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
              
              <h5>3. Information Sharing</h5>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this Privacy Policy.</p>
              
              <h5>4. Data Security</h5>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              
              <h5>5. Cookies and Tracking</h5>
              <p>We use cookies and similar tracking technologies to track activity on our application and hold certain information to improve your experience.</p>
              
              <h5>6. Third-Party Services</h5>
              <p>Our application may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.</p>
              
              <h5>7. Your Rights</h5>
              <p>You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.</p>
              
              <h5>8. Changes to This Policy</h5>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
              
              <h5>9. Contact Us</h5>
              <p>If you have any questions about this Privacy Policy, please contact us at privacy&#64;localhost.com</p>
              
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
      background-color: #28a745;
      color: white;
    }
    h5 {
      color: #28a745;
      margin-top: 20px;
    }
  `]
})
export class PrivacyComponent {
  currentDate = new Date();
}
