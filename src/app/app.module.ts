import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Ionic2RatingModule } from 'ionic2-rating';

import { WaterMart } from './app.component';
import { AdminAccountsPage } from '../pages/admin-accounts/admin-accounts';
import { AdminCustomerDetailsPage } from '../pages/admin-customer-details/admin-customer-details';
import { AdminCustomersPage } from '../pages/admin-customers/admin-customers';
import { AdminHomePage } from '../pages/admin-home/admin-home';
import { AdminMessageDetailsPage } from '../pages/admin-message-details/admin-message-details';
import { AdminMessagesPage } from '../pages/admin-messages/admin-messages';
import { AdminOrderDetailsPage } from '../pages/admin-order-details/admin-order-details';
import { AdminOrdersPage } from '../pages/admin-orders/admin-orders';
import { AdminProfilePage } from '../pages/admin-profile/admin-profile';
import { AdminSupplierDetailsPage } from '../pages/admin-supplier-details/admin-supplier-details';
import { AdminSuppliersPage } from '../pages/admin-suppliers/admin-suppliers';

import { CustomerMessageDetailsPage } from '../pages/customer-message-details/customer-message-details';
import { CustomerMessagesPage } from '../pages/customer-messages/customer-messages';
import { CustomerOrderDetailsPage } from '../pages/customer-order-details/customer-order-details';
import { CustomerOrdersPage } from '../pages/customer-orders/customer-orders';
import { CustomerProfilePage } from '../pages/customer-profile/customer-profile';
import { CustomerSignupPage } from '../pages/customer-signup/customer-signup';

import { LoginPage } from '../pages/login/login';
import { MartPage } from '../pages/mart/mart';
import { MartContactUsPage } from '../pages/mart-contact-us/mart-contact-us';
import { MartNewMessagePage } from '../pages/mart-new-message/mart-new-message';
import { MartSupplierDetailsPage } from '../pages/mart-supplier-details/mart-supplier-details';
import { MartSupplierListPage } from '../pages/mart-supplier-list/mart-supplier-list';
import { PasswordResetPage } from '../pages/password-reset/password-reset';

import { SupplierAccountsPage } from '../pages/supplier-accounts/supplier-accounts';
import { SupplierAddLocationsPage } from '../pages/supplier-add-locations/supplier-add-locations';
import { SupplierAddProductsPage } from '../pages/supplier-add-products/supplier-add-products';
import { SupplierEditLocationPage } from '../pages/supplier-edit-location/supplier-edit-location';
import { SupplierHomePage } from '../pages/supplier-home/supplier-home';
import { SupplierLocationsPage } from '../pages/supplier-locations/supplier-locations';
import { SupplierMessageDetailsPage } from '../pages/supplier-message-details/supplier-message-details';
import { SupplierMessagesPage } from '../pages/supplier-messages/supplier-messages';
import { SupplierOrderDetailsPage } from '../pages/supplier-order-details/supplier-order-details';
import { SupplierOrdersPage } from '../pages/supplier-orders/supplier-orders';
import { SupplierProductDetailsPage } from '../pages/supplier-product-details/supplier-product-details';
import { SupplierProductsPage } from '../pages/supplier-products/supplier-products';
import { SupplierProfilePage } from '../pages/supplier-profile/supplier-profile';
import { SupplierSignupPage } from '../pages/supplier-signup/supplier-signup';
import { WelcomePage } from '../pages/welcome/welcome';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppRate } from '@ionic-native/app-rate';
import { Push } from '@ionic-native/push';
import { AdMobFree } from '@ionic-native/admob-free';
import { AppDataLinkProvider } from '../providers/app-data-link/app-data-link';
import { CallNumber } from '@ionic-native/call-number';
@NgModule({
  declarations: [
    WaterMart,
    AdminAccountsPage,
    AdminCustomerDetailsPage,
    AdminCustomersPage,
    AdminHomePage,
    AdminMessageDetailsPage,
    AdminMessagesPage,
    AdminOrderDetailsPage,
    AdminOrdersPage,
    AdminProfilePage,
    AdminSupplierDetailsPage,
    AdminSuppliersPage,

    CustomerMessageDetailsPage,
    CustomerMessagesPage,
    CustomerOrderDetailsPage,
    CustomerOrdersPage,
    CustomerProfilePage,
    CustomerSignupPage,

    LoginPage,
    MartPage,
    MartContactUsPage,
    MartNewMessagePage,
    MartSupplierDetailsPage,
    MartSupplierListPage,
    PasswordResetPage,

    SupplierAccountsPage,
    SupplierAddLocationsPage,
    SupplierAddProductsPage,
    SupplierEditLocationPage,
    SupplierHomePage,
    SupplierLocationsPage,
    SupplierMessageDetailsPage,
    SupplierMessagesPage,
    SupplierOrderDetailsPage,
    SupplierOrdersPage,
    SupplierProductDetailsPage,
    SupplierProductsPage,
    SupplierProfilePage,
    SupplierSignupPage,
    WelcomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(WaterMart, {}, {
      links: [
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: SupplierSignupPage, name: 'SupplierSignupPage', segment: 'suppliersignup' },
      ]
    }),
    Ionic2RatingModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    WaterMart,
    AdminAccountsPage,
    AdminCustomerDetailsPage,
    AdminCustomersPage,
    AdminHomePage,
    AdminMessageDetailsPage,
    AdminMessagesPage,
    AdminOrderDetailsPage,
    AdminOrdersPage,
    AdminProfilePage,
    AdminSupplierDetailsPage,
    AdminSuppliersPage,

    CustomerMessageDetailsPage,
    CustomerMessagesPage,
    CustomerOrderDetailsPage,
    CustomerOrdersPage,
    CustomerProfilePage,
    CustomerSignupPage,

    LoginPage,
    MartPage,
    MartContactUsPage,
    MartNewMessagePage,
    MartSupplierDetailsPage,
    MartSupplierListPage,
    PasswordResetPage,

    SupplierAccountsPage,
    SupplierAddLocationsPage,
    SupplierAddProductsPage,
    SupplierEditLocationPage,
    SupplierHomePage,
    SupplierLocationsPage,
    SupplierMessageDetailsPage,
    SupplierMessagesPage,
    SupplierOrderDetailsPage,
    SupplierOrdersPage,
    SupplierProductDetailsPage,
    SupplierProductsPage,
    SupplierProfilePage,
    SupplierSignupPage,
    WelcomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Push,
    AdMobFree,
    AppRate,
    CallNumber,
    HttpClientModule,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AppDataLinkProvider
  ]
})
export class AppModule { }
