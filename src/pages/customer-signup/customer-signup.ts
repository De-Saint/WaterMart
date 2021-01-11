import { Component, ViewChild } from '@angular/core';
import {  NavController, Events, LoadingController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { Storage } from '@ionic/storage';
import { IUser, IStates, ILga } from '../../models/interface';
import { MartPage } from '../mart/mart';


@Component({
  selector: 'page-customer-signup',
  templateUrl: 'customer-signup.html',
})
export class CustomerSignupPage {
  @ViewChild('signupSlider') signupSlider: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  loggedInUserDetails: IUser[];
  states: IStates[];
  selectedstate: IStates[];
  lgas: ILga[];
  Details: any;
  code: any;
  Username: any;
  userid: any;
  usertype: any;
  slideOneForm: FormGroup;
  slideTwoForm: FormGroup;
  slideThreeForm: FormGroup;
  submitAttempt: boolean = false;
  match: any;
  validate: string;
  check: any;
  Email: any;
  constructor(public storage: Storage,
    public loadingCtrl: LoadingController,
    public events: Events,
    public datalink: AppDataLinkProvider, public formBuilder: FormBuilder,
    public navCtrl: NavController, public navParams: NavParams) {

    this.Email = this.navParams.get('email');

    this.slideOneForm = formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])],
      phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required, Validators.maxLength(15)])],
      confirmpassword: ['', Validators.compose([Validators.minLength(6), Validators.required, Validators.required, Validators.maxLength(15)])]

    });
    this.slideTwoForm = formBuilder.group({
      firstname: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(1), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      lastname: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(1), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      question: ['', Validators.required],
      answer: ['', Validators.required]
    });
    this.slideThreeForm = formBuilder.group({
      stateid: ['', Validators.required],
      lgaid: ['', Validators.required],
      address: ['', Validators.required]
    });

  }

  ionViewDidLoad() {
    this.slideOneForm.controls['email'].setValue(this.Email);
    let loading = this.loadingCtrl.create({
      content: "Loading states please wait...",
    });
    loading.present();
    this.getStates(loading);
  }
  getStates(loading) {
    this.datalink.getStates().subscribe(states => {
      this.states = states;
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });
  }
  onSelect(stateid) {
    let loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    this.datalink.getLga(stateid).subscribe(lgas => {
      this.lgas = lgas;
      loading.dismiss().catch(() => { });
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Server error or your internet connection appears to be offline, please try again");
      return false;
    });

  }
  NextOne() {
    if (!this.slideOneForm.valid) {
      this.signupSlider.slideTo(0);
    } else {
      this.signupSlider.slideNext();
    }
  }

  BackOne() {
    this.signupSlider.slidePrev();
  }
  NextTwo() {
    if (!this.slideTwoForm.valid) {
      this.signupSlider.slideTo(1);
    } else {
      this.signupSlider.slideNext();
    }
  }


  BackTwo() {
    this.signupSlider.slidePrev();
  }

  onCheckPassword(conpass) {
    var pass = this.slideOneForm.value.password;
    if (conpass === pass && conpass.trim().length === pass.trim().length) {
      this.match = "Password confirmed";
    } else {
      this.match = "Password did not match";
    }
  }

  onCheckEmail(email) {
    this.datalink.checkEmail(email).subscribe(res => {
      console.log(res);
      if(res == "NotAvailable"){
        this.match = res;
      }else if(res == "Available"){
        this.match = res;
      }
    });
  }
  save() {
    let loading = this.loadingCtrl.create({
    });
    this.submitAttempt = true;
    if (!this.slideOneForm.valid) {
      this.signupSlider.slideTo(0);
    }
    else if (!this.slideTwoForm.valid) {
      this.signupSlider.slideTo(1);
    } else if (!this.slideThreeForm.valid) {
      this.signupSlider.slideTo(2);
    } else {
      loading.present();
      this.datalink.UserRegistration(
        this.slideOneForm.value.email,
        this.slideOneForm.value.phone,
        this.slideOneForm.value.password,
        this.slideTwoForm.value.firstname,
        this.slideTwoForm.value.lastname,
        this.slideTwoForm.value.question,
        this.slideTwoForm.value.answer,
        this.slideThreeForm.value.stateid,
        this.slideThreeForm.value.lgaid,
        this.slideThreeForm.value.address
      ).subscribe((result) => {
        loading.dismiss().catch(() => { });
        if (result[0] === "200") {
          loading.dismiss().catch(() => { });
          this.validateLogin(this.slideOneForm.value.email, this.slideOneForm.value.password);
        } else {
          this.datalink.showToast('bottom', result[1]);
        }
      }, (err) => {
        loading.dismiss().catch(() => { });
        return false;
      });
    }


  }

  validateLogin(emailphone, password) {
    let loading = this.loadingCtrl.create({
    });
    loading.present();
    this.datalink.login(emailphone, password)
      .subscribe(loggedInUserDetails => {
        this.loggedInUserDetails = loggedInUserDetails;
        if (loggedInUserDetails[0] != 200) {
          this.datalink.displayAlert("Error ", loggedInUserDetails[1]);
          this.events.publish('user:logout');
          loading.dismiss().catch(() => { });
        } else {
          this.storage.ready().then(() => {
            this.storage.set('hasSeenWelcome', true);
            this.storage.set(this.HAS_LOGGED_IN, true);
          });
          this.datalink.SetloggedInUserDetails(this.loggedInUserDetails);
          this.Details = loggedInUserDetails[1];
          this.usertype = this.Details.type;
          this.Username = this.Details.lastname + " " + this.Details.firstname;
          this.datalink.showToast('bottom', "Welcome " + this.Username);
          this.gotoMarket(loading);
          this.userid = this.Details.userid;
          // this.registerDeviceToken(this.userid);
          this.events.publish('user:login', this.usertype, this.Username);
        }
        loading.dismiss().catch(() => { });
      }, (err) => {
        loading.dismiss().catch(() => { });
        this.datalink.showToast('bottom', "Your internet connection appears to be offline");
        return false;
      });
  }

  gotoMarket(loading) {
    this.navCtrl.setRoot(MartPage).then(() => {
      this.storage.ready().then(() => {
        this.storage.set('hasSeenLogin', true);
        loading.dismiss().catch(() => { });
      });
      loading.dismiss().catch(() => { });
    });
    loading.dismiss().catch(() => { });
  }

}
