import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { ToastController, AlertController, Platform } from 'ionic-angular';
import { AppRate } from '@ionic-native/app-rate';
import {IUser, IStates, ILga, IPaymentPlan, IWaterCategory, IRecovery , IMessage, ILocation} from '../../models/interface';
@Injectable()
export class AppDataLinkProvider {
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_WELCOME = 'hasSeenWelcome';
  year: any;
  today: any;
  hour: any;
  // baseUrl: string = 'http://localhost:8084/WaterMart/'; 
  baseUrl: string = 'http://209.58.143.202:33386/WaterMart/';
  
  constructor(public toastCtrl: ToastController,public appRate: AppRate,
    public alertCtrl: AlertController, public platform: Platform,
    public storage: Storage, public http: HttpClient) {
      this.platform.ready().then(() => {
        this.appRate.preferences = {
          displayAppName: 'WaterMart',
          usesUntilPrompt: 4,
          promptAgainForEachNewVersion: false,
          storeAppURL: {
            ios: 'com.baesicsolutions.watermart',
            android: 'market://details?id=com.baesicsolutions.watermart'
          },
          customLocale: {
            title: "Rate WaterMart",
            message: "If you enjoy using WaterMart, would you mind taking a moment to rate it?",
            cancelButtonLabel: "No, Thanks",
            rateButtonLabel: "Rate",
            laterButtonLabel: "Later"
          }
        };
      });
  }

  login(emailphone, password) {
    let loginurl = this.baseUrl + 'UserServlet';
    let type = "Login";
    let logindata = JSON.stringify({ emailphone, password, type });
    return this.http.post(loginurl, logindata)
    .pipe(map(this.responseData), catchError(this.handleError));
  }

  getStates(){
    let statesurl = this.baseUrl + 'UserServlet';
    let type = "getStates";
    let statesdata = JSON.stringify({ type });
    return this.http.post(statesurl, statesdata)
    .pipe(map(res => {return <IStates[]>res;}));
  }
  getPaymentPlan(){
    let url = this.baseUrl + 'UserServlet';
    let type = "getPaymentPlan";
    let data = JSON.stringify({ type });
    return this.http.post(url, data)
    .pipe(map(res => {return <IPaymentPlan[]>res;}));
  }
  getWaterCategory(){
    let url = this.baseUrl + 'UserServlet';
    let type = "getWaterCategory";
    let data = JSON.stringify({ type });
    return this.http.post(url, data)
    .pipe(map(res => {return <IWaterCategory[]>res;}));
  }
  getLga(stateid){
    let lgaurl = this.baseUrl + 'UserServlet';
    let type = "getLGAs";
    let lgadata = JSON.stringify({ stateid, type });
    return this.http.post(lgaurl, lgadata)
    .pipe(map(res => {return <ILga[]>res;}));
  }

  VerifyEmail(email) {
    let verifyurl = this.baseUrl + 'UserServlet';
    let type = "getRecoveryDetails";
    let verifydata = JSON.stringify({ email, type });
    return this.http.post(verifyurl, verifydata)
    .pipe(map(res => {return <IRecovery>res;}));
  }
  ResetPassword(userid, password) {
    let loginurl = this.baseUrl + 'UserServlet';
    let type = "ResetPassword";
    let logindata = JSON.stringify({ userid, password, type });
    return this.http.post(loginurl, logindata)
    .pipe(map(res => {return res;}));
  }

