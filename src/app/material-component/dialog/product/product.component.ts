import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CategoryComponent } from '../category/category.component';
import { ProductService } from 'src/app/shared/services/product.service';
import { GlobalConstants } from 'src/app/shared/global-constant';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  onAddProduct = new EventEmitter();
  onEditProduct = new EventEmitter();
  productForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;
  categories: any;
  productType:any = ['Large','Medium','Small'];

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private snackBarService: SnackbarService,
    public matDialogRef: MatDialogRef<ProductComponent>,
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      productDescription: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      type: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      price: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
       this.action = "Update";
      // console.log("this.dialogData.data : ",this.dialogData.data);
      // this.dialogData.data.category = this.dialogData.data.category.name;
      // console.log("this.dialogData.data : :",this.dialogData.data.category);
      this.productForm.patchValue(this.dialogData.data);
    }
    this.getCategory();
  }

  getCategory() {
    this.categoryService.categories().subscribe((res: any) => {
      this.categories = res;
    }, (error) => {
      console.log("Error : ", error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.productForm.value;
    var data = {
      name: formData.name,
      productDescription: formData.productDescription,
      price: formData.price,
      type: formData.type,
      categoryId: formData.categoryId,
    }
    console.log("Data : ", data);
    this.productService.add(data).subscribe((res: any) => {
      this.matDialogRef.close();
      this.onAddProduct.emit();
      this.responseMessage = res.message;
      this.snackBarService.openSnackBar(this.responseMessage, "success");
    }, (error) => {
      this.matDialogRef.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }


  edit() {
    var formData = this.productForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
      productDescription: formData.productDescription,
      price: formData.price,
      type: formData.type,
      categoryId: formData.categoryId,
    }
    console.log("Data : ", data);
    this.productService.update(data).subscribe((res: any) => {
      this.matDialogRef.close();
      this.onEditProduct.emit();
      this.responseMessage = res.message;
      this.snackBarService.openSnackBar(this.responseMessage, "success");
    }, (error) => {
      this.matDialogRef.close();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

  validateSubmit() {
    return true;
  }
}
