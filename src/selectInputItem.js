import { LightningElement, api, track } from 'lwc';

export default class SelectInputItem extends LightningElement {

  @api index;
  
  @api item = {
    label: '(19) 9999-9999',
    value: '(19) 9999-9999'
  };

  @track _isHighlighted = false;

  get computedItemClass() {
    let classes = 'slds-media slds-listbox__option slds-listbox__option_plain slds-media_small';
    if(this._isHighlighted) classes += ' slds-has-focus';
    return classes;
  }

  @api
  get isHighlighted() {
    return this._isHighlighted;
  }

  @api
  highlight() {
    this._isHighlighted = true;
  }

  @api
  removeHighlight() {
    this._isHighlighted = false;
  }

  toggleHighlight() {
    this._isHighlighted = !this._isHighlighted;
  }

  handleClick() {
    this.select();
  }

  handleKeyDown(event) {
    console.log('key down', event.code);
    if(event.code === 'Enter') this.select();
  }

  select() {
    this.dispatchEvent(new CustomEvent('select', { detail: { item: this.item, index: this.index } }));
  }

  

}