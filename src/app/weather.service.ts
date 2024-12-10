import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  // private apiUrl = 'http://localhost:3000/weather';  // Your backend API URL
  // Backend in a container 
  // private apiUrl = 'http://weather-app-backend:3000/weather';  // Your backend API URL
  private apiUrl = 'https://weather-app-backend.azurewebsites.net/weather';  // Prod

  constructor(private http: HttpClient) {}

  getWeather(city: string, state?: string, country?: string, limit: number = 5): Observable<any> {
    let params = new HttpParams().set('city', city).set('limit', limit.toString());
    
    if (state) {
      params = params.set('state', state);
    }
    if (country) {
      params = params.set('country', country);
    }
    
    return this.http.get<any>(this.apiUrl, { params , responseType:"text"as"json" });
  }
}
