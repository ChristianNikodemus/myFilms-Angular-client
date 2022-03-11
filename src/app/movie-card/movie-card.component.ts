import { Component, OnInit } from '@angular/core';
import { FetchApiDataService, Movie } from '../fetch-api-data.service';
import { MovieDescriptionComponent } from '../movie-description/movie-description.component';
import { MatDialog } from '@angular/material/dialog';

type DisplayMovie = Omit<Movie, 'Director' | 'Genre'> & {
  Director: string;
  Genre: string;
};

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent implements OnInit {
  token = localStorage.getItem('token');

  movies: Array<DisplayMovie> = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  openMovieDescriptionDialog(): void {
    this.dialog.open(MovieDescriptionComponent, {
      width: '280px',
    });
  }

  getMovies(): void {
    this.token &&
      this.fetchApiData.getAllMovies(this.token).subscribe((resp: any) => {
        this.movies = resp.map((m: Movie) => {
          return Object.assign({}, m, {
            Director: m.Director.map((d) => d.Name).join(', '),
            Genre: m.Genre.map((g) => g.Title).join(', '),
          });
        });
      });
  }
}
