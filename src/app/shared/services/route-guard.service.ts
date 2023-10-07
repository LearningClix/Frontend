import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import jwtDecode from 'jwt-decode';
import { GlobalConstants } from '../global-constant';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(private router: Router,
    private authService: AuthService,
    private snackBarService: SnackbarService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean { 
    let expectedRoleArray = route.data;
    const token: any = localStorage.getItem('token')

    var tokenPayLoad: any;
    try {
      tokenPayLoad = jwtDecode(token);
    } catch (err) {
      localStorage.clear;
      this.router.navigate(['/']);
    }

    let expectedRole = '';

    console.log("expectedRoleArray.length: ", expectedRoleArray.length);
   // debugger;
    for (let i = 0; i < expectedRoleArray.length; i++){
      if(expectedRoleArray[i] == tokenPayLoad.role){
        expectedRole = tokenPayLoad.role;
      }
    }

    if  (tokenPayLoad.role == 'user' || tokenPayLoad.role == 'admin'){
      if (this.authService.isAuthenticated() && tokenPayLoad.role == expectedRole){
        return true;
      }
      this.snackBarService.openSnackBar(GlobalConstants.unauthorizedMessage, GlobalConstants.error);
      this.router.navigate(['api/cafe/dashboard'],{ replaceUrl: true });     
      return false;
    }
    
    this.router.navigate(['/']);
    localStorage.clear;
    return false;
  }
}
