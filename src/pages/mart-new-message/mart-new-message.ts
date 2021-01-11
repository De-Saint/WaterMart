import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { AdminMessagesPage } from '../admin-messages/admin-messages';



@Component({
  selector: 'page-mart-new-message',
  templateUrl: 'mart-new-message.html',
})
export class MartNewMessagePage {
  slideOneForm: FormGroup;
  UDetails: any;
  userid: any;
  touserid: any;
  constructor(public viewCtrl: ViewController, public formBuilder: FormBuilder,
    public storage: Storage, public loadingCtrl: LoadingController,
    public navCtrl: NavController, public navParams: NavParams, public datalink: AppDataLinkProvider, ) {
    this.touserid = navParams.get('userid');
    this.slideOneForm = formBuilder.group({
      subject: ['']
    });
  }

  ionViewDidLoad() {
    if (this.touserid !== undefined) {
      var usermsg = document.getElementById("UserMessage");
      usermsg.classList.add("hide");
      var adminmsg = document.getElementById("AdminMessage");
      adminmsg.classList.remove("hide");
    }
  }
  close() {
    this.viewCtrl.dismiss();
  }

  Send() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          let touserid = 1;
          var messagebody = document.getElementById("messagebody").textContent;
          loading.present();
          this.datalink.SendMessage(String(this.userid), String(touserid), this.slideOneForm.value.subject, messagebody)
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast("bottom", String(result));
              this.close();
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast("buttom", "Server error try again");
              return false;
            });
        }
      });
    });
  }
  Reply() {
    let loading = this.loadingCtrl.create({
    });
    this.storage.ready().then(() => {
      this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
        if (loggedInUserDetails == null) {
        } else {
          this.UDetails = loggedInUserDetails[1];
          this.userid = this.UDetails.userid;
          var messagebody = document.getElementById("MessageBody").textContent;
          loading.present();
          this.datalink.SendMessage(String(this.userid), String(this.touserid), this.slideOneForm.value.subject, messagebody)
            .subscribe(result => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast("bottom", String(result));
              this.close();
              this.navCtrl.setRoot(AdminMessagesPage);
            }, err => {
              loading.dismiss().catch(() => { });
              this.datalink.showToast("buttom", "Server error try again");
              return false;
            });
        }
      });
    });
  }

}
