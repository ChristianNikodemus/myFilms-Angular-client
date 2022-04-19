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

  /**
   * Opens the MovieDescriptionComponent to display
   * the description of the movie
   * @param Title
   * @param Description
   */
  openMovieDescriptionDialog(Title: string, Description: string): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: { Title, Description },
      width: '50%',
    });
  }

  /**
   * Opens the MovieDirectorComponent to display
   * the information about the movies director(s)
   * @param Title
   * @param Director
   */
  openMovieDirectorDialog(Title: string, Director: Array<Director>): void {
    this.dialog.open(MovieDirectorComponent, {
      data: { Title, Director },
      width: '50%',
    });
  }

  /**
   * Opens the MovieGenreComponent to
   * display the information about the movies genre(s)
   * @param Title
   * @param Genre
   */
  openMovieGenreDialog(Title: string, Genre: Array<Genre>): void {
    this.dialog.open(MovieGenreComponent, {
      data: { Title, Genre },
      width: '50%',
    });
  }

  /**
   * Adds a movie to the users userData object
   * which stores their favourited movies
   * @param movieID
   */
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

  /**
   * Removes a movie from the users userData object
   * which stores their favourited movies
   * @param movieID
   */
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

  /**
   * Checks to see if each movie is apart of the users favourited movies
   * @param movieID
   * @returns Movies that are apart of the users favourited movies
   */
  isFavorite(movieID: string): boolean {
    if (this.user) {
      return this.user.FavouriteMovies.includes(movieID);
    } else return false;
  }

  /**
   * Retreives all movies from database
   * so it can be utulized for the favourited movies on the display
   * @return movie Objects to check
   */
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

  /**
   * Calls API endpoint to retrieve the Users information saved to the database
   */
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
