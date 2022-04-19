import {
  FetchApiDataService,
  Movie,
  Genre,
  Director,
  User,
} from '../fetch-api-data.service';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPageComponent } from '../profile-edit-page/profile-edit-page.component';

type DisplayMovie = Movie & {
  DirectorDisplay: string;
  GenreDisplay: string;
};

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss', '../app.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  username: any = localStorage.getItem('user');
  token: any = localStorage.getItem('token');
  userDetails: any = localStorage.getItem('userDetails');
  movies: Array<DisplayMovie> = [];
  favMovies: any[] = [];
  favs: any = null;
  displayElement: boolean = false;

  // user: User | null = null;

  user: any = {};

  /**
   * Inputs values stored in the userData object
   */
  @Input() userData = {
    Name: this.user.Name,
    Username: this.user.Username,
    Email: this.user.Email,
    Password: '',
    Birthday: this.user.Birthday,
  };

  /**
   * Takes users date of birth and formats it for display
   * @param u
   */
  factorizeUser = (u: User) => ({
    ...u,
    Birthday: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
    }).format(new Date(u.Birthday)),
  });

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getFavs();
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
          this.user = this.factorizeUser(resp);
        });
    }
  }

  /**
   * Opens dialog for user to input new values for userData
   * when the 'Edit Account Information' button is clicked
   */
  openProfileEditPage(): void {
    this.dialog.open(ProfileEditPageComponent, {
      width: '300px',
    });
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
   * Retrieves the movies that are apart of the users favourited movies
   */
  getFavs(): void {
    this.fetchApiData.getAllMovies(this.token).subscribe((res: any) => {
      this.movies = res;
      this.movies.forEach((movie: any) => {
        if (this.user.FavouriteMovies.includes(movie._id)) {
          this.favMovies.push(movie);
          this.displayElement = true;
        }
      });
    });
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
          this.user = this.factorizeUser(user);
          this.favMovies = this.movies.filter((movie) =>
            this.user.FavouriteMovies.includes(movie._id)
          );
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
   * Removes users account information from the database completely
   */
  deleteUser(): void {
    if (confirm('Are you sure? This cannot be undone.')) {
      this.fetchApiData.deleteUser(this.token, this.username).subscribe(() => {
        this.snackBar.open(`${this.username} has been removed!`, 'OK', {
          duration: 4000,
        });
        localStorage.clear();
      });
      this.router.navigate(['welcome']);
    }
  }
}
