import { Component, OnInit, HostBinding } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  @HostBinding('class') class = 'welcome-page';

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {}

  /**
   * function that will open dialog when signup button is clicked
   * @module UserRegistrationFormComponent
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      // Sets the width of the dialog box
      width: '280px',
    });
  }

  /**
   * function that will open dialog when login button is clicked
   * @module UserLoginFormComponent
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      // Sets the width of the dialog box
      width: '280px',
    });
  }
}
