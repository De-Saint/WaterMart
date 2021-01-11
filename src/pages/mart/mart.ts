import { Component } from '@angular/core';
import {  NavController, NavParams, Platform } from 'ionic-angular';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free';
// import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free';
import { MartSupplierListPage } from '../mart-supplier-list/mart-supplier-list';



@Component({
  selector: 'page-mart',
  templateUrl: 'mart.html',
})
export class MartPage {
  Mart: string;
  SHOP: string;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, public platform: Platform, 
    public admobFree: AdMobFree) {
      this.Mart = "domest";
      this.SHOP = "BuyDomesticWater";
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      var admobid = {
        banner: 'ca-app-pub-1670957175791324/3953958666',
        // interstitial: 'ca-app-pub-1670957175791324/4636484940',
        reward: 'ca-app-pub-1670957175791324/1894771533'
      };


      const bannerConfig: AdMobFreeBannerConfig = {
        id: admobid.banner,
        isTesting: true,
        autoShow: true
      };
      this.admobFree.banner.config(bannerConfig);
      this.admobFree.banner.prepare().then((res) => { 
          console.log(res);
        }).catch((e) => {
          console.log(e);
        });


      // const interstitialConfig: AdMobFreeInterstitialConfig = {
      //   id: admobid.interstitial,
      //   isTesting: true,
      //   autoShow: true
      // }
      // this.admobFree.interstitial.config(interstitialConfig);
      // this.admobFree.interstitial.prepare().then((res) => {
      //   console.log(res);
      // }).catch((e) => {
      //   console.log(e);
      // });

      const rewardVidConfig: AdMobFreeRewardVideoConfig = {
        id: admobid.reward,
        isTesting: true,
        autoShow: true
      }
      this.admobFree.rewardVideo.config(rewardVidConfig);
      this.admobFree.rewardVideo.prepare().then((res) => {  
        console.log(res);
      }).catch(e => {
          console.log(e);
        });

    });
  }
 

  getSuppliers(catid) {
    this.navCtrl.push(MartSupplierListPage, { catid });
  }


  getBuyDomesticWater() {
    this.SHOP = "BuyDomesticWater";
  }
  getBuyDomesticAccessory() {
  
  }
  getBuyIndustrialWater() {
    
  }
  
  
}


