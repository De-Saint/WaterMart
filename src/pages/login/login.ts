import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, AlertController, Platform, Events, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { IUser } from '../../models/interface';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { AdminHomePage } from '../admin-home/admin-home';
import { SupplierHomePage } from '../supplier-home/supplier-home';
import { CustomerSignupPage } from '../customer-signup/customer-signup';
import { SupplierSignupPage } from '../supplier-signup/supplier-signup';
import { MartPage } from '../mart/mart';
import { PasswordResetPage } from '../password-reset/password-reset';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private login: FormGroup;
  submitted = false;
  loggedInUserDetails: IUser[];
  Details: any;
  usertype: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  Username: any;
  userid: any;
  email: any;
  message: any;
  errormsg: any;
  constructor(public navCtrl: NavController,
    public storage: Storage, 
    public toastCtrl: ToastController,
    public events: Events, 
    public push: Push,
    public platform: Platform, 
    public alertCtrl: AlertController,
    public datalink: AppDataLinkProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public formBuilder: FormBuilder) {
      this.email = this.navParams.get('email');
      this.login = this.formBuilder.group({
        txt_email: ['', Validators.required],
        txt_password: [''],
      });
  }

  ionViewDidLoad() {
    this.login.controls['txt_email'].setValue(this.email);
    
  }
  loginForm(form) {
    this.submitted = true;
    if (form.valid) {
      var email = this.login.value.txt_email;
      var pass = this.login.value.txt_password;

      this.validateLogin(email, pass);
    }
  }
 
  validateLogin(emailphone, password) {
    let loading = this.loadingCtrl.create({
     
    });
    loading.present();
    this.datalink.login(emailphone, password).subscribe(loggedInUserDetails => {
        this.loggedInUserDetails = loggedInUserDetails;
        if (loggedInUserDetails[0] != "200") {
          this.errormsg = loggedInUserDetails[1];
          this.datalink.displayAlert("Error ", this.errormsg);
          this.events.publish('user:logout');
          loading.dismiss().catch(() => { });
        } else {
          this.storage.ready().then(() => {
            this.storage.set(this.HAS_LOGGED_IN, true);
          });
          this.datalink.SetloggedInUserDetails(this.loggedInUserDetails);
          this.Details = loggedInUserDetails[1];
          this.usertype = this.Details.type;
          this.Username = this.Details.lastname + " " + this.Details.firstname;
          this.datalink.showToast('bottom', "Welcome " + this.Username);
          this.userid = this.Details.userid;
      
          this.events.publish('user:login', this.usertype, this.Username);
          this.usertype = this.Details.type;
          if (this.usertype === "Admin") {
            this.gotoAdminHomePage(loading);
          } else if (this.usertype === "Supplier") {
            this.gotoSupplierHomePage(loading);
          } else if (this.usertype === "Customer") {
            this.gotoMart(loading);
          } 
          this.registerDeviceToken(this.userid);
        }   
        loading.dismiss().catch(() => { });
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Your internet connection appears to be offline");
        return false;
      });
  }
  showPassword(input: any): any {
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  gotoMart(loading) {
    this.navCtrl.setRoot(MartPage).then(() => {
      this.storage.ready().then(() => {
        this.storage.set('hasSeenLogin', true);
        loading.dismiss().catch(() => { });
      });
      loading.dismiss().catch(() => { });
    });
    loading.dismiss().catch(() => { });
  }
  gotoSupplierHomePage(loading) {
    this.navCtrl.setRoot(SupplierHomePage).then(() => {
      this.storage.ready().then(() => {
        this.storage.set('hasSeenLogin', true);
        loading.dismiss().catch(() => { });
      });
      loading.dismiss().catch(() => { });
    });
    loading.dismiss().catch(() => { });
  }
  gotoAdminHomePage(loading) {
    this.navCtrl.setRoot(AdminHomePage).then(() => {
      this.storage.ready().then(() => {
        this.storage.set('hasSeenLogin', true);
        loading.dismiss().catch(() => { });
      });
      loading.dismiss().catch(() => { });
    });
    loading.dismiss().catch(() => { });
  }
   registerDeviceToken(userid) {
    this.platform.ready().then(() => {
      const options: PushOptions = {
        android: {
          senderID: '637384071102',
        },
      };
      const pushObject: PushObject = this.push.init(options);
      pushObject.on('registration').subscribe((registration: any) => {
       this.datalink.SaveAndUpdateDeviceToken(String(userid), registration.registrationId) 
       .subscribe(value => {
          this.storage.set("devicetoken", registration.registrationId);
        });
      });
    });
  }

  ResetPassword() {
    this.navCtrl.push(PasswordResetPage);
  }
  Signup() {
    this.navCtrl.push(CustomerSignupPage);
  }
  Register() {
    this.navCtrl.push(SupplierSignupPage);
  }
}
