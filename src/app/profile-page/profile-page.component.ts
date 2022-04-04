import {
  FetchApiDataService,
  Movie,
  Genre,
  Director,
  User,
} from '../fetch-api-data.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss', '../app.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  username = localStorage.getItem('user');
  token = localStorage.getItem('token');

  user: User | null = null;

  // date = new Intl.DateTimeFormat('en-US', {
  //   dateStyle: 'full',
  // }).format(new Date(this.user.Birthday.dateTime));

  constructor(public fetchApiData: FetchApiDataService) {}

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
}
