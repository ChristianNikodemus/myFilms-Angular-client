import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Director } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-director',
  templateUrl: './movie-director.component.html',
  styleUrls: ['./movie-director.component.scss', '../app.component.scss'],
})
export class MovieDirectorComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Title: string;
      Director: Array<Director>;
    }
  ) {}

  ngOnInit(): void {}
}
