/*=========================
Name: Brittany Dockter
Date: March 20, 2020
Assignment: auth.guards.ts  
Description: building auth guard
==========================*/

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const sessionUser = this.cookieService.get('session_user');

    // If the cookie is present, allow the user to access the app
    if(sessionUser) {
      return true;
    }
    else {
    // Otherwise, the user is not signed into the system and should be redirected to the sign-in component.
      this.router.navigate(['/session/login']);
      return false;
    }
  }
}