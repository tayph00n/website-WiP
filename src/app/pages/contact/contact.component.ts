import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
// Create a bot "safe" mail link via obfuscation
export class ContactComponent {
  user = 'tayfun.bolat';
  domain = 'gmail.com';

  get email(): string {
    return `${this.user}@${this.domain}`;
  }

  get mailtoLink(): string {
    return `mailto:${this.email}`;
  }

  get safeEmail(): string {
    return `${this.user}&#64;${this.domain}`;
  }
}
