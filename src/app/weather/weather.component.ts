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
