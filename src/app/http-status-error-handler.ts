import { ErrorHandler, Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class HttpStatusErrorHandler implements ErrorHandler {

    constructor(private router: Router) { }

    handleError(error: any): void {
        console.trace();
        if (error.status === 401) {
            this.router.navigate(["/login"]);
        }
    }

}
