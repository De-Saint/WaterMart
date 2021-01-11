import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, AlertController, ToastController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { ISupplier, IProduct, ILocation } from '../../models/interface';
import {MartSupplierListPage} from '../mart-supplier-list/mart-supplier-list';
import {Storage } from '@ionic/storage';
import {LoginPage } from '../login/login';
import { Content } from 'ionic-angular';
import {MartPage } from '../mart/mart';
import {CustomerOrdersPage } from '../customer-orders/customer-orders';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'page-mart-supplier-details',
  templateUrl: 'mart-supplier-details.html',
})
export class MartSupplierDetailsPage {
  @ViewChild(Content) content: Content;
productid:any;
catid:any;
supplier: ISupplier;
products: IProduct[];
locations: ILocation[];
location: ILocation;
props: IProduct[];
newlitre: string;
totalamount: any;
UDetails:any;
userid:any;
locationfees: any;
locationName: any;
locationaddress: any;
grandtotal: any;
PlaceOrderForm: FormGroup;
price:any;  
request: {
  quantity?: any,
} = {};
supplieruserid: any;
  constructor(public navCtrl: NavController, public datalink: AppDataLinkProvider, 
    public toastCtrl: ToastController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController,
    public formBuilder: FormBuilder, public navParams: NavParams, public storage : Storage) {
    this.productid = navParams.get('productid');
    this.catid = navParams.get('catid');
    this.supplieruserid = navParams.get('supplieruserid');
    this.PlaceOrderForm = formBuilder.group({
      location: [''],
      deliveryaddress: [''],
    });
    this.getMartSupplierDetails(this.productid);
  }

