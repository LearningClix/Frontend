import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-bill-products',
  templateUrl: './view-bill-products.component.html',
  styleUrls: ['./view-bill-products.component.scss']
})
export class ViewBillProductsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total'];
  ds: any = [];  
  data:any;
  responseMessage: any;

  constructor(@Inject (MAT_DIALOG_DATA) public dialogData:any, 
  public dialigRef: MatDialogRef<ViewBillProductsComponent>) { }

  ngOnInit() {
    this.data = this.dialogData.data;
    this.ds = JSON.parse(this.dialogData.data.productDetails);
    console.log("ViewBillProductsComponent => this.data: " , this.data);
    console.log("ViewBillProductsComponent => this.ds: " , this.ds);
  }
}
