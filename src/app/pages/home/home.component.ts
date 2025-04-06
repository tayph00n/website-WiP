import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('profileImage') profileImage!: ElementRef;

  //start and find center of picture , from where it follows mouse
  onMouseMove(event: MouseEvent) {
    if (!this.profileImage) return;

    const rect = this.profileImage.nativeElement.getBoundingClientRect();
    const imageCenterX = rect.left + rect.width / 2;
    const imageCenterY = rect.top + rect.height / 2;

    // Calculate angle between mouse position and image
    const deltaX = event.clientX - imageCenterX;
    const deltaY = event.clientY - imageCenterY;

    // Increase the angle to intensify the effect
    const angleX = (deltaY / rect.height) * 45; // tilt strength
    const angleY = (deltaX / rect.width) * -45;

    //  zoom and rotation X,Y
    this.profileImage.nativeElement.style.transform = `scale(1.1) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
  }

 // reset
  onMouseLeave()   {
    if (this.profileImage) {
      this.profileImage.nativeElement.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
  }

  // Create a bot "safe" mail link via obfuscation
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





