export class Cart {
    constructor() {
        this.items = []; // 存放購物車內容
    }

    // 加入商品 (如果已存在則數量 +1)
    addItem(product) {
        // 檢查購物車內是否已經有這個商品
        const existingItem = this.items.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.qty += 1; // 有了就加數量
        } else {
            // 沒有就新增一個，並設定初始數量為 1
            this.items.push({ ...product, qty: 1 });
        }
        
        console.log("目前購物車:", this.items);
    }

    updateQuantity(productId, change) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        
        if (itemIndex > -1) {
            const item = this.items[itemIndex];
            item.qty += change;

            // 如果數量變成 0 或更小，就從陣列中移除
            if (item.qty <= 0) {
                this.items.splice(itemIndex, 1);
            }
        }
    }

    // 計算總金額
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.qty);
        }, 0);
    }

    // 取得所有項目
    getItems() {
        return this.items;
    }

    // ★ 新增：清空購物車 (這是剛剛加的功能)
    clear() {
        this.items = [];
    }
}