export function updateCartUI(cart) {
    const container = document.getElementById('cart-items-container');
    const totalDisplay = document.getElementById('total-display');
    const subtotalDisplay = document.getElementById('subtotal-display');

    const items = cart.getItems();
    const totalAmount = cart.getTotal();

    // 1. 清空目前列表
    container.innerHTML = '';

    // 2. 如果沒東西，顯示提示
    if (items.length === 0) {
        container.innerHTML = '<div class="empty-cart-msg">尚未加入商品</div>';
        totalDisplay.textContent = '$0';
        subtotalDisplay.textContent = '$0';
        return;
    }

    // 3. 渲染每一個項目
    items.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item';
        // (建議把原本寫死在 JS 的 style 移到 CSS，但這邊先維持現狀方便你改)
        itemRow.style.display = 'flex';
        itemRow.style.justifyContent = 'space-between';
        itemRow.style.alignItems = 'center'; // 垂直置中
        itemRow.style.padding = '10px 0';
        itemRow.style.borderBottom = '1px solid #eee';

        itemRow.innerHTML = `
            <div style="flex: 1;">
                <div style="font-weight: bold; margin-bottom: 5px;">${item.name}</div>
                
                <div class="cart-item-controls">
                    <span style="font-size: 0.85rem; color: #666;">$${item.price}</span>
                    <button class="btn-qty minus" data-id="${item.id}">-</button>
                    <span>${item.qty}</span>
                    <button class="btn-qty plus" data-id="${item.id}">+</button>
                </div>
            </div>
            
            <div style="font-weight: bold; color: var(--primary-color);">
                $${item.price * item.qty}
            </div>
        `;
        
        container.appendChild(itemRow);
    });

    // 4. 更新總金額
    totalDisplay.textContent = `$${totalAmount}`;
    subtotalDisplay.textContent = `$${totalAmount}`;
}