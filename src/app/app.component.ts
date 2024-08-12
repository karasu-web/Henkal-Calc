import { Component, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
// import * as translations from '../assets/pl.json';
// import * as translations from '../assets/sr.json';
// import * as translations from '../assets/ro.json';

// import * as translations from '../assets/cz.json';
// import * as translations from '../assets/sk.json';
// import * as translations from '../assets/bg.json';
// import * as translations from '../assets/hr.json';
import * as translations from '../assets/at.json';
// import * as translations from '../assets/ba.json'; 
// import * as translations from '../assets/lt.json';
// import * as translations from '../assets/lv.json';
// import * as translations from '../assets/et.json';
// import * as translations from '../assets/si.json';
// import * as translations from '../assets/hu.json';
// import * as translations from '../assets/mn.json';
// import * as translations from '../assets/global.json';

// import * as productImages from '../assets/PI.json';
// import * as productImages from '../assets/SR_product.json';
// import * as productImages from '../assets/RO_product.json';
// import * as productImages from '../assets/CZ_product.json';
// import * as productImages from '../assets/SK_product.json';
// import * as productImages from '../assets/BG_product.json';
// import * as productImages from '../assets/HR_product.json';
import * as productImages from '../assets/AT_product.json';
// import * as productImages from '../assets/BA_product.json';
// import * as productImages from '../assets/LT_product.json';
// import * as productImages from '../assets/LV_product.json';
// import * as productImages from '../assets/ET_product.json';
// import * as productImages from '../assets/SI_product.json';
// import * as productImages from '../assets/HU_product.json';
// import * as productImages from '../assets/MN_product.json';
// import * as productImages from '../assets/GLOBAL_product.json';

import html2canvas from 'html2canvas';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSliderModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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

  translations = translations;
  productImages: any = productImages;

  // Expanded imageData type with properties for three tile sets
  imageData: {
    name?: string;
    images: string[];
    imageLink?: string;
    result?: string;
    
    size1?: string;
    unit1?: string;
    
    size2?: string;
    unit2?: string;
    
    name2?: string;
    images2?: string[];
    imageLink2?: string;
    result2?: string;
    size3?: string; // This should remain as it refers to the 25kg, ensure no overwrites
    unit3?: string;
    
    size4?: string;
    unit4?: string;
    size5?: string;
    unit5?: string;
    
    name3?: string;
    images3?: string[];
    imageLink3?: string;
    result3?: string;
    size6?: string;
    unit6?: string;
    size7?: string; 
    unit7?: string; 
    size8?: string; 
    unit8?: string;
    size9?: string; 
    unit9?: string;
    
    isValid: boolean;
    message?: string;
  } = { images: [], images2: [], images3: [], isValid: true };

  // Constants
  density1: number = 1.8;
  density2: number = 1.55;

  isCalculating: boolean = false;
  isResultDisplayed: boolean = false;
  isLeftDivVisible: boolean = true; // Track visibility of the left div
  result1: number = 0; // Result using density1
  result2: number = 0; // Result using density2

  constructor(private elementRef: ElementRef) {}

  // This method fetches image URLs and updates imageData accordingly
  updateSelection(area: string, tile: string) {
    const data = this.getImageUrls(area, tile);
    if (data.isValid) {
      this.imageData = data;  // Directly assign the returned data if it's valid
    } else {
      this.imageData = { ...this.imageData, isValid: false, message: data.message || 'Unknown error' };
      // Optionally update with an error message if not valid
    }
  }

  // This method updates the slider value
  updateValue(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.sliderValue = parseInt(inputElement.value, 10);
  }

  // This method is triggered when the Calculate button is pressed
  toggleCalculate() {
    this.isCalculating = true;
    // this.calculateResult();  // Perform the calculation first
    this.updateSelection(this.selectedarea, this.selectedtile); // Update imageData after the calculation
    this.isResultDisplayed = true; // Show the right div when the calculation is performed
    this.prevSelectedTile = this.selectedtile; // Save the previously selected tile for display
    this.calculateResultDensity1();  // Using density1
    this.calculateResultDensity2();  // Using density2
    
    const screenWidth = window.innerWidth;
    if (screenWidth <= 768) { // Only execute for mobile screens
      this.isLeftDivVisible = false; // Hide the left div
      this.toggleLeftDivForMobile();
    }
  }

  // This method calculates the result based on the provided formula
  calculateResultDensity1() {
    const LG = (100 / this.tileHeight + 100 / this.tileWidth) * 100;
    const rawResult = this.density1 * ((this.tileJoint * this.tileThickness * this.sliderValue * LG) * 0.001) / 100;
    this.result1 = parseFloat(rawResult.toFixed(2));
  }

  calculateResultDensity2() {
    const LG = (100 / this.tileHeight + 100 / this.tileWidth) * 100;
    const rawResult = this.density2 * ((this.tileJoint * this.tileThickness * this.sliderValue * LG) * 0.001) / 100;
    this.result2 = parseFloat(rawResult.toFixed(2));
  }

  // This method fetches image URLs for a given area and tile type
  getImageUrls(area: string, tile: string): any {
    const areaData = this.productImages[area];
    const translatedTile = this.getTranslatedTile(tile);
    if (areaData && areaData[tile]) {
      const tileData = areaData[tile];
      if (tileData && Object.keys(tileData).length > 0 && typeof tileData === 'object' && !Array.isArray(tileData)) {
        let result: any = {
          name: tileData.name,
          images: tileData.images1 || [],
          imageLink: tileData.imageLink1 || '',
          size1: tileData.size1,   // Original sizevalue
          unit1: tileData.unit1,   // Original unitvalue
          size2: tileData.size2,  // Size 2kg from JSON
          unit2: tileData.unit2,  // Unit for size 2
          size3: tileData.size3,  // Size 25kg from JSON
          unit3: tileData.unit3,  // Unit for size 25
          result: tileData.result,
  
          isValid: true
        };

        // Extend result with second set of data if available
        if (tileData.name2) {
          result = { ...result,
            name2: tileData.name2,
            images2: tileData.images2 || [],
            imageLink2: tileData.imageLink2 || '',
            size4: tileData.size4,
            unit4: tileData.unit4,
            size5: tileData.size5,
            unit5: tileData.unit5,
            size6: tileData.size6,
            unit6: tileData.unit6,
            result2: tileData.result2
          };
        }
        if (tileData.name3) {
          result = { ...result,
            name3: tileData.name3,
            images3: tileData.images3 || [],
            imageLink3: tileData.imageLink3 || '',
            size7: tileData.size7,
            unit7: tileData.unit7,
            size8: tileData.size8,
            unit8: tileData.unit8,
            size9: tileData.size9,
            unit9: tileData.unit9,
            result3: tileData.result3
          };
        }

        return result;
      } else {
        // return { message: 'Nie zalecamy żadnego produktu do tego zastosowania', isValid: false };
        return { message: `Für diese Anwendung ist "${translatedTile}" nicht empfohlen`, isValid: false };
      }
    } else {
      // Check if the category itself exists but has no products
      if (areaData && !(tile in areaData)) {
        // return { message: 'No products suggested for this category', isValid: false };
        return { message: `Für diese Anwendung ist "${translatedTile}" nicht empfohlen`, isValid: false };
      }
      // Default fallback if no data is available for the area or tile
      return { images: ['path/to/default_image.jpg'], isValid: true };
    }
  }

  
  getTranslatedTile(tileTypeEnglish: string): string {
    switch (tileTypeEnglish) {
      case 'Gres': return this.translations.GRES;
      case 'Porcelain': return this.translations.PORCELAIN;
      case 'Earthenware': return this.translations.EARTHENWARE;
      case 'Stoneware': return this.translations.STONEWARE;
      case 'Natural stone': return this.translations.NATURAL_STONE;
      case 'Glass mosaics': return this.translations.GLASS_MOSAICS;
      case 'Mosaic': return this.translations.MOSAIC;
      default: return tileTypeEnglish;
    }
  }

  // Method to check if the screen is a mobile screen
  isMobileScreen(): boolean {
    return window.innerWidth <= 768;
  }

  // This method toggles the visibility of the left div on mobile screens
  toggleLeftDivForMobile() {
    const leftDiv = this.elementRef.nativeElement.querySelector('.left');
    if (this.isLeftDivVisible) {
      leftDiv.style.display = 'block'; // Show the left div if isLeftDivVisible is true
    } else {
      leftDiv.style.display = 'none'; // Hide the left div if isLeftDivVisible is false
    }
  }

  // This method toggles the visibility of the left and right divs on mobile screens
  toggleLeftAndRightDivs() {
    if (this.isMobileScreen()) {
      this.isLeftDivVisible = true; // Ensure the left div is visible
      this.isResultDisplayed = false; // Hide the right div
      this.toggleLeftDivForMobile(); // Toggle the left div visibility
    }
  }

  captureScreen() {
    if (document.body) { // Check if document.body is not null
      html2canvas(document.body).then(canvas => {
        const imageDataUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = imageDataUrl;
        downloadLink.download = 'captured-screenshot.png';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      });
    } else {
      console.error("Document body is not available");
    }
  }

  calculateUnits(result: number, size?: string): number {
    if (!size) {
      console.error('Size is undefined or invalid');
      return 0;  // or handle as appropriate, maybe return 1 depending on your business logic
    }
  
    const sizeNumber = parseFloat(size.replace('kg', ''));
    if (result <= sizeNumber) {
      return 1;
    }
    return Math.ceil(result / sizeNumber);
  }
  
  
}
