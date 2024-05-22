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
  imports: [RouterOutlet, CommonModule, FormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatSliderModule],
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
  
  imageData: { images: string[], isValid: boolean, message?: string } = { images: [], isValid: true };
  updateSelection(area: string, tile: string) {
    this.imageData = this.getImageUrls(area, tile);
  }

  // Constants
  density: number = 1.8;

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
  }

  calculateResult() {
    // Calculate LG
    const LG = (100 / this.tileHeight + 100 / this.tileWidth) * 100;

    // Calculate the result based on the formula
    const rawResult = this.density * ((this.tileJoint * this.tileThickness * this.sliderValue * LG) * 0.001) / 100;

    this.result = parseFloat(rawResult.toFixed(2));
  }

  getImageUrls(area: string, tile: string): any {
    const areaData = this.productImages[area];
    if (areaData && areaData[tile]) {
      if (Array.isArray(areaData[tile])) {
        return { images: areaData[tile], isValid: true }; // Return valid image URLs
      } else {
        // Return a message when invalid
        return { message: areaData[tile], isValid: false };
      }
    } else {
      // Return a default image URL or handle the case where the combination doesn't exist
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
      default: return tileTypeEnglish; // Default to English if no translation found
    }
  }
}
