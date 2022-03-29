import { Component, OnInit } from '@angular/core';
import {
  FetchApiDataService,
  Movie,
  Genre,
  Director,
  User,
} from '../fetch-api-data.service';
import { MovieDescriptionComponent } from '../movie-description/movie-description.component';
import { MovieDirectorComponent } from '../movie-director/movie-director.component';
import { MovieGenreComponent } from '../movie-genre/movie-genre.component';
import { MatDialog } from '@angular/material/dialog';

type DisplayMovie = Movie & {
  DirectorDisplay: string;
  GenreDisplay: string;
};

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss', '../app.component.scss'],
})
export class MovieCardComponent implements OnInit {
  username = localStorage.getItem('user');
  token = localStorage.getItem('token');

  movies: Array<DisplayMovie> = [];
  user: User | null = null;
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getUser();
  }

  openMovieDescriptionDialog(Title: string, Description: string): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: { Title, Description },
      width: '50%',
    });
  }

  openMovieDirectorDialog(Title: string, Director: Array<Director>): void {
    this.dialog.open(MovieDirectorComponent, {
      data: { Title, Director },
      width: '50%',
    });
  }

  openMovieGenreDialog(Title: string, Genre: Array<Genre>): void {
    this.dialog.open(MovieGenreComponent, {
      data: { Title, Genre },
      width: '50%',
    });
  }

  addFavorite(movieID: string): void {
    if (this.username && this.token) {
      this.fetchApiData
        .addMovie(this.username, this.token, movieID)
        .subscribe((user) => {
          console.log('-->', user);
          this.user = user;
        });
    }
  }

  removeFavorite(movieID: string): void {
    if (this.username && this.token) {
      this.fetchApiData
        .removeMovie(this.username, this.token, movieID)
        .subscribe((user) => {
          console.log('-->', user);
          this.user = user;
        });
    }
  }

  isFavorite(movieID: string): boolean {
    if (this.user) {
      return this.user.FavouriteMovies.includes(movieID);
    } else return false;
  }

  getMovies(): void {
    this.token &&
      this.fetchApiData.getAllMovies(this.token).subscribe((resp: any) => {
        this.movies = resp.map((m: Movie) => {
          return Object.assign({}, m, {
            DirectorDisplay: m.Director.map((d) => d.Name).join(', '),
            GenreDisplay: m.Genre.map((g) => g.Title).join(', '),
          });
        });
      });
  }

  getUser(): void {
    console.log(this.token, this.username);
    if (this.token && this.username) {
      this.fetchApiData
        .getUser(this.username, this.token)
        .subscribe((resp: any) => {
          this.user = resp;
        });
    }
  }
}
