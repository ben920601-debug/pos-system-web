// src/orders_main.js
import { OrderService } from './modules/core/OrderService.js';

document.addEventListener('DOMContentLoaded', async () => {
    
    const tbody = document.getElementById('order-list-body');
    
    // 1. 透過 Service 抓取資料
    const orders = await OrderService.fetchAll();

    // 2. 清空表格
    tbody.innerHTML = '';

    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">目前沒有訂單紀錄</td></tr>';
        return;
    }

    // 3. 渲染資料
    orders.forEach(order => {
        // 時間格式化
        const date = new Date(order.createdAt).toLocaleString('zh-TW', { hour12: false });
        
        // 解析 JSON 明細
        let itemsStr = "";
        try {
            const items = JSON.parse(order.itemsJson);
            itemsStr = items.map(i => `${i.name} x${i.qty}`).join('、');
        } catch (e) {
            itemsStr = "資料格式錯誤";
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${order.id}</td>
            <td>${date}</td>
            <td style="color: var(--primary-color); font-weight: bold;">$${order.totalAmount}</td>
            <td style="color: #666;">${itemsStr}</td>
        `;
        tbody.appendChild(tr);
    });

});