  UserRegistration(email, phone, password, firstname, lastname, question, answer, stateid, lgaid, address) {
    let signupurl = this.baseUrl + 'UserServlet';
    let type = "UserRegistration";
    let signupdata = JSON.stringify({ type, email, phone, password, firstname, lastname, question, answer, stateid, lgaid, address });
    return this.http.post(signupurl, signupdata)
      .pipe(map(res => {return res;}));
  }
  SupplierRegistration(bizname, nafdacnumber, email, phone, password, watertype, payplan, firstname, lastname, question, answer, stateid, lgaid, address) {
    let signupurl = this.baseUrl + 'UserServlet';
    let type = "SupplierRegistration";
    let signupdata = JSON.stringify({ type, bizname, nafdacnumber, email, phone, password, watertype, payplan, firstname, lastname, question, answer, stateid, lgaid, address });
    return this.http.post(signupurl, signupdata)
      .pipe(map(res => {return res;}));
  }
  checkEmail(email) {
    let url = this.baseUrl + 'UserServlet';
    let type = "checkEmail";
    let data = JSON.stringify({ email, type });
    console.log(data);
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  UpdateProfile(id, bizname, nafdacnumber, firstname, lastname, phone, password) {
    let url = this.baseUrl + 'UserServlet';
    let type = "UpdateProfile";
    let data = JSON.stringify({ type, id, bizname, nafdacnumber, firstname, lastname, phone, password });
    console.log(data);
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }


  getInboxMessages(userid) {
    let url = this.baseUrl + 'UserServlet';
    let type = "Message";
    let option = "inbox";
    let data = JSON.stringify({ userid, type, option });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));

  }
  GetInboxMessages(userid) {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "GetInboxMessages";
    let data = JSON.stringify({ userid, type });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));

  }
  GetSentMessages(userid) {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "GetSentMessages";
    let data = JSON.stringify({ userid, type });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  getSentMessages(userid) {
    let url = this.baseUrl + 'UserServlet';
    let type = "Message";
    let option = "sent";
    let data = JSON.stringify({ userid, type, option });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }

  deleteMessage(messageid) {
    let url = this.baseUrl + 'UserServlet';
    let type = "DeleteMessage";
    let data = JSON.stringify({ type, messageid });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  MarkAsRead(messageid) {
    let url = this.baseUrl + 'UserServlet';
    let type = "MarkAsRead";
    let data = JSON.stringify({ type, messageid });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }


  getMsgDetails(messageid) {
    let url = this.baseUrl + 'UserServlet';
    let type = "MessageDetails";
    let jsondata = JSON.stringify({ messageid, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return <IMessage>res;}));
  }

  SendMessage(fromuserid, touserid, msgTitle, msgBody) {
    let type = "SendMessage";
    let url = this.baseUrl + 'UserServlet';
    let jsondata = JSON.stringify({ fromuserid, touserid, msgTitle, msgBody, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }
  PlaceOrder(userid, supplieruserid, orderdetails, totalamount, deliveryaddress, deliveryfee) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "PlaceOrder";
    let jsondata = JSON.stringify({ userid, supplieruserid, orderdetails, totalamount, deliveryaddress, deliveryfee, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }

  getPlacedOrders(userid, ordertype, usertype) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "getPlacedOrders";
    let jsondata = JSON.stringify({ userid, ordertype, usertype, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }
  GetOrderDetails(orderid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "GetOrderDetails";
    let jsondata = JSON.stringify({ orderid, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }
  CancelOrder(userid, orderid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "CancelOrder";
    let jsondata = JSON.stringify({ userid, orderid, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }
  DeleteOrder(orderid, userid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "DeleteOrder";
    let jsondata = JSON.stringify({ orderid, userid, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }
  AcceptOrder(orderid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "AcceptOrder";
    let jsondata = JSON.stringify({ orderid, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }
  ConfirmOrder(orderid, userid, usertype) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "ConfirmOrder";
    let jsondata = JSON.stringify({ orderid, userid, usertype, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }

  getLocation(usertype, userid) {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "getLocation";
    let data = JSON.stringify({ type, usertype, userid });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }

  AddLocation(userid, name, fees) {
    let loginurl = this.baseUrl + 'GeneralServlet';
    let type = "AddLocation";
    let logindata = JSON.stringify({ userid, name, fees, type });
    return this.http.post(loginurl, logindata)
    .pipe(map(res => {return res;}));
  }
  UpdateLocation(id, name, fees) {
    let loginurl = this.baseUrl + 'GeneralServlet';
    let type = "UpdateLocation";
    let logindata = JSON.stringify({ id, name, fees, type });
    return this.http.post(loginurl, logindata)
    .pipe(map(res => {return res;}));
  }
  DeleteLocation(locationid) {
    let loginurl = this.baseUrl + 'GeneralServlet';
    let type = "DeleteLocation";
    let logindata = JSON.stringify({ locationid, type });
    return this.http.post(loginurl, logindata)
    .pipe(map(res => {return res;}));
  }
  getProducts(userid, usertype) {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "GetProducts";
    let data = JSON.stringify({ type, userid, usertype });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  DeleteProduct(productid) {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "DeleteProduct";
    let jsondata = JSON.stringify({ productid, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }
  getProductCategories(userid) {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "getProductCategories";
    let data = JSON.stringify({ type, userid });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  AddProduct(userid, catid, name, price, properties) {
    let loginurl = this.baseUrl + 'GeneralServlet';
    let type = "AddProduct";
    let logindata = JSON.stringify({userid, catid, name, price, properties, type });
    return this.http.post(loginurl, logindata)
    .pipe(map(res => {return res;}));
  }
  GetProductDetails(productid) {
    let type = "getProductDetails";
    let url = this.baseUrl + 'GeneralServlet';
    let jsondata = JSON.stringify({ productid, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }
  UpdateProduct(productid, name, price, properties) {
    let loginurl = this.baseUrl + 'GeneralServlet';
    let type = "UpdateProduct";
    let logindata = JSON.stringify({ productid, name, price, properties, type });
    return this.http.post(loginurl, logindata)
    .pipe(map(res => {return res;}));
  }
  getBuyDomesticWater() {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "GetBuyDomesticWater";
    let data = JSON.stringify({ type });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  getBuyDomesticAccessory() {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "GetBuyDomesticAccessory";
    let data = JSON.stringify({ type });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  getBuyIndustrialWater() {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "GetBuyIndustrialWater";
    let data = JSON.stringify({ type });
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  getMartSuppliers(catid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "GetMartSuppliers";
    let data = JSON.stringify({ type , catid});
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  getMartSupplierDetails(productid) {
    let url = this.baseUrl + 'BookingServlet';
    let type = "GetMartSupplierDetails";
    let data = JSON.stringify({ type , productid});
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  rateSuplier(ratevalue, supplieruserid, customeruserid) {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "RateSupplier";
    let data = JSON.stringify({ type , ratevalue, supplieruserid, customeruserid});
    return this.http.post(url, data)
    .pipe(map(res => {return res;}));
  }
  getlocationDetails(locationid): Observable<ILocation> {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "GetlocationDetails";
    let jsondata = JSON.stringify({ locationid, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return <ILocation>res;}));
  }
  GetAvailableBalance(userid, usertype) {
    let url = this.baseUrl + 'GeneralServlet';
    let type = "GetBalances";
    let jsondata = JSON.stringify({ userid, usertype, type });
    return this.http.post(url, jsondata)
    .pipe(map(res => {return res;}));
  }
  DeleteCustomer(userid) {
    let transurl = this.baseUrl + 'GeneralServlet';
    let type = "DeleteCustomer";
    let transdata = JSON.stringify({ type, userid });
    return this.http.post(transurl, transdata)
    .pipe(map(res => {return res;}));
  }
  ChangePaymenPlan(userid) {
    let transurl = this.baseUrl + 'GeneralServlet';
    let type = "ChangePaymenPlan";
    let transdata = JSON.stringify({ type, userid });
    return this.http.post(transurl, transdata)
    .pipe(map(res => {return res;}));
  }
  AccountAction(userid, action) {
    let transurl = this.baseUrl + 'GeneralServlet';
    let type = "AccountAction";
    let transdata = JSON.stringify({ type, userid, action});
    return this.http.post(transurl, transdata)
    .pipe(map(res => {return res;}));
  }
  DeleteSupplier(userid) {
    let transurl = this.baseUrl + 'GeneralServlet';
    let type = "DeleteSupplier";
    let transdata = JSON.stringify({ type, userid });
    return this.http.post(transurl, transdata)
    .pipe(map(res => {return res;}));
  }
  getCustomers(count) {
    let usersurl = this.baseUrl + 'GeneralServlet';
    let type = "GetCustomers";
    let userdata = JSON.stringify({ type, count });
    return this.http.post(usersurl, userdata)
    .pipe(map(res => {return res;}));
  }
  GetAllSuppliers() {
    let usersurl = this.baseUrl + 'GeneralServlet';
    let type = "GetAllSuppliers";
    let userdata = JSON.stringify({ type });
    return this.http.post(usersurl, userdata)
    .pipe(map(res => {return res;}));
  }
  getCustomerDetails(userid) :Observable<IUser> {
    let transurl = this.baseUrl + 'GeneralServlet';
    let type = "getCustomerDetails";
    let transdata = JSON.stringify({ type, userid });
    return this.http.post(transurl, transdata)
    .pipe(map(res => {return <IUser>res;}));
  }
  
  getSuppliers(count) {
    let usersurl = this.baseUrl + 'GeneralServlet';
    let type = "GetSuppliers";
    let userdata = JSON.stringify({ type, count });
    return this.http.post(usersurl, userdata)
    .pipe(map(res => {return res;}));
  }
  GetPPTransactionSuppliers() {
    let usersurl = this.baseUrl + 'GeneralServlet';
    let type = "GetPPTransactionSuppliers";
    let userdata = JSON.stringify({ type });
    return this.http.post(usersurl, userdata)
    .pipe(map(res => {return res;}));
  }
  GetMFRateSuppliers() {
    let usersurl = this.baseUrl + 'GeneralServlet';
    let type = "GetMFRateSuppliers";
    let userdata = JSON.stringify({ type });
    return this.http.post(usersurl, userdata)
    .pipe(map(res => {return res;}));
  }

  getSupplierDetails(userid) :Observable<IUser> {
    let transurl = this.baseUrl + 'GeneralServlet';
    let type = "getSuplierDetails";
    let transdata = JSON.stringify({ type, userid });
    return this.http.post(transurl, transdata)
    .pipe(map(res => {return <IUser>res;}));
  }

  SaveAndUpdateDeviceToken(userid, devicetoken) {
    let loginurl = this.baseUrl + 'GeneralServlet';
    let type = "SaveAndUpdateDeviceToken";
    let logindata = JSON.stringify({ userid, devicetoken, type });
    return this.http.post(loginurl, logindata)
    .pipe(map(res => {return res;}));
  }



















  public responseData(res: Response) {
    let body = res;
    return body || { };
  }

  public handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }


  

  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };
  checkHasSeenWelcome() {
    return this.storage.get(this.HAS_SEEN_WELCOME).then((value) => {
      return value;
    })
  };
  SetloggedInUserDetails(loggedInUserDetails) {
    this.storage.set('loggedInUserDetails', loggedInUserDetails);
  };
  getloggedInUserDetails() {
    return this.storage.get('loggedInUserDetails').then((value) => {
      return value;
    });
  };
  displayAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }
  showToast(position: string, message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: 'Ok',
      duration: 2000,
      position: position
    });

    toast.present(toast);
  }

  getCurrentHour() {
    this.today = new Date();
    this.hour = this.today.getHours();

    if (this.hour < 10) {
      this.hour = '0' + this.hour
    }

    this.today = this.hour;
    return this.today;
  }
}
