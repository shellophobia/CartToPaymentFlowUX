"use strict";

// isolating the js code
(function() {
  var cartApp = {
    cartTotal: 0,
    cartItemCount: 0,
    cartCountEl: document.querySelector('#cart-count'),
    cartTotalEl: document.querySelector('#cart-total'),
    
    initApp: function() {
      this.cartTotal = this.cartTotalEl.getAttribute('data-total');
      this.cartItemCount = this.cartCountEl.getAttribute('data-count');
      this.bindEvents();
    },
    
    removeItem: function(e) {
      var itemContainer = this.getNearestParent(e.target, 'cart-item-container');
      this.forEachLoop(document.querySelectorAll('.overlay'), function(el) {
        el.classList.add('hide');
      });
      itemContainer.querySelector('.cart-remove-item').classList.remove('hide');
    },
    
    editItem: function(e) {
      var itemContainer = this.getNearestParent(e.target, 'cart-item-container');
      this.forEachLoop(document.querySelectorAll('.overlay'), function(el) {
        el.classList.add('hide');
      });
      itemContainer.querySelector('.cart-edit-item').classList.remove('hide');
    },
    
    removeYes: function(e) {
      var self = this;
      var itemContainer = this.getNearestParent(e.target, 'cart-item-container');
      itemContainer.classList.add('hide');
      
      this.cartItemCount -= itemContainer.getAttribute('data-quant');
      this.cartCountEl.textContent = this.cartItemCount;
      this.cartCountEl.setAttribute('data-count', this.cartItemCount);
      
      this.cartTotal -= itemContainer.getAttribute('data-total');
      this.cartTotalEl.textContent = this.cartTotal;
      this.cartTotalEl.setAttribute('data-total', this.cartTotalEl);
      this.forEachLoop(document.querySelectorAll('.cart-total'), function(el) {
        el.textContent = self.cartTotal;
      });
      
    },
    
    restrictLength: function(e) {
      if (e.target.value.length > parseInt(e.target.getAttribute("maxlength"))) {
        e.target.value = e.target.value.slice(0, parseInt(e.target.getAttribute('maxlength')));
      }
    },
    
    closeOverlay: function(e) {
      this.getNearestParent(e.target, 'overlay').classList.add('hide');
    },
    
    saveContent: function(e) {
      var self = this;
      var overlay = this.getNearestParent(e.target, 'overlay');
      var size = overlay.querySelector('.size.selected').textContent.trim();
      var quantity = overlay.querySelector('.quant-val').value;
      var cartContainer = this.getNearestParent(overlay, 'cart-item-container');
      
      // send an api call to server with these values to check if its possible to serve.
      // I have put a dummy code that calcualates the new price based on quantity, with no effect on size.
      
      cartContainer.querySelector('.item-size').textContent = size;
      cartContainer.querySelector('.item-quant').textContent = quantity;
      var price = parseInt(cartContainer.getAttribute('data-price')) - parseInt(cartContainer.getAttribute('data-discount'));
      var total = parseInt(price) * parseInt(quantity);
      var oldTotal = cartContainer.getAttribute('data-total');
      cartContainer.setAttribute('data-total', total);
      cartContainer.querySelector('.item-total').textContent = total;
      this.cartTotal = this.cartTotal - oldTotal + total;
      
      this.cartTotalEl.textContent = this.cartTotal;
      this.cartTotalEl.setAttribute('data-total', this.cartTotalEl);
      this.forEachLoop(document.querySelectorAll('.cart-total'), function(el) {
        el.textContent = self.cartTotal;
      });
      
      overlay.classList.add('hide');
    },
    
    sizeSelect: function(e) {
      var self = this;
      var sizeEls = e.target.parentNode.querySelectorAll('.size');
      this.forEachLoop(sizeEls, function(el) {
        el.classList.remove('selected');
      });
      e.target.classList.add('selected');
    },
    
    unitQuantChange: function(type, e) {
      var quantInput = e.target.parentNode.querySelector('.quant-val');
      if (type == 'incr') {
        if (quantInput.value == 9) {
          return false;
        }
        quantInput.value = parseInt(quantInput.value) + 1;
      } else {
        if (quantInput.value == 1) {
          return false;
        }
        quantInput.value = parseInt(quantInput.value) - 1;
      }
    },
    
    addWishlist: function(e) {
      this.removeYes(e);
      this.showToastMessage("Item has been successfully added to wishlist!");
    },
    
    
    // Ideally on adding pincode the state and city fields should get automatically populated
    
    openAddressModal: function(e, param) {
      if (param == undefined) {
        document.querySelector('.modal-title').textContent = "ADD A NEW ADDRESS";
      }
      document.querySelector('.modal-overlay').classList.remove('hide');
      document.querySelector('.address-book-modal').classList.remove('hide');
      window.scrollTo(0,0);
    },
    
    closeAddressModal: function(e) {
      document.querySelector('.modal-overlay').classList.add('hide');
      document.querySelector('.address-book-modal').classList.add('hide');
      this.forEachLoop(document.querySelectorAll('.add-address-form input[type="text"]'), function(el) {
        el.value = "";
      });
    },
    
    editAddress: function(e) {
      var shippingCard = this.getNearestParent(e.target, 'shipping-card');
      
      var addrForm = document.querySelector('.add-address-form');
      addrForm.querySelector('input[name="name"]').value = shippingCard.querySelector('.addr-name').textContent.trim();
      addrForm.querySelector('input[name="pincode"]').value = shippingCard.querySelector('.addr-pin').textContent.trim();
      addrForm.querySelector('input[name="addr-1"]').value = shippingCard.querySelector('.addr-1').textContent.trim();
      addrForm.querySelector('input[name="addr-2"]').value = shippingCard.querySelector('.addr-2').textContent.trim();
      addrForm.querySelector('input[name="addr-3"]').value = shippingCard.querySelector('.addr-3').textContent.trim();
      addrForm.querySelector('input[name="city"]').value = shippingCard.querySelector('.addr-city').textContent.trim();
      addrForm.querySelector('input[name="state"]').value = shippingCard.querySelector('.addr-state').textContent.trim();
      
      document.querySelector('.modal-title').textContent = "EDIT ADDRESS";
      this.openAddressModal(e, 'dont');
    },
    
    tabChange: function(e) {
      var currentTarget = this.getNearestParent(e.target, 'nav-tab');
      this.forEachLoop(currentTarget.parentNode.querySelectorAll('.nav-tab'), function(el) {
        el.classList.remove('active');
      });
      this.forEachLoop(document.querySelectorAll(".payment-option"), function(el) {
        el.classList.remove('active');
      });
      currentTarget.classList.add('active');
      document.querySelector(currentTarget.getAttribute('data-target')).classList.add('active');
    },
    
    toggleSelectedCard: function(e) {
      this.forEachLoop(document.querySelectorAll('.card-holder'), function(el) {
        el.classList.remove('selected');
      });
      var currentTarget = this.getNearestParent(e.target, 'card-holder');
      e.currentTarget.classList.add('selected');
    },
    
    toggleStep: function(e) {
      if (e.target.getAttribute('data-disabled') === "true") return false;
      this.forEachLoop(document.querySelectorAll('.buy-step'), function(el) {
        document.querySelector(el.getAttribute('data-target')).classList.add('hide');
        el.classList.remove('current');
      });
      document.querySelector(e.target.getAttribute('data-target')).classList.remove('hide');
      e.target.classList.add('current');
    },
    
    proceedToNext: function(e) {
      document.querySelector('.buy-step[data-target="#cart-container"]').setAttribute('data-disabled', 'false');
      document.querySelector('.buy-step[data-target="' + e.target.getAttribute('data-target') + '"]').setAttribute('data-disabled', 'false');
      this.forEachLoop(document.querySelectorAll('.buy-step'), function(el) {
        document.querySelector(el.getAttribute('data-target')).classList.add('hide');
        el.classList.remove('current');
      });
      document.querySelector(e.target.getAttribute('data-target')).classList.remove('hide');
      document.querySelector('.buy-step[data-target="' + e.target.getAttribute('data-target') + '"]').classList.add('current');
      this.closeAddressModal(e);
    },
    
    openCouponDropdown: function(e) {
      document.querySelector('.coupon-dropdown').classList.add('open');
    },
    
    couponSelect: function(e) {
      var currentTarget = this.getNearestParent(e.target, 'coupon-container');
      document.querySelector('.coupon-text').value = currentTarget.getAttribute('data-code');
      document.querySelector('.coupon-dropdown').classList.remove('open');
    },
    
    closeCouponDropdown: function(e) {
      if (this.getNearestParent(e.target, 'coupons-container') === document) {
        document.querySelector('.coupon-dropdown').classList.remove('open');
      }
    },
    
    openCouponText: function(e) {
      document.querySelector('.applied-coupons').classList.add('hide');
      document.querySelector('.apply-coupons').classList.remove('hide');
    },
    
    closeCouponText: function(e) {
      document.querySelector('.apply-btn').textContent = "Edit Coupon";
      document.querySelector('.coupon-amount').textContent = "- Rs 300";
      document.querySelector('.applied-coupons .coupon-code').textContent = document.querySelector('.coupon-text').value;
      document.querySelector('.applied-coupons .coupon-code').style.display = "inline-block";
      document.querySelector('.applied-coupons').classList.remove('hide');
      document.querySelector('.apply-coupons').classList.add('hide');
      this.showToastMessage('Congrats! You just saved Rs 300!');
    },
    
    showToastMessage: function(msg) {
      window.scrollTo(0,0);
      var toastMessage = document.querySelector('.toast-message');
      toastMessage.textContent = msg;
      toastMessage.classList.add('visible');
      window.setTimeout(function() {
        toastMessage.classList.remove('visible');
      }, 2000);
    },
    
    getNearestParent: function(currentEl, parentClass) {
      if (parentClass === undefined) {
        return document;
      }
      while (currentEl !== document && !currentEl.classList.contains(parentClass)) {
        currentEl = currentEl.parentNode;
      }
      return currentEl;
    },
    
    forEachLoop: function(nodeList, callback, params) {
      var self = this;
      callback.bind(self);
      [].forEach.call(nodeList, function(el) {
        callback(el);
      });
    },
    
    // bind events on load
    bindEvents: function() {
      var self = this;
      var eventBindEls = [
        {class: '.remove-item', ev: 'click', callbackHandler: this.removeItem},
        {class: '.edit-item', ev: 'click', callbackHandler: this.editItem},
        {class: '.remove-yes', ev: 'click', callbackHandler: this.removeYes},
        {class: '.remove-no', ev: 'click', callbackHandler: this.closeOverlay},
        {class: '.edit-btn.cancel', ev: 'click', callbackHandler: this.closeOverlay},
        {class: '.edit-btn.save', ev: 'click', callbackHandler: this.saveContent},
        {class: '.size', ev: 'click', callbackHandler: this.sizeSelect},
        {class: '.quant-counter.incr', ev: 'click', callbackHandler: this.unitQuantChange, params: 'incr'},
        {class: '.quant-counter.decr', ev: 'click', callbackHandler: this.unitQuantChange, params: 'decr'},
        {class: '.add-wish', ev: 'click', callbackHandler: this.addWishlist},
        {class: '.btn-add-address', ev: 'click', callbackHandler: this.openAddressModal},
        {class: '.modal-overlay', ev: 'click', callbackHandler: this.closeAddressModal},
        {class: '.edit-address', ev: 'click', callbackHandler: this.editAddress},
        {class: '.nav-tab', ev: 'click', callbackHandler: this.tabChange},
        {class: 'input[type="number"]', ev: 'input', callbackHandler: this.restrictLength},
        {class: '.card-holder', ev: 'click', callbackHandler: this.toggleSelectedCard},
        {class: '.buy-step', ev: 'click', callbackHandler: this.toggleStep},
        {class: '.proceed', ev: 'click', callbackHandler: this.proceedToNext},
        {class: '.coupon-container', ev: 'click', callbackHandler: this.couponSelect},
        {class: '.coupon-text', ev: 'focus', callbackHandler: this.openCouponDropdown},
        {class: 'body', ev: 'click', callbackHandler: this.closeCouponDropdown},
        {class: '.apply-coupon', ev: 'click', callbackHandler: this.openCouponText},
        {class: '.apply-coupon-btn', ev: 'click', callbackHandler: this.closeCouponText}
      ];
      
      // The wishlist the section which can be used to re buy the item some other time.
      
      eventBindEls.forEach(function(item) {
        self.forEachLoop.bind(self);
        self.forEachLoop(document.querySelectorAll(item.class), function(el) {
          if (item.params) {
            el.addEventListener(item.ev, item.callbackHandler.bind(self, item.params));
          } else {
            el.addEventListener(item.ev, item.callbackHandler.bind(self));
          }
        });
      });
    }
  }

  window.onload = cartApp.initApp.call(cartApp);
})();