import { Component } from '@angular/core';
import {  NavController, ToastController, NavParams, AlertController, Events, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { Storage } from '@ionic/storage';
import {IUser} from '../../models/interface';



@Component({
  selector: 'page-supplier-profile',
  templateUrl: 'supplier-profile.html',
})
export class SupplierProfilePage {
  fname: any;
  lname: any;
  ema: any;
  pho: any;
  pass: any;
  addre: any;
  utype: any
  id: any;
  address: any;
  UDetails: any;
  code: any;
  date_created: any;
  bname: any;
  nafdacNo: any;
  submitted = false;
  supplier: IUser;
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public datalink: AppDataLinkProvider,
    public storage: Storage,
    public navParams: NavParams,
    public events: Events,
    public alertCtrl: AlertController) {
    }

  ionViewDidLoad() {
    this.getDetails();
  }
  getDetails() {
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.id = this.UDetails.userid;
          this.lname = this.UDetails.lastname;
          this.fname = this.UDetails.firstname;
          this.ema = this.UDetails.email;
          this.pass = this.UDetails.password;
          this.pho = this.UDetails.phone;
          this.address = this.UDetails.address;
          this.date_created = this.UDetails.date_created;
          this.bname = this.UDetails.business_name;
          this.nafdacNo = this.UDetails.nafdac_number;
        }
      });
    });
  }

  getSupplierDetails() {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
      this.datalink.getSupplierDetails(String(this.id)).subscribe(supplier => {
        this.supplier = supplier;
        loading.dismiss().catch(() => { });
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
        return false;
      });
  
    }
  EdiInfo() {
    document.getElementById("editprofile").removeAttribute("class");
    document.getElementById("profile").setAttribute("class", "hide");
  }
  firstBack() {
    document.getElementById("profile").removeAttribute("class");
    document.getElementById("editprofile").setAttribute("class", "hide");
  }

  onUpdate(form) {
    let loading = this.loadingCtrl.create({
     
    });
    this.submitted = true;
    let confirm = this.alertCtrl.create({
      title: 'Update Profile',
      message: 'Conitune?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            loading.dismiss().catch(() => { });
            document.getElementById("profile").removeAttribute("class");
            document.getElementById("editprofile").setAttribute("class", "hide");
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.submitted = true;
            this.datalink.UpdateProfile(this.id, this.bname, this.nafdacNo, this.fname,this.lname,this.pho,this.pass)
            .subscribe(user => {
                loading.dismiss().catch(() => { });
                this.datalink.appRate.promptForRating(true);
                if ( user[0] === "400") {
                  this.datalink.showToast('bottom', user[1])
                  this.navCtrl.setRoot(SupplierProfilePage);
                } else {
                  this.datalink.showToast('bottom', user[1]);
                  this.navCtrl.setRoot(SupplierProfilePage);
                  this.events.publish('user:logout');
                }
              }, (err) => {
                loading.dismiss().catch(() => { });
                this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
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
