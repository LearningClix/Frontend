import { Component, AfterViewInit } from '@angular/core';
import { DashboardService } from '../shared/services/dashboard.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../shared/services/snackbar.service';
import { error } from 'console';
import { GlobalConstants } from '../shared/global-constant';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

	responseMessage :  any;
	data : any;
	ngAfterViewInit() { }

	constructor(private dashboardService: DashboardService,
		private ngxService: NgxUiLoaderService,
		private snackBarService: SnackbarService,		
		) {
			console.log('in Constructor');
			//this.ngxService.start();
			console.log('vallin dashboardData() in Constructor');
			this.dashboardData();
	}

	dashboardData() {
	this.dashboardService.getDetails().subscribe((res:any)=>{
		//this.ngxService.stop();
		this.data = res;		
	},(error:any)=>{
		//this.ngxService.stop();
		console.log(error);
		if(error.error?.message){
			this.responseMessage = error.error?.message;
		}else{
			this.responseMessage = GlobalConstants.genericError;
		}
		//this.ngxService.stop();
		console.log(error);
		this.snackBarService.openSnackBar(this.responseMessage, GlobalConstants.error);
	})
	}

}
