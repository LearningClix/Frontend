import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogClose, MatDialogConfig } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';
import { error } from 'console';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private router: Router,
    private userService: UserService,) { }




  openSignUpDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.panelClass = 'dialog';
    dialogConfig.disableClose = true;
    this.dialog.open(SignupComponent, dialogConfig);
  }

  openforgotPasswordDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.panelClass = 'dialog';
    dialogConfig.disableClose = true;
    this.dialog.open(ForgotPasswordComponent, dialogConfig);
  }

  openLoginDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.panelClass = 'dialog';
    dialogConfig.disableClose = true;
    this.dialog.open(LoginComponent, dialogConfig);
  }
  ngOnInit(): void {
    this.userService.checkToken().subscribe((res: any) => {
      this.router.navigate(['/api/user/check-token'])
    },(error:any)=>{
      console.log(error);
    }
    )}

}
