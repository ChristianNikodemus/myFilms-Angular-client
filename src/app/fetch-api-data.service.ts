import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://my-films-db.herokuapp.com/';

const factorizeOptions = (token: string) => ({
  headers: new HttpHeaders({
    Authorization: 'Bearer ' + token,
  }),
});

export interface Movie {
  _id: string;
  Title: string;
  Description: string;
  Year: string;
  Genre: Array<Genre>;
  Director: Array<Director>;
  ImagePath: string;
  Featured: boolean;
}

export interface Genre {
  Title: string;
  Description: string;
}

export interface Director {
  Name: string;
  Bio: string;
  Birthyear: string;
  Deathyear: string;
}

export interface User {
  _id: string;
  Name: string;
  Username: string;
  Email: string;
  Password: string;
  Birthday: string;
  FavouriteMovies: Array<string>;
}

export type RegistrationUser = Omit<User, '_id' | 'FavouriteMovies'>;

export type LoginUser = { Username: string; Password: string };

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  constructor(private http: HttpClient) {}

  // --------------- Endpoints --------------------

  // User registration
  public userRegistration(userDetails: RegistrationUser): Observable<User> {
    console.log(userDetails);
    return this.http
      .post<User>(apiUrl + 'users', userDetails)
      .pipe(
        catchError(
          (error: HttpErrorResponse): Observable<never> =>
            throwError(error.error)
        )
      );
  }

  // User login
  public userLogin(
    userDetails: LoginUser
  ): Observable<{ user: User; token: string }> {
    console.log(userDetails);
    return this.http
      .post<{ user: User; token: string }>(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  // Get all movies
  getAllMovies(token: string): Observable<Array<Movie>> {
    return this.http
      .get<Array<Movie>>(apiUrl + 'movies', factorizeOptions(token))
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get one movie
  getMovie(title: string, token: string): Observable<Movie> {
    return this.http
      .get<Movie>(apiUrl + `movies/:title`, factorizeOptions(token))
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get director
  getDirector(name: string, token: string): Observable<Director> {
    return this.http
      .get<Director>(apiUrl + `directors/:director`, factorizeOptions(token))
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get genre
  getGenre(title: string, token: string): Observable<Genre> {
    return this.http
      .get<Genre>(apiUrl + `genres/:name`, factorizeOptions(token))
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get user
  getUser(username: string, token: string): Observable<User> {
    return this.http
      .get<User>(apiUrl + `users/${username}`, factorizeOptions(token))
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Get favourite movies for a user
  getFavoriteMovies(username: string, token: string): Observable<User> {
    return this.http
      .get<User>(apiUrl + `users/${username}/movies`, factorizeOptions(token))
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Add a movie to favourite Movies
  addMovie(username: string, token: string, movieId: string): Observable<User> {
    console.log(apiUrl + `users/${username}/movies/${movieId}`);
    return this.http
      .post<User>(
        apiUrl + `users/${username}/movies/${movieId}`,
        {},
        factorizeOptions(token)
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Edit user
  editUser(
    token: string,
    username: string,
    userDetails: RegistrationUser
  ): Observable<User> {
    return this.http
      .put<User>(
        apiUrl + `users/${username}`,
        userDetails,
        factorizeOptions(token)
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // Delete user
  deleteUser(token: string, username: string): Observable<null> {
    return this.http
      .delete<null>(apiUrl + `users/${username}`, factorizeOptions(token))
      .pipe(catchError(this.handleError));
  }

  // Remove a movie from the favourite movies
  removeMovie(
    username: string,
    token: string,
    movieid: string
  ): Observable<User> {
    return this.http
      .delete<User>(
        apiUrl + `users/${username}/movies/${movieid}`,
        factorizeOptions(token)
      )
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  // --------------- Endpoints --------------------

  // Non-typed response extraction
  private extractResponseData(res: Response | Object): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
