import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    message: string;
    constructor() { }
    handleError = (err: HttpErrorResponse) => {
        if (err.error instanceof ErrorEvent) {
            // client-side error
            this.message = `Client-side Error: ${err.error.message}`;
        } else {
            // server-side error
            switch (err.status) {
                case 0:
                    this.message = `No Internet!`;
                    break;
                case 422:
                    this.message = `${err.error.result.message}`;
                    break;
                case 500:
                    this.message = `Server Side Issue!`;
                    break;
                default:
                    this.message = `Server-side Error: ${err.status} : ${err.message}`;
                    break;
            }
        }
        return throwError(this.message);
    }
}