import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/global-constant';
import { BillService } from 'src/app/shared/services/bill.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'billTotal', 'action'];
  ds: any = [];  
  responseMessage: any;

  constructor(
    private billService: BillService,
    private dialog:MatDialog,
    private router:Router,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData() {
    this.billService.getBills().subscribe((res:any)=>{
      this.ngxService.stop();
      this.ds = new MatTableDataSource(res);
      console.log("this.ds : " , this.ds);
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.ds.filter = filterValue.trim().toLowerCase();
  }

  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      data: values
    };
    dialogConfig.width = "100%";
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });    
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: "dalate " + values.name + "'s bill",
      confirmation:true,
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res:any) => {
      this.ngxService.start();
      this.deleteBill(values.id);
      dialogRef.close();
    })
  }

  deleteBill(id:any) {
    this.billService.deleteBill(id).subscribe((res:any) => {
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = res?.message;
      this.snackBarService.openSnackBar(this.responseMessage, "success");
    }, (error:any) => { 
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

  downloadReportAction(values:any){
    this.ngxService.start();
    var data={
      name: values.name,
      email:values.email,
      uuid:values.uuid,
      contactNumber:values.contactNumber,
      paymentMethod:values.paymentMethod,
      totalAmount:values.totalAmount,
      productDetails:values.productDetails,
    }
    this.downloadFile(values.uuid,data);
  }

  downloadFile(fileName:string, data:any){
    this.billService.getPDF(data).subscribe((res:any)=>{
      saveAs(res, fileName + '.pdf');
      this.ngxService.stop();
    })
  }
}
