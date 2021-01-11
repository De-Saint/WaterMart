import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AppDataLinkProvider } from '../providers/app-data-link/app-data-link';
import { Push, PushObject, PushOptions } from '@ionic-native/push';


import { AdminAccountsPage } from '../pages/admin-accounts/admin-accounts';
import { AdminCustomersPage } from '../pages/admin-customers/admin-customers';
import { AdminHomePage } from '../pages/admin-home/admin-home';
import { AdminMessagesPage } from '../pages/admin-messages/admin-messages';
import { AdminOrdersPage } from '../pages/admin-orders/admin-orders';
import { AdminProfilePage } from '../pages/admin-profile/admin-profile';
import { AdminSuppliersPage } from '../pages/admin-suppliers/admin-suppliers';

import { CustomerMessagesPage } from '../pages/customer-messages/customer-messages';
import { CustomerOrdersPage } from '../pages/customer-orders/customer-orders';
import { CustomerProfilePage } from '../pages/customer-profile/customer-profile';

import { LoginPage } from '../pages/login/login';
import { MartPage } from '../pages/mart/mart';
import { MartContactUsPage } from '../pages/mart-contact-us/mart-contact-us';
import { WelcomePage } from '../pages/welcome/welcome';

import { SupplierAccountsPage } from '../pages/supplier-accounts/supplier-accounts';
import { SupplierHomePage } from '../pages/supplier-home/supplier-home';
import { SupplierLocationsPage } from '../pages/supplier-locations/supplier-locations';
import { SupplierMessagesPage } from '../pages/supplier-messages/supplier-messages';
import { SupplierOrdersPage } from '../pages/supplier-orders/supplier-orders';
import { SupplierProductsPage } from '../pages/supplier-products/supplier-products';
import { SupplierProfilePage } from '../pages/supplier-profile/supplier-profile';

import { SupplierOrderDetailsPage } from '../pages/supplier-order-details/supplier-order-details';
import { AdminOrderDetailsPage } from '../pages/admin-order-details/admin-order-details';
import { CustomerOrderDetailsPage } from '../pages/customer-order-details/customer-order-details';

import { SupplierMessageDetailsPage } from '../pages/supplier-message-details/supplier-message-details';
import { AdminMessageDetailsPage } from '../pages/admin-message-details/admin-message-details';
import { CustomerMessageDetailsPage } from '../pages/customer-message-details/customer-message-details';


export interface PageInterface {
  icon: string;
  color: string;
  title: string;
  logsOut?: boolean;
  component: any
};

