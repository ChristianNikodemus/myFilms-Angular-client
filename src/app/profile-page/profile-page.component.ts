import {
  FetchApiDataService,
  Movie,
  Genre,
  Director,
  User,
} from '../fetch-api-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss', '../app.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  username: any = localStorage.getItem('user');
  token: any = localStorage.getItem('token');
  userDetails: any = localStorage.getItem('userDetails');

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
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();
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

  editUser(): void {
    console.log(this.userData);
    this.fetchApiData
      .editUser(this.token, this.username, this.userData)
      .subscribe((resp) => {
        localStorage.setItem('user', resp.Username); // update profile in localstorage
        this.snackBar.open('Your profile was updated successfully!', 'OK', {
          duration: 4000,
        });
        setTimeout(() => {
          window.location.reload();
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
