/* input-case-enforcer-no-query v0.1 - */

window.inputCaseEnforcer = { // Alternative object version of the inputCaseEnforcer in vanilla Js

  element: null,
  typeArgument: '',
  optionalDestroy: '',
  isClasses: false,

  q: function(incoming) { return document.querySelector(incoming); },

  init: function(incomingElement, incomingType, optionalDestroy = null) {
    if (incomingElement.split(".").length > 1) {
      this.elements = document.querySelectorAll(incomingElement);
      console.log(this.elements);
      this.isClasses = true;
    } else {
      this.element = this.q(incomingElement);
    }

    this.typeArgument = incomingType;
    this.optionalDestroy = optionalDestroy;

    if (this.isClasses) {
      this.enforcementDriverAll(incomingType, optionalDestroy);
    } else {
      this.enforcementDriver(incomingType, optionalDestroy);
    }
  },

  enforcementDriverAll: function(){ // An equivalent version of caseEnforcer

    if(!this.typeArgument || ['uppercase','lowercase','capitalize','destroy'].indexOf(this.typeArgument) === -1){
      throw("Error: Allowed values for caseEnforcer function are 'uppercase','lowercase','capitalize', or 'destroy'");
    }

    let checkTheseAttributes = [];

    for (let index = 0; index < this.elements.length; index++){

      checkTheseAttributes.push(this.elements[index].getAttribute('data-input-case'));

      if(this.optionalDestroy === 'destroy' || (checkTheseAttributes[index] != null && typeof(checkTheseAttributes[index]) != undefined)){
        if(this.optionalDestroy === 'destroy'){
          this.elements[index].style.textTransform = 'none';
          return this;
        } else {
          this.resetSpecificInputToDefault(this.elements[index]);
        }
      }

      this.setupCaseEnforcerSpecific(this.elements[index]);
    }

    return this;
  },

  enforcementDriver: function(){ // An equivalent version of caseEnforcer

    if(!this.typeArgument || ['uppercase','lowercase','capitalize','destroy'].indexOf(this.typeArgument) === -1){
      throw("Error: Allowed values for caseEnforcer function are 'uppercase','lowercase','capitalize', or 'destroy'");
    }

    let checkThisAttribute = this.element.getAttribute('data-input-case');

    if(this.optionalDestroy === 'destroy' || typeof(checkThisAttribute != undefined)){
      if(this.optionalDestroy === 'destroy'){
        this.element.style.textTransform = 'none';
        return this;
      } else {
        this.resetInputToDefault();
      }
    }

    this.setupCaseEnforcer();

    return this;
  },

  resetSpecificInputToDefault : function(incomingInput) {
    incomingInput.classList.remove('input-case');
    incomingInput.removeEventListener('input', this.updateCase);
  },

  resetInputToDefault : function() {
    this.element.classList.remove('input-case');
    this.element.removeEventListener('input', this.updateCase);
  },
  setupCaseEnforcerSpecific: function(incomingInput) {
    incomingInput.style.textTransform = this.typeArgument + ";";
    incomingInput.setAttribute('data-input-case', this.typeArgument);
    incomingInput.classList.add('input-case-enforcer');

    this.watchForChangeSpecific(incomingInput); // Watch for change on this

    this.updateCase(true, incomingInput); // init on page load
  },

  setupCaseEnforcer: function() {
    this.element.style.textTransform = this.typeArgument + ";";
    this.element.setAttribute('data-input-case', this.typeArgument);
    this.element.classList.add('input-case-enforcer');

    this.watchForChange(); // Watch for change on this

    this.updateCase(true, this.element); // init on page load
  },

  watchForChangeSpecific: function(incomingInput) { // Watch for change to handle event listener
    incomingInput.addEventListener('input', this.updateCase);
  },

  watchForChange: function() { // Watch for change to handle event listener
    this.element.addEventListener('input', this.updateCase);
  },

  updateCase: function(optionalOnLoad, optionalElement){ // Update the value for the specific data attribute case, takes optional parameter for onload
    let thisElement = this;

    if (optionalOnLoad === true) { thisElement = optionalElement; }

    let mode = thisElement.getAttribute('data-input-case');

    if(mode === 'uppercase'){
      thisElement.value = thisElement.value.toUpperCase();
    }else if(mode === 'lowercase'){
      thisElement.value = thisElement.value.toLowerCase();
    }else if(mode === 'capitalize'){
      thisElement.value = thisElement.value.replace(/(^|\s)[a-z]/g, function(f){ return f.toUpperCase(); });
    }
  }
};
