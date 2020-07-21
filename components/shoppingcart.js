export default {
    props: ['shoppingcart', 'shoppingcartopen'],
    template: `<div class="table-wrap" :class="{ 'show': shoppingcartopen }">
                <table class="shopping-table">
                    <tr class="table-title">
                        <th width="20%"></th>
                        <th width="22%">品名</th>
                        <th width="20%">售價</th>
                        <th width="28%">數量</th>
                        <th width="10%"></th>
                    </tr>
                    <tr v-for="item in shoppingcart" :key="item.product.id + 'shopping'">
                        <td><img :src="item.product.imageUrl[0]" alt=""></td>
                        <td>{{item.product.title}}</td>
                        <td>NT$ {{ item.product.price | thousands }}</td>
                        <td>
                            <form class="select_qty">
                                <div class="input-group">
                                    <button type="button" class="decrease-btn" @click="quantityUpdate(item.product.id, item.quantity - 1)" :disabled="item.quantity === 0">
                                        <i class="fa fa-minus"></i>
                                    </button>
                                    <input type="number" class="product-number" :value="item.quantity" @input="quantityUpdate(item.product.id, $event.target.value)">
                                    <button type="button" class="add-btn" @click="quantityUpdate(item.product.id, item.quantity + 1)">
                                        <i class="fa fa-plus"></i>
                                    </button>
                                </div>
                            </form>
                        </td>
                        <td class="delete" @click="deleteProduct(item.product.id)"><i class="fas fa-times"></i></td>
                    </tr>
                </table>
                <a href="cart.html" class="btn">訂單結帳</a>
            </div>`,
    methods: {
        deleteProduct(id) {
            this.$emit('deleteproduct', id);
        },
        quantityUpdate(id, num) {
            this.$emit('qtyupdate', id, num);
        }
    }
};