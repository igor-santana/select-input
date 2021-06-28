import { LightningElement } from "lwc";

export default class App extends LightningElement {
  title = "Welcome to Lightning Web Components!";

  showFeatures = true;

  /**
   * Getter for the features property
   */
  get features() {
    return [
      {
        label: "Learn in the browser.",
        icon: "utility:edit",
      },
      {
        label: "View changes to code instantly with Live Compilation.",
        icon: "utility:refresh",
      },
      {
        label: "Style your components with SLDS.",
        icon: "utility:brush",
      },
    ];
  }

  validate(event) {
    event.target.value = event.target.value.replace(/\D/g,'');
    const formatPhoneNumber = (phoneNumber) => {
      phoneNumber = phoneNumber.replace(/\D/g,'');
      console.log(phoneNumber.length);
      if(phoneNumber.length <= 0) return '';
      if(phoneNumber.length >= 1 && phoneNumber.length <= 2) return '(' + phoneNumber;
      if(phoneNumber.length >= 3 && phoneNumber.length <= 6) return '(' + phoneNumber.substring(0,2) + ') ' + phoneNumber.substring(2, phoneNumber.length);
      if(phoneNumber.length >= 7 && phoneNumber.length <= 10) return '(' + phoneNumber.substring(0,2) + ') ' + phoneNumber.substring(2, 6) + ' ' + phoneNumber.substring(6, phoneNumber.length);
      if(phoneNumber.length >= 11) return '(' + phoneNumber.substring(0,2) + ') ' + phoneNumber.substring(2, 7) + ' ' + phoneNumber.substring(7, phoneNumber.length);
    };
    event.target.value = formatPhoneNumber(event.target.value);
    if(event.target.value.length >= 14) return true;
    else return false;
  }

}
