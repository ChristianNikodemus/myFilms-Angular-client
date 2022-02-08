import { Component, OnInit } from '@angular/core';
import { FetchApiDataService, Movie } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  token = localStorage.getItem('token');

  // if(token) {
  //   this.fetchApiData.getAllMovies(token);
  // } else {
  //   return token = '';
  // }

  movies: Array<Omit<Movie, 'Director'> & { Director: string }> = [];
  constructor(public fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies(this.token).subscribe((resp: any) => {
      this.movies = resp.map((m: Movie) => {
        const n = { ...m };
        n.Director = m.Director.map((d) => d.Name).join(', ');
        return n;
      });
      console.log(this.movies);
      return this.movies;
    });
  }
}
