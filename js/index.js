import gotop from '../components/gotop.js';
import search from '../components/search.js';
import shopping from '../components/shoppingcart.js';
Vue.component('gotop', gotop);
Vue.component('search', search);
Vue.component('shopping', shopping);

//千分號
Vue.filter('thousands', function (num) {
    var parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
})

//loading effect
Vue.component('loading', VueLoading);

new Vue({
    el: '.wrap',
    data() {
        return {
            products: [],
            showProducts: [],
            id: {
                uuid: '9fbd3898-4d4d-4c65-a3cf-6af8511169fb',
                apiPath: 'https://course-ec-api.hexschool.io/api/'
            },
            category: '',
            openMainMenu: false,
            openMenu: false,
            opensearch: false,
            isLoading: false,
            shoppingCartOpen: false,
            cart: {},
            totalPrice: 0,
        };
    },
    created() {
        this.getProducts('All');
        this.getCart();
    },
    methods: {
        getProducts(category) {
            const vm = this;
            vm.showProducts = [];
            const url = `${vm.id.apiPath}${vm.id.uuid}/ec/products`;
            vm.isLoading = true;
            axios.get(url)
                .then( response => {
                    vm.isLoading = false;
                    vm.products = response.data.data;

                    vm.products.forEach( product => {
                        if (category === product.category) {
                            vm.showProducts.push(product);
                            vm.category = category;
                        } else if (category === 'All') {
                            vm.showProducts = vm.products;
                            vm.category = 'All Products';
                        } else if (category === 'Sale') {
                            if (product.price < product.origin_price) {
                                vm.showProducts.push(product);
                                vm.category = 'Sale';
                            }
                        }
                    });
                    console.log(vm.products);
                })
                .catch( error =>{
                    vm.isLoading = false;
                    console.log(error);
                })
        },
        getCart() {
            const vm = this;
            this.isLoading = true;
            const url = `${vm.id.apiPath}${vm.id.uuid}/ec/shopping`;
            axios.get(url)
                .then((response) => {
                    vm.isLoading = false;
                    vm.cart = response.data.data;
                    vm.cart.forEach((item) => {
                        vm.totalPrice += item.product.price;
                    });
                    console.log(vm.cart);
                })
                .catch( error => {
                    vm.isLoading = false;
                    console.log(error);
                })
        },
        deleteCartItem(id) {
            const vm = this;
            vm.isLoading = true;
            const url = `${vm.id.apiPath}${vm.id.uuid}/ec/shopping/${id}`;
            axios.delete(url)
                .then(() => {
                    vm.isLoading = false;
                    vm.getCart();
                })
                .catch(error => {
                    vm.isLoading = false;
                    console.log(error);
                })
        },
        addToCart(id) {
            const vm = this;
            vm.isLoading = true;
            const url = `${vm.id.apiPath}${vm.id.uuid}/ec/shopping`;
            const cart = {
                product: id,
                quantity: 1,
            };
            const judgment = this.cart.some( item => {
                if (item.product.id === id) {
                    this.qtyUpdate(id, item.quantity + 1);
                    return true;
                }
            });
            if (!judgment) {
                axios.post(url, cart)
                    .then(() => {
                        vm.isLoading = false;
                        vm.getCart();
                    })
                    .catch(error => {
                        vm.isLoading = false;
                        console.log(error.response.data.errors);
                    });
            }
            
        },
        qtyUpdate(id, num) {
            const vm = this;
            vm.isLoading = true;
            const data = {
                product: id,
                quantity: num,
            };
            if (num === 0) { //為0則刪除商品
                const url = `${vm.id.apiPath}${vm.id.uuid}/ec/shopping/${id}`;
                axios.delete(url)
                    .then(() => {
                        vm.isLoading = false;
                        vm.getCart();
                    })
                    .catch(error => {
                        vm.isLoading = false;
                        console.log(error);
                    })
            } else {
                const url = `${vm.id.apiPath}${vm.id.uuid}/ec/shopping`;
                axios.patch(url, data)
                    .then(() => {
                        vm.isLoading = false;
                        vm.getCart();
                    })
                    .catch(error => {
                        vm.isLoading = false;
                        console.log(error);
                    })
            }
        },
        changeSearch() {
            this.opensearch = false;
        }
    }
})