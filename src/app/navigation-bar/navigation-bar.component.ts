import { Component, OnInit } from '@angular/core';
import { FetchApiDataService, User } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  username: any = localStorage.getItem('user');
  token: any = localStorage.getItem('token');

  user: User | null = null;

  constructor(
    public fetchApiData: FetchApiDataService,
    private router: Router
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

  goToProfile(): void {
    this.router.navigate(['profile']);
  }

  goToMovies(): void {
    this.router.navigate(['movies']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
