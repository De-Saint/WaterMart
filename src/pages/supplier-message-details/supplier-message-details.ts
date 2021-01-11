import { Component } from '@angular/core';
import {  NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { IMessage } from '../../models/interface';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { SupplierMessagesPage } from '../supplier-messages/supplier-messages';

@Component({
  selector: 'page-supplier-message-details',
  templateUrl: 'supplier-message-details.html',
})
export class SupplierMessageDetailsPage {

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
              this.navCtrl.setRoot(SupplierMessagesPage);
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
                  this.navCtrl.setRoot(SupplierMessagesPage, { msg });
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
                  this.navCtrl.setRoot(SupplierMessagesPage);
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
