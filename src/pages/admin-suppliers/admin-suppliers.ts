import { Component } from '@angular/core';
import {  NavController, NavParams, ActionSheetController, LoadingController, AlertController } from 'ionic-angular';
import { IUser } from '../../models/Interface';
import { AppDataLinkProvider } from '../../providers/app-data-link/app-data-link';
import { AdminSupplierDetailsPage } from '../admin-supplier-details/admin-supplier-details';
import { MartNewMessagePage } from '../mart-new-message/mart-new-message';
import { CallNumber } from '@ionic-native/call-number';


@Component({
  selector: 'page-admin-suppliers',
  templateUrl: 'admin-suppliers.html',
})
export class AdminSuppliersPage {
  suppliers: IUser[];
  originalsuppliers: IUser[];
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
    this.datalink.getSuppliers(firstCount).subscribe(suppliers => {
      loading.dismiss().catch(() => { });
      if (suppliers[0] === "400") {
        this.error = suppliers[1];
        this.nouser = "nouser";
      } else {
        this.nouser = "full";
        this.suppliers = suppliers[1];
        this.originalsuppliers = suppliers[1];
      }
    }, (err) => {
      loading.dismiss().catch(() => { });
      this.datalink.showToast('bottom', "Your internet connection appears to be offline, please try again");
      return false;
    });
  }

  goToDetails(userid, businessname, phone) {
    let actionSheet = this.actionSheetCtrl.create({
      title: businessname,
      buttons: [
        {
          text: 'View',
          handler: () => {
            this.navCtrl.push(AdminSupplierDetailsPage, { userid });
          }
        },
        {
          text: 'Call',
          handler: () => {
            this.callNumber.callNumber(phone, false)
              .then(data => { JSON.stringify(data) }).catch(err => { JSON.stringify(err) });

          }
        },
        {
          text: 'Send Message',
          handler: () => {
            this.navCtrl.push(MartNewMessagePage, { userid });
          }
        },
        {
          text: 'Activate Account',
          handler: () => {
            this.ActivateAccount(userid, businessname, "Activate");
          }
        },
        {
          text: 'Deactivate Account',
          handler: () => {
            this.DeactivateAccount(userid, businessname, "Deactivate");
          }
        },
        {
          text: 'Change Payment Plan',
          handler: () => {
            this.ChangePaymenPlan(userid, businessname);
          }
        },
        {
          text: 'Reset Payment Due Date',
          handler: () => {
            this.ChangePaymenDueDate(userid, businessname, "ResetPaymentDueDate");
          }
        },
        {
          text: 'Delete ',
          handler: () => {
            this.DeleteUser(userid, businessname);
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

  ActivateAccount(userid, businessname, action) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Activate',
      message: 'Activate ' + businessname + ' Account?',
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
  ChangePaymenDueDate(userid, businessname, action) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Reset Payment Due Date',
      message: 'Reset ' + businessname + ' Payment Due Date?',
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

  DeactivateAccount(userid, businessname, action) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Deactivate',
      message: 'Deactivate ' + businessname + ' Account?',
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

  ChangePaymenPlan(userid, businessname) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Change Payment Plan',
      message: 'Change Payment Plan for ' + businessname + '?',
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
            this.datalink.ChangePaymenPlan(userid)
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
  DeleteUser(userid, businessname) {
    let loading = this.loadingCtrl.create({
    });
    let confirm = this.alertCtrl.create({
      title: 'Delete',
      message: 'Are you sure you want to delete ' + businessname + '?',
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

  searchSuppliers() {
    let term = this.searchTerm;
    if (term.trim() === '' || term.trim().length < 0) {
      if (this.suppliers.length === 0) {
        this.nouser = "nouser";
      } else {
        this.nouser = "full";
        this.suppliers = this.originalsuppliers;
      }
    } else {
      //to search an already popolated arraylist
      this.suppliers = [];
      if (this.originalsuppliers) {
        this.suppliers = this.originalsuppliers.filter((v) => {
          if (v.lastname.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1 || v.firstname.toLocaleLowerCase().indexOf(term.toLowerCase()) > -1) {
            this.nouser = "full";
            return true;
          } else {
            if (this.suppliers.length === 0) {
              this.suppliers = [];
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
