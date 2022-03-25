import { Component, Inject, OnInit } from '@angular/core';
import { FetchApiDataService, User } from '../fetch-api-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToProfile(): void {
    this.router.navigate(['movies']);
  }
}
