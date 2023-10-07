import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/global-constant';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ProductComponent } from '../dialog/product/product.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { error } from 'console';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'productDescription', 'type', 'price', 'edit'];
  ds: any;
  // length1:any;
  responseMessage: any;

  constructor(private productService: ProductService,
    public dialog: MatDialog,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // debugger;
    this.ngxService.start();
    this.tableData();
  }


 

  tableData() {
    this.productService.getProduct().subscribe((res: any) => {
      // debugger;
      console.log("res: ", res);
      const modifiedResponse = res.map((res1:any) => ({
        status: (res1.status === 1 ? true : false),
        category:res1.category,
        createdDate:res1.createdDate,
        id:res1.id,
        name:res1.name,
        price:res1.price,
        productDescription:res1.productDescription,
        type:res1.type,
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

  handleAddProduct() {
    console.log("handleAddProduct");
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: "Add"
    };
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddProduct.subscribe((res) => {
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
    const dialogRef = this.dialog.open(ProductComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((res) => {
      this.tableData();
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: "delete " + values.name + " Product",
      confirmation: true,
    };
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      console.log("this.deleteProduct(values.id); : ", values.id)
      this.deleteProduct(values.id);
      dialogRef.close();
    })
  }

  deleteProduct(id: any) {
    this.productService.delete(id).subscribe((res) => {
      this.responseMessage = "Product Deleted Successfully..";
      this.ngxService.stop();
      this.tableData();
      console.log("Delete Product message :",this.responseMessage);      
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
    var data={
      status: status,
      id:id,
    }
    this.productService.updateProductStatus(data).subscribe((res:any)=>{
      this.ngxService.stop();
      this.responseMessage = res?.message;
      this.snackBarService.openSnackBar(this.responseMessage, 'success');
    },(error:any)=>{
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
