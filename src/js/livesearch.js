export default () => {
    const productList = document.getElementById('product-list');
    const searchBar = document.getElementById('searchBar');
    let prItem = [];
    
    searchBar.addEventListener('keyup', (e) => {
        const searchString = e.target.value.toLowerCase();
    
        const filteredProducts = prItem.filter((product) => {
            return (
                product.name.toLowerCase().includes(searchString) 
            );
        });
        displayProducts(filteredProducts);
    });
    
    const loadProducts = async () => {
        try {
            const res = await fetch('./furniture.json');
            prItem = await res.json();
            displayProducts(prItem);
        } catch (err) {
            console.error(err);
        }
    };
    
    const displayProducts = (items) => {
        const htmlString = items
            .map((product) => {
                return `
                <div class = "product-item">
                        
                            <div class = "product-img " >
                            <img src = "${product.imgSrc}" alt = "product image">
                            <button type = "button" class = "product__watch" >
                            <i class = "fas fa-search-plus"></i> Быстрый просмотр
                            </button>
                            </div>
                        
    
                        <div class = "product-content">
                            <h3 class = "product-name">${product.name}</h3>
                            <div class product_cost-block>
                            <span class = "product-price">$${product.price}</span>
                            <span class="product-list-price">$${product.listPrice}</span>
                            </div>
                            <button type = "button" class = "product__btn">
                            <i class = "fas fa-shopping-cart"></i> Добавить в корзину
                        </button>
                        </div>
                    </div>
                `;
            })
            .join('');
        productList.innerHTML = htmlString;
    };
    
    loadProducts();
}