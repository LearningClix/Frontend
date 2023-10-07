import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../shared/services/snackbar.service';
import { UserService } from '../shared/services/user.service';
import { GlobalConstants } from '../shared/global-constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  password = true;
  loginForm: any = FormGroup;
  responseMessage: any;
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackBarServer: SnackbarService,
    public matDialogRef: MatDialogRef<LoginComponent>,
    private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]],
    })
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.loginForm.value;
    var data = {
      email: formData.email,
      password: formData.password,
    }
    this.userService.login(data).subscribe((res: any) => {
      console.log("res: ", res);
      //debugger;
      this.ngxService.stop();
      this.matDialogRef.close();
      localStorage.setItem('token',res.token);
      this.router.navigate(['/api/cafe/dashboard']);
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarServer.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
