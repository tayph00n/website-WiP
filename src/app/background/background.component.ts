import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="metro-background">
      <div
        *ngFor="let square of squares; let i = index"
        class="metro-square"
        [style.background-color]="square.color"
        [style.transform]="square.canAnimate ? 'scale(' + square.scale + ')' : 'scale(1)'"
      ></div>
    </div>
  `,
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit, OnDestroy {
  squares: { color: string; scale: number; canAnimate: boolean }[] = [];
  private intervalId: any;
  private readonly GRID_SIZE = 40; // 40x40 grid
  private readonly COLORS = {
    BLUE: 'rgba(0, 120, 215, 0.0)',
    LIGHT_BLUE: 'rgba(0, 178, 240, 0.25)'    // Light blue
  };

  ngOnInit(): void {
    console.log('Background component initialized');
    // Initialize the grid
    this.initializeGrid();

    // Start the animation
    this.intervalId = setInterval(() => {
      this.animateRandomSquares();
    }, 500); // Animate some squares every 500ms
  }

  ngOnDestroy(): void {
    // Clean up the interval when component is destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private initializeGrid(): void {
    const totalSquares = this.GRID_SIZE * this.GRID_SIZE;
    console.log(`Creating ${totalSquares} squares`);

    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        // Create checkerboard pattern - alternate colors based on position
        // If row + col is even, use blue; if odd, use Light blue
        const isLightBlue = (row + col) % 2 === 1;
        const color = isLightBlue ? this.COLORS.LIGHT_BLUE : this.COLORS.BLUE;

        this.squares.push({
          color: color,
          scale: 1.0,
          canAnimate: isLightBlue // Only light blue squares can animate
        });
      }
    }
  }

  private animateRandomSquares(): void {
    // Get only the light blue squares that can animate
    const animatableSquares = this.squares.filter(square => square.canAnimate);

    // Number of squares to animate (between 10 and 30) - doubled to match grid size
    const numToAnimate = Math.floor(Math.random() * 21) + 10;

    for (let i = 0; i < numToAnimate; i++) {
      const randomIndex = Math.floor(Math.random() * animatableSquares.length);
      const randomScale = (Math.random() * 0.5) + 1; // Scale between 1.0 and 1.5

      // Find the actual index in the main squares array
      const actualSquare = animatableSquares[randomIndex];
      const mainIndex = this.squares.indexOf(actualSquare);

      if (mainIndex !== -1) {
        // Update the square's scale
        this.squares[mainIndex].scale = randomScale;

        // Reset the scale after a random delay (1-3 seconds)
        setTimeout(() => {
          if (this.squares[mainIndex]) {
            this.squares[mainIndex].scale = 1.0;
          }
        }, Math.random() * 2000 + 1000);
      }
    }
  }

}
