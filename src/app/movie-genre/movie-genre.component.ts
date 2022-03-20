import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Genre } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-genre',
  templateUrl: './movie-genre.component.html',
  styleUrls: ['./movie-genre.component.scss', '../app.component.scss'],
})
export class MovieGenreComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Title: string;
      Genre: Array<Genre>;
    }
  ) {}

  ngOnInit(): void {}
}
