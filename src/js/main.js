import searchBar from './livesearch';
import  slider from './slider';

// import modal from './modal';

// variables and constants
const cartContainer = document.querySelector('.cart-container');
const productList = document.getElementById('product-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');
let cartItemID = 1;


eventListeners();
searchBar();
slider();

const modalImage = document.querySelector(".js-modal-image");
const modalOpen = document.querySelector(".js-modal");
const modalClose = document.querySelector(".js-close");
const imageList = document.querySelectorAll(".js-img-thumb");

Array.from(imageList).forEach(item => {
  item.addEventListener("click", e => {
    modalOpen.classList.add("open");
    modalImage.src = e.target.src;
  });
});

modalClose.addEventListener("click", () => {
  modalOpen.classList.remove("open");
});

// all event listeners
function eventListeners(){
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    });

    // show/hide cart container
    document.getElementById('cart-btn').addEventListener('click', () => {
        cartContainer.classList.toggle('show-cart-container');
    });

    // add to cart
    productList.addEventListener('click', purchaseProduct);

    // delete from cart
    cartList.addEventListener('click', deleteProduct);
}

// update cart info
function updateCartInfo(){
    let cartInfo = findCartInfo();
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}

function loadJSON(){
    fetch('products.json')
    .then(response => response.json())
    .then(data =>{
        
        let html = '';
        data.forEach(product => {
            html += `
                <div class = "product-item">
                    <div class = "main-wrapper">
                    <div class = "product-img " >
                        <img src = "${product.imgSrc}" alt = "product image">
                        <button type = "button" class = "product__watch" >
                        <i class = "fas fa-search-plus"></i> Быстрый просмотр
                        </button>
                    </div>
                    
                
                    <div class = "product-content">
                        <h3 class = "product-name">${product.name}</h3>
                        <div class = "product_cost-block">
                        <span class = "product-price">$${product.price}</span>
                        <span class="product-list-price">$${product.listPrice}</span>
                        </div>
                        <button type = "button" class = "product__btn">
                        <i class = "fas fa-shopping-cart"></i> Добавить в корзину
                        </button>
                    </div>
                    </div>
                </div>
            `;
        });
        productList.innerHTML = html;
    })
}



// purchase product
function purchaseProduct(e){
    if(e.target.classList.contains('product__btn')){
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}

// get product info after add to cart button click
function getProductInfo(product){
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        price: product.querySelector('.product-price').textContent
    }
    cartItemID++;
    addToCartList(productInfo);
    saveProductInStorage(productInfo);
}

// add the selected product to the cart list
function addToCartList(product){
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
        <img src = "${product.imgSrc}" alt = "product image">
        <div class = "cart-item-info">
            <h3 class = "cart-item-name">${product.name}</h3>
            <span class = "cart-item-price">${product.price}</span>
        </div>

        <button type = "button" class = "cart-item-del-btn">
            <i class = "fas fa-times"></i>
        </button>
    `;
    cartList.appendChild(cartItem);
}

// save the product in the local storage
function saveProductInStorage(item){
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();
}

// get all the products info if there is any in the local storage
function getProductFromStorage(){
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
    // returns empty array if there isn't any product info
}

// load carts product
function loadCart(){
    let products = getProductFromStorage();
    if(products.length < 1){
        cartItemID = 1; // if there is no any product in the local storage
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
        // else get the id of the last product and increase it by 1
    }
    products.forEach(product => addToCartList(product));

    // calculate and update UI of cart info 
    updateCartInfo();
}

// calculate total price of the cart and other info
function findCartInfo(){
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1)); // removing dollar sign
        return acc += price;
    }, 0); // adding all the prices

    return{
        total: total.toFixed(2),
        productCount: products.length
    }
}

// delete product from cart list and local storage
function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove(); // this removes from the DOM only
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); // this removes from the DOM only
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    localStorage.setItem('products', JSON.stringify(updatedProducts)); // updating the product list after the deletion
    updateCartInfo();
}
