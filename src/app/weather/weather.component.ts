// import { Component } from '@angular/core';
// import { WeatherService } from '../weather.service';

// @Component({
//   selector: 'app-weather',
//   templateUrl: './weather.component.html',
//   styleUrls: ['./weather.component.css']
// })
// export class WeatherComponent {
//   city: string = '';
//   state: string = '';
//   country: string = '';
//   weatherData: any = null;
//   errorMessage: string = '';

//   constructor(private weatherService: WeatherService) {}

//   onSubmit(): void {
//     if (!this.city) {
//       this.errorMessage = 'City is required';
//       return;
//     }

//     this.errorMessage = '';  // Clear previous errors
//     this.weatherService.getWeather(this.city, this.state, this.country).subscribe(
//       (data) => {
//         this.weatherData = data;
//       },
//       (error) => {
//         this.errorMessage = 'Error fetching weather data';
//         console.error(error);
//       }
//     );
//   }
// }

import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  city: string = '';
  country: string = '';
  weatherReport: string = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.weatherService.getWeather(this.city, this.country).subscribe(
      (response) => {
        this.weatherReport = response; // Handle plain text response
      },
      (error) => {
        console.error('Error fetching weather data', error);
      }
    );
  }
}
