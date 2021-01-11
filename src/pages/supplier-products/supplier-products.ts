import { Component } from '@angular/core';
import {  NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { SupplierAddProductsPage } from '../supplier-add-products/supplier-add-products';
import { IProduct } from '../../models/interface';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import {Storage} from '@ionic/storage';
import { SupplierProductDetailsPage } from '../supplier-product-details/supplier-product-details';



@Component({
  selector: 'page-supplier-products',
  templateUrl: 'supplier-products.html',
})
export class SupplierProductsPage {
  products: IProduct[];
  originalproducts: IProduct[];
  error: any;
  noprod: any;
  searchTerm: string = '';
  UDetails: any;
  userid: any;
  constructor(public alertCtrl: AlertController, public storage: Storage, public modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public datalink: AppDataLinkProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getProducts();
  }

  getProducts() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          this.datalink.getProducts(String(this.userid), "Supplier").subscribe(products => {
            loading.dismiss().catch(() => { });
            if (products[0] === "400") {
              this.products = [];
              this.error = products[1];
              this.noprod = "noprod";
            } else {
              this.products = products[1];
              this.originalproducts = products[1];
            }
          }, (err) => {
            loading.dismiss().catch(() => { });
            this.datalink.showToast('bottom', "Server error");
            return false;
          });
        }
      });
    });
  }
  addProduct() {
    this.navCtrl.push(SupplierAddProductsPage);
  }

  GotoProductDetails(productid) {
    let Modal = this.modalCtrl.create(SupplierProductDetailsPage, { productid });
    Modal.present();
  }

  searchProduct() {
    let term = this.searchTerm;
    if (term.trim() === '' || term.trim().length < 0) {
      if (this.products.length === 0) {
        this.noprod = "noprod";
        this.products = [];
      } else {
        this.noprod = "full";
        this.products = this.originalproducts;
      }
    } else {
      //to search an already popolated arraylist
      this.products = [];
      if (this.originalproducts) {
        this.products = this.originalproducts.filter((v) => {
          if (v.name.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.properties.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
            this.noprod = "full";
            return true;
          } else {
            if (this.products.length === 0) {
              this.products = [];
              this.noprod = "noprod";
            }
            return false;
          }
        });
      }
    }
  }

  onClear(ev) {
    this.searchTerm = "";
    this.getProducts();
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.getProducts();
  }
  DeleteProduct(productid) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.getProducts();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.datalink.DeleteProduct(productid)
              .subscribe(result => {
                loading.dismiss().catch(() => { });
                if (result == "successful") {
                  this.datalink.showToast('bottom', "Product deleted");
                  this.getProducts();
                } else {
                  this.datalink.showToast('bottom', 'Something went wrong try again');
                  this.getProducts();
                }
              }, error => {
                loading.dismiss().catch(() => { });
                this.datalink.showToast("buttom", 'Your internet appears to be offline');
                return false;
              });
          }
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();
  }

}
