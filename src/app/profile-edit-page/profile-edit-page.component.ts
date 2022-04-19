import {
  FetchApiDataService,
  Movie,
  Genre,
  Director,
  User,
} from '../fetch-api-data.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-edit-page',
  templateUrl: './profile-edit-page.component.html',
  styleUrls: ['./profile-edit-page.component.scss'],
})
export class ProfileEditPageComponent implements OnInit {
  username: any = localStorage.getItem('user');
  token: any = localStorage.getItem('token');
  userDetails: any = localStorage.getItem('userDetails');

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

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
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

  /**
   * Updates the new inputed values for the users userData object on the database
   */
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
}