@Component({
  templateUrl: 'app.html'
})
export class WaterMart {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  activePage: any;
  Userfullname: any;
  Details: any;
  usertype: any; appPages: PageInterface[] = [
  ];
  loggedInCustomerPages: PageInterface[] = [
    { icon: 'shopping-basket', color: 'faLightBlue', title: 'Mart', component: MartPage },
    { icon: 'shopping-bag', color: 'faGreen', title: 'Orders', component: CustomerOrdersPage },
    { icon: 'envelope', color: 'faPrimary', title: 'Messages', component: CustomerMessagesPage },
    { icon: 'user-circle', color: 'faLightBlue', title: 'Profile', component: CustomerProfilePage },
    { icon: 'support', color: 'faYellow', title: 'Contact Us', component: MartContactUsPage },
    { icon: 'sign-out', color: 'faOrange', title: 'Logout', logsOut: true, component: LoginPage }
  ];
  loggedInAdminPages: PageInterface[] = [
    { icon: 'home', color: 'faGreen', title: 'Dashboard', component: AdminHomePage },
    { icon: 'usd', color: 'faYellow', title: 'Accounts', component: AdminAccountsPage },
    { icon: 'user-circle', color: 'faLightBlue', title: 'Profile', component: AdminProfilePage },
    { icon: 'shopping-bag', color: 'faPrimary', title: 'Orders', component: AdminOrdersPage },
    { icon: 'users', color: 'faOrange', title: 'Suppliers', component: AdminSuppliersPage },
    { icon: 'users', color: 'faGreen', title: 'Customers', component: AdminCustomersPage },
    { icon: 'envelope', color: 'faPrimary', title: 'Messages', component: AdminMessagesPage },
    { icon: 'sign-out', color: 'faLightBlue', title: 'Logout', logsOut: true, component: LoginPage }
  ];
  loggedInSupplerPages: PageInterface[] = [
    { icon: 'home', color: 'faGreen', title: 'Dashboard', component: SupplierHomePage },
    { icon: 'usd', color: 'faYellow', title: 'Accounts', component: SupplierAccountsPage },
    { icon: 'user-circle', color: 'faLightBlue', title: 'Profile', component: SupplierProfilePage },
    { icon: 'shopping-bag', color: 'faLightBlue', title: 'Orders', component: SupplierOrdersPage },
    { icon: 'gift', color: 'faPrimary', title: 'Products', component: SupplierProductsPage },
    { icon: 'map-marker', color: 'faOrange', title: 'Locations', component: SupplierLocationsPage },
    { icon: 'envelope', color: 'faPrimary', title: 'Messages', component: SupplierMessagesPage },
    { icon: 'support', color: 'faYellow', title: 'Contact Us', component: MartContactUsPage },
    { icon: 'sign-out', color: 'faLightBlue', title: 'Logout', logsOut: true, component: LoginPage }
  ];
  loggedOutPages: PageInterface[] = [
    { icon: 'shopping-basket', color: 'faLightBlue', title: 'Marts', component: MartPage },
    { icon: 'support', color: 'faYellow', title: 'Contact Us', component: MartContactUsPage },
    { icon: 'sign-in', color: 'faPrimary', title: 'Login', component: LoginPage }
  ];
  pages: Array<{ title: string, component: any }>;


