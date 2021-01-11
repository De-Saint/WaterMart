import { Component } from '@angular/core';
import {  Platform, NavController, NavParams, AlertController } from 'ionic-angular';

import { MartNewMessagePage } from '../mart-new-message/mart-new-message'
import { CallNumber } from '@ionic-native/call-number';
import { Storage } from '@ionic/storage';
import {LoginPage } from '../login/login';


@Component({
  selector: 'page-mart-contact-us',
  templateUrl: 'mart-contact-us.html',
})
export class MartContactUsPage {

  constructor(public navCtrl: NavController, public platform: Platform,
    public callNumber: CallNumber, public storage: Storage, public alertCtrl: AlertController,
    public navParams: NavParams) {
  }

  Call(number){
    this.platform.ready().then(() => {
    this.callNumber.callNumber(number, false)
    .then(data => {JSON.stringify(data)}).catch(err => {JSON.stringify(err)});
    });
  }
  SendMessage(){
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
         this.LoginAssistance();
        } else {
          this.navCtrl.push(MartNewMessagePage);
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

}
