import { Component } from '@angular/core';
import {  NavController, NavParams, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { ISupplier } from '../../models/interface';
import { MartSupplierDetailsPage } from '../mart-supplier-details/mart-supplier-details';

@Component({
  selector: 'page-mart-supplier-list',
  templateUrl: 'mart-supplier-list.html',
})
export class MartSupplierListPage {
catid:any;
error: any;
nosup: any;
searchQuery;
supplierlist: ISupplier[];
originalsupplierlist: ISupplier[];
  constructor(public navCtrl: NavController, public datalink: AppDataLinkProvider, 
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams) {
    this.catid = this.navParams.get('catid');
  this.searchQuery = '';
  }

  ionViewDidLoad() {
       let loading = this.loadingCtrl.create({
      content: "Loading...",
    });
    loading.present();
    this.getSuppliers(loading, this.catid);
   
  }
  GoToDetails(supplieruserid, productid){
    let catid = this.catid;
    this.navCtrl.push(MartSupplierDetailsPage, {supplieruserid, productid, catid})

  }
  getSuppliers(loading, catid){
    this.datalink.getMartSuppliers(String(catid))
    .subscribe(result => {
      if (result[0] === "400") {
        loading.dismiss().catch(() => { });
        this.supplierlist = [];
        this.error = result[1];
        this.nosup = "empty";
      } else {
          this.nosup = "full";
          this.supplierlist = result[1];
          this.originalsupplierlist = result[1];
        loading.dismiss().catch(() => { });
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
      return false;
    });
  }

  SearchSuppliers(searchEvent) {
    let term = searchEvent.target.value
    if (term.trim() === '' || term.trim().length < 0) {
      this.nosup = "full";
      this.supplierlist = this.originalsupplierlist;
    } else {
      //to search an already popolated arraylist
      this.supplierlist = [];
      this.supplierlist = this.originalsupplierlist.filter((v) => {
        if (v.business_name.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
          this.nosup = "full";
          return true;
        } else {
          if (this.supplierlist.length === 0) {
            this.nosup = "empty";
          }
          return false;
        }
      });
    }
  }
}
