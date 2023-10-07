import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/global-constant';
import { BillService } from 'src/app/shared/services/bill.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  PaymentMethod: string[] = ['Cash', 'Credit Card', 'Cash on Delivery', 'Debit Card'];
  ds: any = [];
  manageOrderForm: any = FormGroup;
  categorys: any;
  products: any;
  price: any;
  totalAmount: number = 0;
  grandTotalAmount: number = 0;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
    private snackBarService: SnackbarService,
  ) { }


  ngOnInit(): void {
    this.ngxService.start();
    this.Categorys();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null, [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]],
    })
  }

  Categorys() {
    this.categoryService.getFilterCategories().subscribe((res) => {
      this.ngxService.stop();
      this.categorys = res;
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

  getProductByCategory(id: number) {
    console.log("inside getProductByCategory id:", id)
    this.productService.getProductByCategory(id).subscribe((res) => {
      this.products = res;
      //debugger;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
      this.totalAmount = 0;
    }, (error) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  getProductDetails(id: number) {
    console.log("inside getProductDetails id:", id)
    this.productService.getProductById(id).subscribe((res: any) => {
      this.price = res.price;
      this.manageOrderForm.controls['price'].setValue(res.price);
      this.manageOrderForm.controls['quantity'].setValue(1);
      this.manageOrderForm.controls['total'].setValue(this.price * 1);
      this.totalAmount = this.price * 1;
    }, (error) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  setQuantity(values: any) {
    this.totalAmount = (this.manageOrderForm.controls['quantity'].value *
      this.manageOrderForm.controls['price'].value);
    var temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value *
        this.manageOrderForm.controls['price'].value);
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue(1);
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value *
        this.manageOrderForm.controls['price'].value);
    }
  }

  validateProductAdd() {
    if (this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === ''
      || this.manageOrderForm.controls['quantity'].value <= 0) {
      return true;
    } else {
      return false;
    }
  }

  validateSubmit() {
    if (this.totalAmount === 0 || this.manageOrderForm.controls['name'].value === null ||
      this.manageOrderForm.controls['email'].value === null || this.manageOrderForm.controls['contactNumber'].value === null
      || this.manageOrderForm.controls['paymentMethod'].value === null) {
      return true;
    }
    else {
      return false;
    }
  }

  add() {
    this.ds = this.ds;
    var formData = this.manageOrderForm.value;
    console.log("formData.product.id : ", formData.product.id);
    console.log("this.ds : ", this.ds);
    try {
      var productName = this.ds.find((e: { id: number }) => e.id === formData.product.id);
    } catch {
      productName = undefined;
    }
    console.log("productName : ", productName);
    if (productName === undefined) {
      //this.totalAmount = this.totalAmount + formData.total;

      console.log("formData : ", formData.product.name + ' ' + formData.category.name + ' ' +
        formData.quantity + ' ' + formData.price + ' ' + formData.total);
      try {
        this.ds.push({
          id: formData.product.id, name: formData.product.name, category: formData.category.name,
          quantity: formData.quantity, price: formData.price, total: formData.total
        });
      } catch {
        this.ds.push({
          id: formData.product.id, name: formData.product.name, category: formData.category.name,
          quantity: formData.quantity, price: formData.price, total: formData.total
        });
      }
      this.ds = [...this.ds];
      this.grandTotalAmount = this.grandTotalAmount + formData.total;
      this.snackBarService.openSnackBar(GlobalConstants.productAdded, 'success');
    }
    else {
      this.snackBarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  handleDeleteAction(value: any, element: any) {
    this.totalAmount = this.totalAmount - element.total;
    this.ds.splice(value, 1);
    this.ds = [...this.ds];
  }

  submitAction() {
    var formData = this.manageOrderForm.value;
    var data = {
      fileName:"FileName_" + formData.name + "_" + this.grandTotalAmount ,
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      billTotal: this.grandTotalAmount,
      productDetails: JSON.stringify(this.ds),
    }
    this.ngxService.start();
    this.billService.generateReport(data).subscribe((res: any) => {
      console.log("generateReport(data) : ", res)
      this.downloadFile(res?.uuid);
      this.manageOrderForm.reset();
      this.ds = [];
      this.totalAmount = 0;
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

  downloadFile(fileName: string) {
    var data = {
      uuid: fileName,
    }
    this.billService.getPDF(data).subscribe((res: any) => {
      saveAs(res, fileName + '.pdf');
      this.grandTotalAmount = 0;
      this.ngxService.stop();
    })
  }


}
