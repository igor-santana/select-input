import { LightningElement, api, track } from 'lwc';

const WAIT_TIME = 100;

export default class SelectInput extends LightningElement {

    @api label;
    @api validation;
    
    @api
    get value() {
      return this._value;
    }
    set value(value) {
      this._value = value;
    }

    @api 
    get options() {
      return this._options;
    }
    set options(value) {
      this._options = value;
    }

    @track isDropdownOpen = false;
    @track inputHasFocus = false;
    @track listboxHasFocus = false;
    @track currentIndex;
    @track timer;
    @track _value = '';
    @track _options = [];
    @track availableOptions = [];
    @track isValid = false;

    connectedCallback() {
      for(let x = 0; x <= 20; x++) {
        this.options.push({ value: `(19) 9875 854${x}`, label: `(19) 9875 854${x}` });
      }
      this.availableOptions = this.options;
    }

    filterOptions(filterValue) {
      if(filterValue) {
        this.availableOptions = this.options.filter(option => option.label.includes(filterValue));
        if(this.availableOptions.length <= 0) this.closeDropdown();
        else this.openDropdown();
      } else {
        this.availableOptions = this.options;
        this.openDropdown();
      }
    }

    get hasLabel() {
        return !!this.label;
    }

    get hasFocus() {
        return this.inputHasFocus || this.listboxHasFocus;
    }

    get computedDropdownTriggerClass() {
        let classes = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        if(this.isDropdownOpen) classes += ' slds-is-open';
        return classes;
    }

    get computedInputClass() {
        let classes = 'slds-combobox__input slds-input';
        if(this.hasFocus) classes += ' slds-has-focus';
        return classes;
    }

    openDropdown() {
        this.isDropdownOpen = true;
    }

    closeDropdown() {
        this.isDropdownOpen = false;
    }

    toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    manageDropdown() {
        window.clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            if(this.hasFocus) {
                this.openDropdown();
            } else this.closeDropdown();
        }, WAIT_TIME);
    }

    handleInputClick() {
        console.log('input click');
        this.toggleDropdown();
    }

    handleInputFocus() {
        this.inputHasFocus = true;
        this.manageDropdown();
    }

    handleInputBlur() {
        this.inputHasFocus = false;
        this.manageDropdown();
    }

    handleListboxFocus(event) {
        this.listboxHasFocus = true;
        this.manageDropdown();
    }

    handleListboxBlur(event) {
        this.listboxHasFocus = false;
        this.manageDropdown();
    }

    handleListboxScroll(event) {
        event.stopPropagation();
    }

    handleItemHover(event) {
      if(event.target.index === this.currentIndex) return;
      const options = this.template.querySelectorAll('c-select-input-item');
      if(options?.length > 0) {
        options[this.currentIndex]?.removeHighlight();
      }
      event.target.highlight();
      this.setCurrentIndex(event.target.index);
    }

    setCurrentIndex(index) {
      this.currentIndex = index;
    }

    handleKeyDown(event) {
      if(event.code === 'ArrowDown') {
        event.preventDefault();
        this.setNextPosition();
      }
      else if(event.code === 'ArrowUp') {
        event.preventDefault();
        this.setPreviousPosition();
      }
      else if(event.code === 'Enter') {
        this.openDropdownOrSelectItem();
      }
      else if(event.code === 'Escape') {
        this.closeDropdown();
      }
      else {
        this.clearCurrentIndex();
      }
    }

    clearCurrentIndex() {
      if(Number.isInteger) {
        const options = this.template.querySelectorAll('c-select-input-item');
        if(options?.length > 0) {
          options[this.currentIndex]?.removeHighlight();
        }
      }
      this.setCurrentIndex(undefined);
    }

    setNextPosition() {
      const lastPosition = this.options.length - 1;
      const newIndex = (Number.isInteger(this.currentIndex) && this.currentIndex !== lastPosition) ? 
        this.currentIndex + 1 : 0;
      this.highlightItem(newIndex);
    }

    setPreviousPosition() {
      const lastPosition = this.options.length - 1;
      const newIndex = (Number.isInteger(this.currentIndex) && this.currentIndex !== 0) ? 
        this.currentIndex - 1 : lastPosition;
      this.highlightItem(newIndex);
    }

    highlightItem(newIndex) {
      const options = this.template.querySelectorAll('c-select-input-item');
      if(options?.length > 0) {
        if(Number.isInteger(this.currentIndex)) options[this.currentIndex]?.removeHighlight();
        options[newIndex]?.highlight();
        options[newIndex]?.scrollIntoViewIfNeeded();
        this.setCurrentIndex(newIndex);
      }
    }

    openDropdownOrSelectItem() {
      if(this.isDropdownOpen && Number.isInteger(this.currentIndex)) {
        const item = this.availableOptions[this.currentIndex];
        const index = this.currentIndex;
        this.selectItem({ item, index });
      }
      else if(!this.isDropdownOpen) this.openDropdown();
      else this.closeDropdown();
    }

    handleItemSelect(event) {
      this.selectItem(event.detail);
    }

    selectItem({ item, index }) {
      this.setCurrentIndex(index);
      this.closeDropdown();
      this._value = item.value;
    }

    handleChange(event) {
      this.isValid = this.validation(event);
      console.log(event.target.value);
      this.filterOptions(event.target.value);
      this._value = event.target.value;
    }

}