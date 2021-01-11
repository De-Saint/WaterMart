import { Component, ViewChild } from '@angular/core';
import {  NavController, Events, LoadingController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { Storage } from '@ionic/storage';
import { IUser, IStates, ILga, IPaymentPlan, IWaterCategory } from '../../models/interface';


@Component({
  selector: 'page-supplier-signup',
  templateUrl: 'supplier-signup.html',
})
export class SupplierSignupPage {
  @ViewChild('signupSlider') signupSlider: any;
  HAS_LOGGED_IN = 'hasLoggedIn';
  loggedInUserDetails: IUser[];
  states: IStates[];
  selectedstate: IStates[];
  lgas: ILga[];
  watercats: IWaterCategory[];
  plans: IPaymentPlan[];
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
      bizname: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      nafdacNumber: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
      email: ['', Validators.compose([Validators.maxLength(30), Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')])],
      phone: ['', Validators.compose([Validators.minLength(11), Validators.maxLength(11), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required, Validators.maxLength(15)])],
      confirmpassword: ['', Validators.compose([Validators.minLength(6), Validators.required, Validators.required, Validators.maxLength(15)])]

    });
    this.slideTwoForm = formBuilder.group({
      watertype: ['', Validators.required],
      payplan: ['', Validators.required],
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
    this.getPaymenPlan();
    this.getWaterCategory();
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
  getPaymenPlan() {
    this.datalink.getPaymentPlan().subscribe(plans => {
      this.plans = plans;
    }, (err) => {
      return false;
    });
  }
  getWaterCategory() {
    this.datalink.getWaterCategory().subscribe(watercats => {
      this.watercats = watercats;
    }, (err) => {
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
      this.datalink.SupplierRegistration(
        this.slideOneForm.value.bizname,
        this.slideOneForm.value.nafdacNumber,
        this.slideOneForm.value.email,
        this.slideOneForm.value.phone,
        this.slideOneForm.value.password,
        this.slideTwoForm.value.watertype,
        this.slideTwoForm.value.payplan,
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
          this.datalink.displayAlert("Account Created", "Please email Watermart_info@baesicsolution.com or call 07067483120 for Account Activation");
          this.navCtrl.pop();
        } else {
          this.datalink.showToast('bottom', result[1]);
        }
      }, (err) => {
        loading.dismiss().catch(() => { });
        return false;
      });
    }


  }



}
