import { OrderService } from './modules/core/OrderService.js';

// 安全檢查
if (!localStorage.getItem('currentUser')) {
    window.location.href = '../login/index.html';
}

document.addEventListener('DOMContentLoaded', async () => {
    
    const listContainer = document.getElementById('order-list-container');
    const detailContainer = document.getElementById('order-detail-container');
    
    // 1. 抓取資料
    let orders = [];
    try {
        orders = await OrderService.fetchAll();
    } catch (error) {
        listContainer.innerHTML = '<div style="padding:20px; text-align:center; color:red;">無法載入訂單</div>';
        return;
    }

    if (orders.length === 0) {
        listContainer.innerHTML = '<div style="padding:20px; text-align:center;">目前沒有訂單紀錄</div>';
        return;
    }

    // 2. 渲染左側列表
    renderOrderList(orders);

    // 3. 定義渲染列表函式
    function renderOrderList(orders) {
        listContainer.innerHTML = ''; // 清空

        orders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleString('zh-TW', {
                month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
            });

            // 建立列表項目
            const div = document.createElement('div');
            div.className = 'order-row';
            div.dataset.id = order.id; // 綁定 ID 方便查找

            div.innerHTML = `
                <div class="order-row-info">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-time">${date}</span>
                </div>
                <div class="order-total">$${order.totalAmount}</div>
            `;

            // 點擊事件
            div.addEventListener('click', () => {
                // 移除其他項目的選中狀態
                document.querySelectorAll('.order-row').forEach(row => row.classList.remove('selected'));
                // 設定目前項目為選中
                div.classList.add('selected');
                // 顯示右側明細
                renderOrderDetail(order);
            });

            listContainer.appendChild(div);
        });
    }

    // 4. 定義渲染明細函式
    function renderOrderDetail(order) {
        const date = new Date(order.createdAt).toLocaleString('zh-TW');
        
        // 解析 Items JSON
        let itemsHtml = '';
        try {
            const items = JSON.parse(order.itemsJson);
            items.forEach(item => {
                itemsHtml += `
                    <tr>
                        <td>${item.name} <span style="font-size:0.8rem; color:#888;">x${item.qty}</span></td>
                        <td style="text-align:right;">$${item.price * item.qty}</td>
                    </tr>
                `;
            });
        } catch (e) {
            itemsHtml = '<tr><td colspan="2" style="color:red;">明細資料格式錯誤</td></tr>';
        }

        // 產生右側 HTML (像一張收據)
        detailContainer.innerHTML = `
            <div class="detail-header">
                <h3>訂單 #${order.id}</h3>
                <div class="detail-meta">交易時間：${date}</div>
            </div>

            <table class="detail-table">
                <thead>
                    <tr>
                        <th>品項 / 數量</th>
                        <th style="text-align:right;">小計</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <div class="detail-total">
                <span style="font-size:1rem; color:#666; font-weight:normal;">總計</span> 
                $${order.totalAmount}
            </div>
        `;
    }

});
