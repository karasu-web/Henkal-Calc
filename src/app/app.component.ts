import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import * as translations from '../assets/pl.json';
import * as productImages from '../assets/PI.json';

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
    name?: string,
    images: string[],
    result?: string,
    size1?: string,
    unit1?: string,
    size2?: string,
    unit2?: string,
    name2?: string,
    images2?: string[],
    result2?: string,
    size3?: string,
    unit3?: string,
    size4?: string,
    unit4?: string,
    name3?: string,
    images3?: string[],
    result3?: string,
    size5?: string,
    unit5?: string,
    size6?: string,
    unit6?: string,
    isValid: boolean,
    message?: string,
    text?: string
  } = { images: [], images2: [], images3: [], isValid: true };

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

  // Constants
  density: number = 1.8;

  // This method updates the slider value
  updateValue(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.sliderValue = parseInt(inputElement.value, 10);
  }

  isCalculating: boolean = false;
  isResultDisplayed: boolean = false;
  result: number = 0;

  // This method is triggered when the Calculate button is pressed
  toggleCalculate() {
    this.isCalculating = true;
    this.calculateResult();  // Perform the calculation first
    this.updateSelection(this.selectedarea, this.selectedtile); // Update imageData after the calculation
    this.isResultDisplayed = true; // Show the right div when the calculation is performed
    this.prevSelectedTile = this.selectedtile; // Save the previously selected tile for display
  }

  // This method calculates the result based on the provided formula
  calculateResult() {
    const LG = (100 / this.tileHeight + 100 / this.tileWidth) * 100;
    const rawResult = this.density * ((this.tileJoint * this.tileThickness * this.sliderValue * LG) * 0.001) / 100;
    this.result = parseFloat(rawResult.toFixed(2));
  }

  // This method fetches image URLs for a given area and tile type
  getImageUrls(area: string, tile: string): any {
    const areaData = this.productImages[area];
    if (areaData && areaData[tile]) {
        const tileData = areaData[tile];
        if (tileData && Object.keys(tileData).length > 0 && typeof tileData === 'object' && !Array.isArray(tileData)) {
            let result: any = {
                name: tileData.name,
                images: tileData.images1 || [],
                size1: tileData.sizevalue,
                unit1: tileData.unitvalue,
                size2: tileData.size2value,
                unit2: tileData.unit2value,
                result: tileData.result,
                text: tileData.text,
                isValid: true
            };

            // Extend result with second set of data if available
            if (tileData.name2) {
                result = { ...result,
                    name2: tileData.name2,
                    images2: tileData.images2 || [],
                    size3: tileData.sizevalue3,
                    unit3: tileData.unitvalue3,
                    size4: tileData.size4value,
                    unit4: tileData.unit4value,
                    result2: tileData.result2,
                    text: tileData.text
                };
            }

            return result;
        } else {
            return { message: 'Nie zalecamy żadnego produktu do tego zastosowania', isValid: false };
        }
    } else {
        // Check if the category itself exists but has no products
        if (areaData && !(tile in areaData)) {
            return { message: 'No products suggested for this category', isValid: false };
        }
        // Default fallback if no data is available for the area or tile
        return { images: ['path/to/default_image.jpg'], isValid: true };
    }
}


  // This method translates tile types
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
}
