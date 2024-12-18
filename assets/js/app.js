const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");

const productsDOM = document.querySelector(".products-center");
const cartContent = document.querySelector(".cart-content");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const clearCart = document.querySelector(".clear-cart");
let cart = [];

import { productsData } from "./products.js";

class Products {
  getProducts() {
    return productsData;
  }
}

let buttsDOM = [];

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
          <div class="img-container">
            <img src= ${item.imageUrl} class="product-img" />
          </div>
          <div class="product-desc">
            <p class="product-price">$ ${item.price}</p>
            <p class="product-title">${item.title}</p>
          </div>
          <button class="btn add-to-cart" data-id="${item.id}">
            add to cart
          </button>
        </div>`;
      productsDOM.innerHTML = result;
    });
  }
  getAddToCartBtns() {
    const addToCartBtns = [...document.querySelectorAll(".add-to-cart")];
    buttsDOM = addToCartBtns;
    addToCartBtns.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.textContent = "in cart";
        btn.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        btn.textContent = "in cart";
        btn.disabled = true;
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };

        cart = [...cart, addedProduct];
        Storage.saveCart(cart);
        this.setCartValue(cart);
        this.addCartItem(addedProduct);
      });
    });
  }
  setCartValue(cart) {
    let tempCartItems = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItems += curr.quantity;
      return acc + curr.price * curr.quantity;
    }, 0);
    cartTotal.textContent = `total price : ${totalPrice.toFixed(2)} $`;
    cartItems.textContent = tempCartItems;
  }

  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img class="cart-item-img" src=${cartItem.imageUrl} />
            <div class="cart-item-desc">
              <h4>${cartItem.title}</h4>
              <h5>$ ${cartItem.price}</h5>
            </div>
            <div class="cart-item-conteoller">
              <i class="fas fa-chevron-up" data-id="${cartItem.id}"></i>
              <p>${cartItem.quantity}</p>
              <i class="fas fa-chevron-down" data-id="${cartItem.id}"></i>
            </div>
            <i class="far fa-trash-alt" data-id="${cartItem.id}"></i>`;
    cartContent.append(div);
  }
  setupApp() {
    cart = Storage.getCart() || [];
    cart.forEach((cartItem) => {
      this.addCartItem(cartItem);
      this.setCartValue(cart);
    });
  }

  cartLogic() {
    clearCart.addEventListener("click", () => this.clearCart());
    cartContent.addEventListener("click", (e) => {
      if (e.target.classList.contains("fa-chevron-up")) {
        const addQuantity = e.target;
        const addedItem = cart.find(
          (cItem) => cItem.id == addQuantity.dataset.id
        );
        addedItem.quantity++;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        addQuantity.nextElementSibling.textContent = addedItem.quantity;
      }
      if (e.target.classList.contains("fa-chevron-down")) {
        const decQuantity = e.target;
        const decreasedItem = cart.find(
          (cItem) => cItem.id == decQuantity.dataset.id
        );
        if (decreasedItem.quantity === 1) {
          this.removeItem(decreasedItem.id);
          cartContent.removeChild(decQuantity.parentElement.parentElement);
          return;
        }
        decreasedItem.quantity--;
        this.setCartValue(cart);
        Storage.saveCart(cart);
        decQuantity.previousElementSibling.textContent = decreasedItem.quantity;
      }
      if (e.target.classList.contains("fa-trash-alt")) {
        const removeItem = e.target;
        const _removedItem = cart.find(
          (cItem) => cItem.id == removeItem.dataset.id
        );
        this.removeItem(_removedItem.id);
        Storage.saveCart(cart);
        cartContent.removeChild(removeItem.parentElement);
      }
    });
  }

  clearCart() {
    cart.forEach((cItem) => this.removeItem(cItem.id));
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }

  removeItem(id) {
    cart = cart.filter((cItem) => cItem.id !== id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    this.getSingleButton(id);
  }

  getSingleButton(id) {
    const button = buttsDOM.find(
      (btn) => parseInt(btn.dataset.id) === parseInt(id)
    );
    button.textContent = "add to cart";
    button.disabled = false;
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // console.log("loaded");
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData);
  // console.log(productsData);
});

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
