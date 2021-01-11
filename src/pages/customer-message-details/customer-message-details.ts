import { Component } from '@angular/core';
import {  NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { IMessage } from '../../models/interface';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { CustomerMessagesPage } from '../customer-messages/customer-messages';

@Component({
  selector: 'page-customer-message-details',
  templateUrl: 'customer-message-details.html',
})
export class CustomerMessageDetailsPage {
  message: IMessage = new IMessage;
  
    messageid: number;
    successMsg: string;
    UDetails: any;
    userid: any;
    pagefrom: any;
    messagetype:any;
    constructor(
      public datalink: AppDataLinkProvider,
      public alertCtrl: AlertController,
      public loadingCtrl: LoadingController,
      public navCtrl: NavController,
      public navParams: NavParams) {
      this.messageid = navParams.get('messageid');     
      this.getMsgDetails();
    }
  
    getMsgDetails() {
      let loading = this.loadingCtrl.create({
      });
      loading.present();
      this.datalink.getMsgDetails(this.messageid)
      .subscribe(message => {
        loading.dismiss().catch(() => { });
        this.message = message
      },errro => {
        loading.dismiss().catch(() => { });
      });
    }
   
    deleteMessage() {
      let loading = this.loadingCtrl.create({
      });
      let confirm = this.alertCtrl.create({
        title: 'Delete Message',
        message: 'Do you want to delete this message?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.navCtrl.setRoot(CustomerMessagesPage);
            }
          },
          {
            text: 'Yes',
            handler: () => {
              loading.present();
              if (this.messagetype === "Sent") {
                this.datalink.deleteMessage(this.messageid).subscribe(successMsg => {
                  loading.dismiss().catch(() => { });
                  this.successMsg = String(successMsg);
                  this.datalink.displayAlert("Message", this.successMsg);
                  let msg = "sent";
                  this.navCtrl.setRoot(CustomerMessagesPage, { msg });
                }, (err) => {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Your internet connection appears to be offline.");
                  return false;
                });
              } else   if (this.messagetype === "Inbox"){
                this.datalink.deleteMessage(this.messageid).subscribe(successMsg => {
                  loading.dismiss().catch(() => { });
                  this.successMsg = String(successMsg);
                  this.datalink.displayAlert("Message", this.successMsg);
                  this.navCtrl.setRoot(CustomerMessagesPage);
                }, (err) => {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Your internet connection appears to be offline.");
                  return false;
                });
              }
            }
          }
        ]
      });
      loading.dismiss().catch(() => { });
      confirm.present();
    }
}
