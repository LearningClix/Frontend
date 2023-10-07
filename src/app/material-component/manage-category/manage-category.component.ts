import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/global-constant';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CategoryComponent } from '../dialog/category/category.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'edit'];
  ds: any;
  responseMessage: any;
  constructor(private categoryService: CategoryService,
    public dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.categoryService.categories().subscribe((res: any) => {
      console.log("res: ", res);
      const modifiedResponse = res.map((res1: any) => ({
        status: (res1.status === 1 ? true : false),
        createdDate: res1.createdDate,
        id: res1.id,
        name: res1.name,
      }));
      console.log("modifiedResponse", modifiedResponse);
      console.log("res: ", res);
      this.ngxService.stop();
      this.ds = new MatTableDataSource(modifiedResponse);
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

  handleAddCategory() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: "Add"
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((res) => {
      this.tableData();
    })
  }


  handleEditAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: "Edit",
      data: values
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditCategory.subscribe((res) => {
      this.tableData();
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: "delete " + values.name + " Category",
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      console.log("this.deleteCategory(values.id); : ", values.id)
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: any) {
    this.categoryService.delete(id).subscribe((res) => {
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = "Product Deleted Successfully..";
      this.snackBarService.openSnackBar(this.responseMessage, "success");
    }, (error) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }


  onChange(status: any, id: any) {
    this.ngxService.start();
    var data = {
      status: status,
      id: id,
    }
    this.categoryService.updateCategoryStatus(data).subscribe((res: any) => {
      this.ngxService.stop();
      this.responseMessage = res?.message;
      this.snackBarService.openSnackBar(this.responseMessage, 'success');
    }, (error: any) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }
}
