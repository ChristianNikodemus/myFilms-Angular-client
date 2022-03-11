import { FetchApiDataService, Movie } from '../fetch-api-data.service';
import { Component, OnInit } from '@angular/core';

type DisplayMovie = Omit<Movie, 'Director' | 'Genre'> & {
  Director: string;
  Genre: string;
};
@Component({
  selector: 'app-movie-description',
  templateUrl: './movie-description.component.html',
  styleUrls: ['./movie-description.component.scss'],
})
export class MovieDescriptionComponent implements OnInit {
  movies: Array<DisplayMovie> = [];
  constructor(public fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {}
}
