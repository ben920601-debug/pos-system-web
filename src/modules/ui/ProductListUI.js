export function renderProductList(products, onProductClick) {
    const container = document.getElementById('product-list-container');
    
    // 1. 清空目前的「載入中...」文字
    container.innerHTML = '';

    // 2. 檢查是否有商品
    if (products.length === 0) {
        container.innerHTML = '<div class="placeholder-text">目前沒有商品資料</div>';
        return;
    }

    // 3. 遍歷商品資料，建立 HTML 元素
    products.forEach(product => {
        // 建立卡片外框
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // 設定卡片內容 (名稱、價格、庫存)
        card.innerHTML = `
            <div class="card-content">
                <h3 style="font-size: 1.1rem; color: var(--primary-color); margin-bottom: 5px;">${product.name}</h3>
                <span style="font-size: 0.9rem; color: #666;">${product.category || '未分類'}</span>
            </div>
            <div class="card-footer" style="margin-top: auto;">
                <div style="font-size: 1.2rem; font-weight: bold;">$${product.price}</div>
                <div style="font-size: 0.8rem; color: ${product.stock > 0 ? 'green' : 'red'};">
                    庫存: ${product.stock}
                </div>
            </div>
        `;

        // 4. 加入點擊事件 (未來點擊後加入購物車)
        card.addEventListener('click', () => {
            // 呼叫外部傳入的處理函式
            if(onProductClick) onProductClick(product);
        });

        // 將卡片放入容器
        container.appendChild(card);
    });
}