  ionViewDidLoad() { 
   
    this.getLocations();
    this.getCustomerAddress();
  }
  getCustomerAddress(){
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.locationaddress = this.UDetails.address;
          this.PlaceOrderForm.controls['deliveryaddress'].setValue(this.locationaddress);
        }
      });
    });
    
  }
  getLocations() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getLocation("Supplier", String(this.supplieruserid)).subscribe(locations => {
      loading.dismiss().catch(() => { });
      if (locations[0] === "400") {
        this.locations = [];
      } else {
        this.locations = locations[1];
        
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Server error");
      return false;
    });
  }
  onLocationSelect(locationid) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.getlocationDetails(locationid)
      .subscribe(location => {
        loading.dismiss().catch(() => { });
        this.location = location;
        this.locationfees = this.location.fees;
        this.totalamount = parseInt(this.price) + parseInt(this.locationfees);
        document.getElementById("totalamount").innerText = this.totalamount;
        this.grandtotal = parseInt(this.locationfees) + parseInt(this.price);
        document.getElementById("grandtotal").innerText = this.grandtotal;
      }, err => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('buttom', "Server Error");
        return false;
      });
  }

  getMartSupplierDetails(productid){
    this.datalink.getMartSupplierDetails(String(productid))
    .subscribe((result => {
      this.supplier = result[0];
      this.price = this.supplier.price
      this.products = result[1];
      this.props = result[2];
      this.totalamount = this.price;
      this.grandtotal = this.price;
      this.content.scrollToTop();
    }), err => {
      return false;
    });
  }
  Back(){
    let catid = this.catid;
    this.navCtrl.push(MartSupplierListPage, {catid});
  }

  onRateSupplier(value, supplier_userid){
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
          this.LoginAssistance();
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          loading.present();
          this.datalink.rateSuplier(String(value), supplier_userid, String(this.userid))
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast("bottom", String("Successful"));
              this.getMartSupplierDetails(this.productid);
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast("buttom", "Server error try again");
              return false;
            });
        }
      });
    });
  }

  LoginAssistance(){
    let confirm = this.alertCtrl.create({
      message: "Please Login/Register to continue",
      buttons: [
        {
          text: 'Login',
          handler: () => {
            this.navCtrl.setRoot(LoginPage);
          }
        },
        {
          text: 'Register',
          handler: () => {
            this.navCtrl.setRoot(LoginPage);
          }
        },
        {
          text: 'Close',
          handler: () => {
            
          }
        }
      ]
    });
    confirm.present();
  }
  showAccount() {
    var acctstmtform = document.getElementById("acctstmtform");
    acctstmtform.classList.remove("hide");
    var hideAcct = document.getElementById("hideAcct");
    hideAcct.classList.remove("hide");
    var showAcct = document.getElementById("showAcct");
    showAcct.classList.add("hide");
  }
  hideAccount() {
    var acctstmtform = document.getElementById("acctstmtform");
    acctstmtform.classList.add("hide");
    var hideAcct = document.getElementById("hideAcct");
    hideAcct.classList.add("hide");
    var showAcct = document.getElementById("showAcct");
    showAcct.classList.remove("hide");
  }


  onChangeLitre(litre) {
    this.newlitre = litre;
    if (litre === '') {
      this.datalink.showToast('bottom', "Wrong Input!");
      return false;
    } else if(isNaN(parseInt(this.newlitre))){
      this.datalink.showToast('bottom', "Wrong Input!");
      return false;
    }else {
      if (this.newlitre.length > 6) {
        this.datalink.showToast('bottom', "Wrong Input!");
        return false;
      } else {
        this.totalamount = parseInt(this.price) * parseInt(litre);
        document.getElementById("totalamount").innerText = this.totalamount;
        this.grandtotal = parseInt(this.locationfees) + parseInt(this.totalamount);
        document.getElementById("grandtotal").innerText = this.grandtotal;
      }

    }
  }

  PlaceOrder() {
    let loading = this.loadingCtrl.create({
    });
    var id = this.productid;
    var amount = this.totalamount;
    var quantity = this.request.quantity;
    if(quantity === undefined || quantity === null ){
      quantity = 1;
    }
    let orderdetails = id + "," + quantity + "," + amount + ";";
    var grandtotal = this.grandtotal;
    var deliveryfee = this.locationfees;
    var deliveryAddress = this.PlaceOrderForm.value.deliveryaddress;
    if (deliveryAddress === "" || deliveryAddress == undefined || deliveryAddress === null) {
      this.datalink.showToast("bottom", "Please fill delivery address");
      return false;
    } else {
      this.storage.ready().then(() => {
        this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
          if (loggedInUserDetails == null) {
            this.LoginAssistance();
          } else {
            this.UDetails = loggedInUserDetails[1];
            this.userid = this.UDetails.userid;
            var closinghr = "17";
            var currentHour = this.datalink.getCurrentHour();
            if (currentHour < closinghr) {
              loading.present();
              this.datalink.PlaceOrder(String(this.userid), String(this.supplieruserid), orderdetails, String(grandtotal), deliveryAddress, deliveryfee)
                .subscribe(orderid => {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Your order has been placed");
                  this.datalink.appRate.promptForRating(true);
                  var order = "pending";
                  loading.dismiss().catch(() => { });
                  this.navCtrl.setRoot(CustomerOrdersPage, { orderid, order });
                }, err => {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Your internet appears to be offline, try again");
                  return false;
                });
            } else {
              let confirm = this.alertCtrl.create({
                title: 'Late Order',
                message: 'Your order will be delivered tomorrow. Do you still want to place this order?',
                buttons: [
                  {
                    text: 'No',
                    handler: () => {
                      loading.dismiss().catch(() => { });
                      this.navCtrl.setRoot(MartPage);
                    }
                  },
                  {
                    text: 'Ok',
                    handler: () => {
                      loading.present();
                      this.datalink.PlaceOrder(String(this.userid), String(this.supplieruserid), orderdetails, String(grandtotal), deliveryAddress, deliveryfee)
                      .subscribe(orderid => {
                          loading.dismiss().catch(() => { });
                          this.datalink.showToast('bottom', "Your order has been placed");
                          this.datalink.appRate.promptForRating(true);
                          var order = "pending";
                          loading.dismiss().catch(() => { });
                          this.navCtrl.setRoot(CustomerOrdersPage, { orderid, order });
                        }, err => {
                          loading.dismiss().catch(() => { });
                          this.datalink.showToast('bottom', "Your internet appears to be offline, try again");
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
        });
      });
    }

  }
}
