import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GlobalConstants } from 'src/app/shared/global-constant';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm: any = FormGroup;
  dialogAction: any = "Add";
  action: any = "Add";
  responseMessage: any;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private snackBarService: SnackbarService,
    public matDialogRef: MatDialogRef<CategoryComponent>,
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      status: [null, [Validators.required]],
    });
    if (this.dialogData.action === "Edit") {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data);
    }
    
  }

  handleSubmit() {
    if (this.dialogAction === "Edit") {
      this.edit();
    } else {
      this.add();
    }
  }

  add() {
    var formData = this.categoryForm.value;
    var data = {
      name: formData.name,
    }
    console.log("Data : ", data); 
      this.categoryService.add(data).subscribe((res: any) => {
        this.matDialogRef.close();
        this.onAddCategory.emit();
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
    var formData = this.categoryForm.value;
    var data = {
      id: this.dialogData.data.id,
      name: formData.name,
    }
    this.categoryService.update(data).subscribe((res: any) => {
      this.matDialogRef.close();
      this.onAddCategory.emit();
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
    // console.log("this.categoryForm.controls['name'].value", this.categoryForm.controls['name'].value);
    if (this.categoryForm.controls['name'].value != "") {
      return true;
    } else {
      return false;
    }
  }
}
