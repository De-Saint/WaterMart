import { Component, ChangeDetectorRef } from '@angular/core';
import {  NavController, ActionSheetController, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { Storage } from '@ionic/storage';
import { IProductCategories } from '../../models/interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SupplierProductsPage} from '../supplier-products/supplier-products';


@Component({
  selector: 'page-supplier-add-products',
  templateUrl: 'supplier-add-products.html',
})
export class SupplierAddProductsPage {

  productcategories: IProductCategories[];
  myPhoto: any;
  error: any;
  imageFileName: any;
  userid: any;
  lastname: any;
  UDetails: any;
  properties: any;
  imagefilename: any;
  slideOneForm: FormGroup;
  imageURI: any;
  lastImage: string = null;
  noprodcat: any;
  constructor(public formBuilder: FormBuilder, private cdRef: ChangeDetectorRef,
    public navCtrl: NavController, public storage: Storage,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public datalink: AppDataLinkProvider) {

    this.slideOneForm = formBuilder.group({
      productcat: [''],
      productname: [''],
      productprice: [''],
      productpropertyname: [],
      productpropertyvalue: []
    });

  }
  ionViewDidLoad() {
    this.cdRef.detectChanges();
    this.getProductCategories();
  }
  getProductCategories() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.getProductCategories(this.userid).subscribe(productcategories => {
            if (productcategories[0] === "400") {
              this.productcategories = [];
              this.error = productcategories[1];
              this.noprodcat = "noprodcat";
            } else {
              this.productcategories = productcategories[1];
              this.noprodcat = "prodcat";
            }
          }, (err) => {
            this.datalink.showToast('bottom', "Server error");
            return false;
          });
        }
      });
    });
    
  }
  AddProperty() {
    var name = this.slideOneForm.value.productpropertyname;
    var value = this.slideOneForm.value.productpropertyvalue;
    if (name == null || name == "") {
      this.datalink.showToast('bottom', "Please property name is empty");
      return false;
    }
    if (value == null || value == "") {
      this.datalink.showToast('bottom', "Please property value is empty");
      return false;
    }
    var dive = document.getElementById("removeproperties");
    dive.classList.remove("hide");
    var property = name + ":" + value + ",";
    var div = document.getElementById("properties");
    div.classList.remove("hide");
    var properties = div.innerHTML;
    if (properties !== "") {
      div.innerHTML = div.innerHTML + property + " ";
      this.slideOneForm.controls['productpropertyname'].setValue("");
      this.slideOneForm.controls['productpropertyvalue'].setValue("");
    } else {
      div.innerHTML = div.innerHTML + property + " ";
      this.slideOneForm.controls['productpropertyname'].setValue("");
      this.slideOneForm.controls['productpropertyvalue'].setValue("");
    }


  }

  RemoveProperty() {
    var div = document.getElementById("properties");
    div.innerHTML = "";
    div.classList.add("hide");
    this.slideOneForm.controls['productpropertyname'].setValue("");
    this.slideOneForm.controls['productpropertyvalue'].setValue("");
    var dive = document.getElementById("removeproperties");
    dive.classList.add("hide");
  }
  AddProduct() {
    //----------------------------------------Upload Image------------------------
    let loading = this.loadingCtrl.create({
    });
    var properties = document.getElementById("properties").textContent;
    if (this.slideOneForm.value.productprice == "" || this.slideOneForm.value.productprice === undefined || this.slideOneForm.value.productprice == null) {
      this.datalink.showToast('buttom', 'Product Price is empty');
      return false;
    } else if (this.slideOneForm.value.productname == "" || this.slideOneForm.value.productname === undefined || this.slideOneForm.value.productname == null) {
      this.datalink.showToast('buttom', 'Product Name is empty');
      return false;
    } else {
      loading.present(); this.storage.ready().then(() => {
        this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
          if (loggedInUserDetails == null) {
          } else {
            this.UDetails = loggedInUserDetails[1];
            this.userid = this.UDetails.userid;
            this.datalink.AddProduct(String(this.userid), this.slideOneForm.value.productcat, this.slideOneForm.value.productname, this.slideOneForm.value.productprice, properties.trim())
            .subscribe(productid => {
              loading.dismiss().catch(() => { });
              this.navCtrl.setRoot(SupplierProductsPage);
            }, err => {
              loading.dismiss().catch(() => { });
              return false;
            });
          }
        });
      });
      
    }
  }

}
