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
  displayElement: boolean = false;

  // user: User | null = null;

  user: any = {};

  @Input() userData = {
    Name: this.user.Name,
    Username: this.user.Username,
    Email: this.user.Email,
    Password: '',
    Birthday: this.user.Birthday,
  };

  // date = new Intl.DateTimeFormat('en-US', {
  //   dateStyle: 'full',
  // }).format(new Date(this.user.Birthday.dateTime));

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

  openProfileEditPage(): void {
    this.dialog.open(ProfileEditPageComponent, {
      width: '280px',
    });
  }

  getFavs(): void {
    let movies: any[] = [];
    this.fetchApiData.getAllMovies(this.token).subscribe((res: any) => {
      movies = res;
      movies.forEach((movie: any) => {
        if (this.user.FavouriteMovies.includes(movie._id)) {
          this.favMovies.push(movie);
          this.displayElement = true;
        }
      });
    });
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
