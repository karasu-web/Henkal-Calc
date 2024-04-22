import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatSliderModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'my-calc';
  selectedarea: string = '';
  selectedtile: string = '';
  prevSelectedTile: string = '';
  tileWidth: number = 50;
  tileHeight: number = 50;
  tileThickness: number = 1;
  tileJoint: number = 3;
  sliderValue: number = 10;
  isLeftDivVisible: boolean = true;

  // Constants
  density: number = 1.8;


  constructor(private elementRef: ElementRef) {}

  updateValue(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.sliderValue = parseInt(inputElement.value, 10);
  }
  isCalculating: boolean = false;
  isResultDisplayed: boolean = false;
  result: number = 0;

  toggleCalculate() {
    this.isCalculating = true;
    this.isResultDisplayed = true; // Show the right div when the calculation is performed
    this.calculateResult();
    this.prevSelectedTile = this.selectedtile;
    this.toggleLeftDivForMobile(); 
     
  }

  isMobileScreen(): boolean {
    return window.innerWidth <= 768; // Adjust the screen width breakpoint as needed
  }

  calculateResult() {
    // Calculate LG
    const LG = (100 / this.tileHeight + 100 / this.tileWidth) * 100;

    // Calculate the result based on the formula
    const rawResult = this.density * ((this.tileJoint * this.tileThickness * this.sliderValue * LG) * 0.001) / 100;

    this.result = parseFloat(rawResult.toFixed(2));
  }

  toggleLeftDivForMobile() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) { // Adjust the screen width breakpoint as needed
      const leftDiv = this.elementRef.nativeElement.querySelector('.left');
      leftDiv.style.display = 'none';
    }
  }

  

  toggleLeftAndRightDivs() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) { // Only execute for mobile screens
      this.isResultDisplayed = false; // Hide the right div
      this.toggleLeftDivForMobile(); // Toggle the left div visibility
      this.isLeftDivVisible = !this.isLeftDivVisible; // Toggle the value of isLeftDivVisible
    }
  }
}
