import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/global-constant';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'status'];
  ds: any;
  responseMessage: any;
  constructor(private userService: UserService,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
    ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.userService.getUsers().subscribe((res: any) => {
      this.ngxService.stop();
      console.log("res: ", res);
      this.ds = new MatTableDataSource(res);
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ds.filter = filterValue.trim().toLowerCase();
  }

  onChange(status: any, id: any) {
    this.ngxService.start();
    var data = {
      status: status.toString(),
      id: id,
    }
    const response = this.userService.updateUser(data).subscribe((res: any) => {
      console.log("updateUser res: ", res);
      this.ngxService.stop();
      this.responseMessage = res?.message;
      this.snackBarService.openSnackBar(this.responseMessage, 'success');
    }, (error: any) => {
      this.ngxService.stop();
      console.log(error); 
    })
    console.log("response : ", response);
    this.responseMessage = "User status updated successfully..";
    this.snackBarService.openSnackBar(this.responseMessage, 'success');
  }

}
