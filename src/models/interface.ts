
export interface IUser {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  type: string;
  date_created: string;
  tokenid: string;
  devicetoken: string;
  locationid: string;
  status:any;
  ratevalue: any;
}
export interface ICustomer {
  id: number;
  userid: any;
  address: string;
}
export interface ISupplier{
  id: number;
  userid: any;
  business_name: string;
  nafdac_number: string;
  address: string;
  status: string;
  supplier_code: string;
  payment_planid: any;
  water_catid: any;
  ratevalue: any;
  price: any;
  payment_date: any;
  payment_duedate: any;
  account_bal: any;
  transaction_number: any;
  admin_account_bal: any;
  
}
export interface IAdmin{
  id: number;
  userid: any;
  address: string;
}

export interface ILocation {
  id: number;
  name: string;
  fees: string;
  DeliveryAddress: any;
  DiscountPoint:any;
}

export class IRecovery {
  id: number;
  userid: string;
  question: string;
  answer: string;
}
export class IProduct {
  id: number;
  name: string;
  price: any;
  properties: any;
  product_catid: any;
  supplier_userid:any;
  Amount: any;
  Quantity: any;
  PropName:any;
  PropValue:any;
  ProductID:any;
}
export class IProductCategories {
  id: number;
  name: string;
  water_catid: number;
}
export class IMessage {
  id: number;
  date: Date;
  time: any;
  subject: string;
  from_member_id: number;
  to_member_id: number;
  body: string;
  is_read: any;
  sendername: any;
  msgdate: any;
  msgtime: any;
  recievername: any;
}
export class ILga{
  id: number;
  lga: string;
}
export class IStates{
  id: number;
  state: string;
}
export class IWaterCategory{
  id: number;
  name: string;
}
export class IPaymentPlan{
  id: number;
  name: string;
}
export class IRatings{
  id: number;
  value: string;
  supplier_userid: any;
  customer_userid: any;
}

export class IOrder {
  id: number;
  customer_userid: any;
  supplier_userid: any;
  productdetails: any;
  status: string;
  substatus: string;
  bookedtime: any;
  bookeddate: any;
  deliverytime: any;
  deliverydate: any;
  ordernumber: any;
  confirmedby_userid: any;
  amount: any;
  deliveryaddress: any;
  deliveryfee:any;
  paymentplan:any;
  CustomerName:any;
  CustomerPhone:any;
  CustomerID:any;
}