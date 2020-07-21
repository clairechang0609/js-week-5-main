import gotop from '../components/gotop.js';
import search from '../components/search.js';
import shopping from '../components/shoppingcart.js';
import zh_TW from '../components/zh_TW.js';
Vue.component('gotop', gotop);
Vue.component('search', search);
Vue.component('shopping', shopping);
VeeValidate.localize('tw', zh_TW);

Vue.filter('thousands', function (num) {
    var parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
})

Vue.component('loading', VueLoading);

//input驗證
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
//表單的驗證
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

new Vue({
    el: '.wrap',
    data() {
        return {
            id: {
                uuid: '9fbd3898-4d4d-4c65-a3cf-6af8511169fb',
                apiPath: 'https://course-ec-api.hexschool.io/api/'
            },
            openMainMenu: false,
            openMenu: false,
            opensearch: false,
            isLoading: false,
            shoppingCartOpen: false,
            cart: [],
            totalPrice: 0,
            deliveryFee: 350,
            email: '',
            page: 1,
            form: {
                name: '',
                email: '',
                tel: '',
                address: '',
                payment: '',
            },
        };
    },
    created() {
        this.getCart();
    },
    methods: {
        getCart() {
            const vm = this;
            this.isLoading = true;
            const url = `${vm.id.apiPath}${vm.id.uuid}/ec/shopping`;
            axios.get(url)
                .then((response) => {
                    vm.isLoading = false;
                    vm.cart = response.data.data;
                    vm.cart.forEach((item) => {
                        vm.totalPrice += ( item.product.price * item.quantity );
                    });
                    if (vm.totalPrice > 3000) {
                        vm.deliveryFee = 0;
                    } else {
                        vm.deliveryFee = 350;
                    }
                })
                .catch(error => {
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
                    console.log(error);
                })
        },
        qtyUpdate(id, num) {
            const vm = this;
            vm.isLoading = true;
            const url = `${vm.id.apiPath}${vm.id.uuid}/ec/shopping`;

            const data = {
                product: id,
                quantity: num,
            };

            axios.patch(url, data)
                .then(() => {
                    vm.isLoading = false;
                    vm.getCart();
                })
                .catch(error => {
                    console.log(error);
                })
        },
        createOrder() {
            const vm = this;
            vm.isLoading = true;
            const url = `${vm.id.apiPath}${vm.id.uuid}/ec/orders`;
            const editOrder = Object.assign({}, vm.form);
            axios.post(url, editOrder)
                .then((response) => {
                    if (response.data.data.id) {
                        vm.isLoading = false;
                        vm.getCart(); //清空購物車
                    }
                })
                .catch((error) => {
                    this.isLoading = false;
                    console.log(error.response.data.errors);
                });
        },
        changeSearch() {
            this.opensearch = false;
        }
    }
})