  constructor(public events: Events, public push: Push,
    public menu: MenuController, public app: App,
    public platform: Platform, public datalink: AppDataLinkProvider,
    public statusBar: StatusBar, public storage: Storage,
    public alertCtrl: AlertController,
    public splashScreen: SplashScreen) {
    this.storage.ready().then(() => {
      // Check if the user has already seen the WelcomePage
      this.storage.get('hasSeenWelcome')
        .then((hasSeenWelcome) => {
          if (hasSeenWelcome) {
            this.storage.get('hasSeenLogin') // Check if the user has already seen the LoginPage
              .then((hasSeenLogin) => {
                if (hasSeenLogin) {
                  this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                    if (loggedInUserDetails === null) {
                      this.rootPage = WelcomePage;
                    } else {
                      this.usertype = this.Details.type;
                      if (this.usertype === "Admin") {
                        this.rootPage = AdminHomePage;
                      } else if (this.usertype === "Supplier") {
                        this.rootPage = SupplierHomePage;
                      } else if (this.usertype === "Customer") {
                        this.rootPage = MartPage;
                      }
                    }
                  });
                } else {
                  this.rootPage = MartPage;
                }
              });
          } else {
            this.rootPage = WelcomePage;
          }
          this.platformReady()
        });

      this.datalink.hasLoggedIn().then((hasLoggedIn) => {
        this.storage.ready().then(() => {
          this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
            if (loggedInUserDetails == null) {
              this.rootPage = WelcomePage;
            } else {
              this.Details = loggedInUserDetails[1];
              this.Userfullname = this.Details.lastname + " " + this.Details.firstname;
              this.usertype = this.Details.type;
              this.enableMenu(hasLoggedIn === true, this.usertype);
            }
          });
        });
      });
      this.listenToLoginEvents();
    });

  }

  platformReady() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.hideSplash();
      this.backbutton();
      this.storage.ready().then(() => {
        this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
          if (loggedInUserDetails == null) {
            this.rootPage = MartPage;
          } else {
            this.Details = loggedInUserDetails[1];
            this.Userfullname = this.Details.lastname + " " + this.Details.firstname;
          }
        });
      });
      this.PushInit();
    });
  }
  PushInit() {
    if (!this.platform.is('cordova')) {
      console.warn('Push notifications not initialized. Cordova is not available - Run in physical device');
      return;
    }
    const options: PushOptions = {
      android: {
        senderID: '637384071102',
        icon: 'icon.png',
        sound: true,
        vibrate: true,
        clearBadge: false,
        forceShow: true,
        clearNotifications: false,
        iconColor: '#6ba1d4'
      },
      ios: {
        alert: true,
        badge: true,
        sound: true
      },
      windows: {}
    };
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      //if user using app and push notification comes
      let msg = JSON.stringify(notification.additionalData.extradata);
      var msgsecondhalf = msg.split("-");
      var Npageto = msgsecondhalf[0].trim();
      var pageto = Npageto.substr(1);
      var Norderid = msgsecondhalf[1].trim();
      var orderid = Norderid.substr(0, Norderid.length - 1);
      if (notification.additionalData.foreground) {
        // if application open, show popup
        if (notification.title == "Placed Order") {
          this.LoadPush(notification.title, notification.message, pageto, orderid);
        } else if (notification.title == "Order Confirmed") {
          this.LoadPush(notification.title, notification.message, pageto, orderid);
        } else if (notification.title == "Order Accepted") {
          this.LoadPush(notification.title, notification.message, pageto, orderid);
        } else if (notification.title == "Order Cancelled") {
          this.LoadPush(notification.title, notification.message, pageto, orderid);
        } else if (notification.title == "New Message") {
          this.LoadPush(notification.title, notification.message, pageto, orderid);
        } else if (notification.title == "Deleted Order") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Rating") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Payment Plan") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Customer Account Created") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Supplier Account Created") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Account Deactivated") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Account Activated") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Account UnBlocked") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Account Blocked") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "New Payment Due Date") {
          this.LoadNoPagePush(notification.title, notification.message);
        }
      } else {
        if (notification.title == "Placed Order") {
          this.LoadPage(pageto, orderid);
        } else if (notification.title == "Order Confirmed") {
          this.LoadPage(pageto, orderid);
        } else if (notification.title == "Order Accepted") {
          this.LoadPage(pageto, orderid);
        } else if (notification.title == "Order Cancelled") {
          this.LoadPage(pageto, orderid);
        } else if (notification.title == "Deleted Order") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Rating") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Payment Plan") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Customer Account Created") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Supplier Account Created") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Account Deactivated") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Account Activated") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Account UnBlocked") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "Account Blocked") {
          this.LoadNoPagePush(notification.title, notification.message);
        } else if (notification.title == "New Payment Due Date") {
          this.LoadNoPagePush(notification.title, notification.message);
        }

      }
    });

    pushObject.on('error').subscribe(error => {
      console.log(error);
    });
  }

  hideSplash() {
    setTimeout(() => {
      this.splashScreen.hide();
    }, 100)
  }

  LoadNoPagePush(notificationTitle, notificationMessage, ) {
    let ConfirmAlert = this.alertCtrl.create({
      title: notificationTitle,
      message: notificationMessage,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    ConfirmAlert.present();
  }

  LoadPush(notificationTitle, notificationMessage, notificationPageTo, notificationParam) {
    let confirmAlert = this.alertCtrl.create({
      title: notificationTitle,
      message: notificationMessage,
      buttons: [{
        text: 'Ignore',
        role: 'cancel'
      }, {
        text: 'View',
        handler: () => {
          this.LoadPage(notificationPageTo, notificationParam);
        }
      }]
    });
    confirmAlert.present();
  }

  LoadPage(pageto, orderid) {
    if (pageto === "supplier") {
      this.nav.push(SupplierOrderDetailsPage, { orderid });
    } else if (pageto === "customer") {
      this.nav.push(CustomerOrderDetailsPage, { orderid });
    } else if (pageto === "admin") {
      this.nav.push(AdminOrderDetailsPage, { orderid });
    } else if (pageto === "adminmsg") {
      let messageid = orderid;
      this.nav.push(AdminMessageDetailsPage, { messageid });
    } else if (pageto === "suppliermsg") {
      let messageid = orderid;
      this.nav.push(SupplierMessageDetailsPage, { messageid });
    } else if (pageto === "customermsg") {
      let messageid = orderid;
      this.nav.push(CustomerMessageDetailsPage, { messageid });
    }
  }

  backbutton() {
    this.platform.registerBackButtonAction(() => {
      let nav = this.app.getActiveNavs()[0];
      if (nav.canGoBack()) { //Can we go back?
        nav.pop();
      } else {
        let actionSheet = this.alertCtrl.create({
          title: 'Exit WaterMart?',
          message: 'Do you want to exit WaterMart?',
          buttons: [
            {
              text: 'Yes',
              handler: () => {
                this.platform.exitApp(); //Exit from app
              }
            }, {
              text: 'No',
              role: 'cancel',
              handler: () => {
              }
            }
          ]
        });
        actionSheet.present();
      }
    });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.component) {
        return 'primary';
      }
      return;
    }
    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }
  listenToLoginEvents() {
    this.events.subscribe('user:signup', () => {
      this.enableMenu(true, "");
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false, "");
      this.nav.setRoot(MartPage);
    });

    this.events.subscribe('user:netwkerror', () => {
      this.enableMenu(false, "");
      this.nav.setRoot(MartPage);
    });

    this.events.subscribe('user:login', (usertype, Userfullname) => {
      this.Userfullname = Userfullname;
      this.enableMenu(true, usertype);
    })
  }
  enableMenu(showmenu, usertype) {
    if (usertype === "Customer") {
      this.menu.enable(showmenu, 'loggedInCustomerPages');
      this.menu.enable(!showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedInSupplierMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === "Admin") {
      this.menu.enable(showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedInCustomerPages');
      this.menu.enable(!showmenu, 'loggedInSupplierMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === "Supplier") {
      this.menu.enable(showmenu, 'loggedInSupplierMenu');
      this.menu.enable(!showmenu, 'loggedInCustomerPages');
      this.menu.enable(!showmenu, 'loggedInAdminMenu');
      this.menu.enable(!showmenu, 'loggedOutMenu');
    } else if (usertype === "") {
      this.menu.enable(!showmenu, 'loggedOutMenu');
      this.menu.enable(showmenu, 'loggedInAdminMenu');
      this.menu.enable(showmenu, 'loggedInCustomerPages');
      this.menu.enable(showmenu, 'loggedInSupplierMenu');
    }
  }
  openPage(page: PageInterface) {
    this.menu.close();
    this.nav.setRoot(page.component);
    this.activePage = page;
    this.LogOutFunction(page);
  }

  LogOutFunction(page) {
    if (page.logsOut === true) {
      let confirm = this.alertCtrl.create({
        title: 'Logging Out',
        message: 'Are you sure you want to logout?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.storage.get('loggedInUserDetails').then((loggedInUserDetails) => {
                if (loggedInUserDetails === null) {
                  this.rootPage = MartPage;
                } else {
                  this.usertype = this.Details.type;
                  if (this.usertype === "Admin") {
                    this.rootPage = AdminHomePage;
                  } else if (this.usertype === "Supplier") {
                    this.rootPage = SupplierHomePage;
                  } else if (this.usertype === "Customer") {
                    this.rootPage = MartPage;
                  }
                }
              });
            }
          },
          {
            text: 'Yes',
            handler: () => {
              setTimeout(() => {
                this.storage.remove('userid');
                this.storage.remove('hasLoggedIn');
                this.storage.remove('hasSeenLogin');
                this.storage.remove('hasSeenWelcome');;
                this.storage.remove('devicetoken');;
                this.storage.remove('loggedInUserDetails');;
                this.events.publish('user:logout');
              }, 1000);
            }
          }
        ]
      });
      confirm.present();
    }
  }



}
