import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ErrorService } from './error';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorService
  ) { }

  /**
   * @method Login
   * @param payload: {user: string, password: string}
   * @return Observable of Response
   */

  imageList(): Observable<any> {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');

    const body: HttpParams = new HttpParams();

    return this.http.get(`https://picsum.photos/v2/list`, { headers })
      .pipe(
        catchError(this.errorHandler.handleError)
      );
  }
}
