import { Component } from '@angular/core';
import {  NavController, NavParams, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { IUser } from '../../models/Interface';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { AdminCustomerDetailsPage } from '../admin-customer-details/admin-customer-details';
import { MartNewMessagePage } from '../mart-new-message/mart-new-message';
import { CallNumber } from '@ionic-native/call-number';


@Component({
  selector: 'page-admin-customers',
  templateUrl: 'admin-customers.html',
})
export class AdminCustomersPage {
  customers: IUser[];
  originalcustomers: IUser[];
  error: any;
  nouser: any;
  searchTerm: string = '';
  constructor(public callNumber: CallNumber,
    public actionSheetCtrl: ActionSheetController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public datalink: AppDataLinkProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.getUsers();
  }

  getUsers() {
    let loading = this.loadingCtrl.create({
      dismissOnPageChange: true
    });
    loading.present();
    let firstCount = "0";
    this.datalink.getCustomers(firstCount).subscribe(customers => {
      loading.dismiss().catch(() => { });
      if (customers[0] === "400") {
        this.error = customers[1];
        this.nouser = "nouser";
      } else {
        this.nouser = "full";
        this.customers = customers[1];
        this.originalcustomers = customers[1];
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
      return false;
    });
  }

  goToDetails(userid, lastname, phone) {
    let actionSheet = this.actionSheetCtrl.create({
      title: lastname,
      buttons: [
        {
          text: 'View',
          handler: () => {
            this.navCtrl.push(AdminCustomerDetailsPage, { userid });
          }
        },
        {
          text: 'Call',
          handler: () => {
            this.callNumber.callNumber(phone, false)
            .then(data => {JSON.stringify(data)}).catch(err => {JSON.stringify(err)});
         
          }
        },
        {
          text: 'Send Message',
          handler: () => {
            this.navCtrl.push(MartNewMessagePage, { userid });
          }
        },
        {
          text: 'Block',
          handler: () => {
            this.BlockAccount(userid, lastname, "Block");
          }
        },
        {
          text: 'Unblock',
          handler: () => {
            this.UnblockAccount(userid, lastname, "Unblock");
          }
        },
        
        {
          text: 'Delete ',
          handler: () => {
            this.DeleteUser(userid, lastname);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]

    });
    actionSheet.present();
  }

  BlockAccount(userid, businessname, action) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Block',
      message: 'Block ' + businessname + ' Account?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.getUsers();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.datalink.AccountAction(userid, action )
              .subscribe(result => {
                loading.dismiss().catch(() => { });
                if (result == "success") {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Successful");
                  this.getUsers();
                } else {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Error try again");
                }
              }, err => {
                loading.dismiss().catch(() => { });
                return false;
              });
          }
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();
  }

  UnblockAccount(userid, businessname, action) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Unblock',
      message: 'Unblock ' + businessname + ' Account?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.getUsers();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.datalink.AccountAction(userid, action )
              .subscribe(result => {
                loading.dismiss().catch(() => { });
                if (result == "success") {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Successful");
                  this.getUsers();
                } else {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Error try again");
                }
              }, err => {
                loading.dismiss().catch(() => { });
                return false;
              });
          }
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();
  }
  DeleteUser(userid, lastname) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to delete ' + lastname + '?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.getUsers();
          }
        },
        {
          text: 'Yes',
          handler: () => {
            loading.present();
            this.datalink.DeleteCustomer(userid)
              .subscribe(result => {
                loading.dismiss().catch(() => { });
                if (result == "successful") {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Customer Account Deleted");
                  this.getUsers();
                } else {
                  loading.dismiss().catch(() => { });
                  this.datalink.showToast('bottom', "Error try again");
                }
              }, err => {
                loading.dismiss().catch(() => { });
                return false;
              });
          }
        }
      ]
    });
    loading.dismiss().catch(() => { });
    confirm.present();

  }

  searchCustomer() {
    let term = this.searchTerm;
    if (term.trim() === '' || term.trim().length < 0) {
      if (this.customers.length === 0) {
        this.nouser = "nouser";
      } else {
        this.nouser = "full";
        this.customers = this.originalcustomers;
      }
    } else {
      //to search an already popolated arraylist
      this.customers = [];
      if (this.originalcustomers) {
        this.customers = this.originalcustomers.filter((v) => {
          if (v.lastname.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.firstname.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
            this.nouser = "full";
            return true;
          } else {
            if (this.customers.length === 0) {
              this.customers = [];
              this.nouser = "nouser";
            }
            return false;
          }
        });
      }
    }
  }


  onClear(ev) {
    this.searchTerm = "";
    this.getUsers();
  }
  onCancel(ev) {
    this.searchTerm = "";
    this.getUsers();
  }

}
