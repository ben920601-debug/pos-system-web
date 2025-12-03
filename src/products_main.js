import { ProductService } from './modules/core/Products.js';

// ==========================================
// 1. 安全權限檢查
// ==========================================
const currentUserJson = localStorage.getItem('currentUser');
if (!currentUserJson) {
    window.location.href = '../login/index.html';
}

document.addEventListener('DOMContentLoaded', async () => {

    // --------------------------------------
    // ★ 新增：系統時間顯示 (System Clock)
    // --------------------------------------
    function updateClock() {
        const now = new Date();
        const timeEl = document.querySelector('.clock-time');
        const dateEl = document.querySelector('.clock-date');

        if (timeEl && dateEl) {
            timeEl.textContent = now.toLocaleTimeString('zh-TW', { 
                hour12: false, hour: '2-digit', minute: '2-digit' 
            });
            dateEl.textContent = now.toLocaleDateString('zh-TW', {
                month: '2-digit', day: '2-digit'
            });
        }
    }
    updateClock(); // 立即執行一次
    setInterval(updateClock, 1000); // 每秒更新
    // --------------------------------------


    const listContainer = document.getElementById('order-list-container');
    // ... (原本的程式碼繼續接在下面)
});

document.addEventListener('DOMContentLoaded', async () => {

    const tbody = document.getElementById('product-list-body');
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    
    // 按鈕與標題
    const btnAdd = document.getElementById('btn-add-product');
    const btnClose = document.getElementById('close-product-modal');
    const modalTitle = document.getElementById('modal-title');

    // 欄位
    const inputId = document.getElementById('p-id');
    const inputName = document.getElementById('p-name');
    const inputPrice = document.getElementById('p-price');
    const inputCategory = document.getElementById('p-category');

    // ==========================================
    // 2. 渲染商品列表函式
    // ==========================================
    async function loadProducts() {
        // 顯示載入中
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">載入中...</td></tr>';
        
        try {
            const products = await ProductService.fetchAll();

            tbody.innerHTML = ''; // 清空表格

            if (products.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">目前沒有商品</td></tr>';
                return;
            }

            // 產生表格列
            products.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td><span style="padding:4px 8px; background:#e0f2f1; border-radius:10px; font-size:0.85rem; color:#00695c;">${p.category || '未分類'}</span></td>
                    <td style="font-weight:bold;">$${p.price}</td>
                    <td>
                        <button class="btn-edit" 
                            data-id="${p.id}" 
                            data-name="${p.name}" 
                            data-price="${p.price}" 
                            data-category="${p.category}"
                            style="margin-right:5px; padding:5px 10px; cursor:pointer;">
                            編輯
                        </button>
                        <button class="btn-delete" 
                            data-id="${p.id}" 
                            data-name="${p.name}"
                            style="padding:5px 10px; cursor:pointer; background-color:#ffcdd2; border:1px solid #e57373; color:#c62828;">
                            刪除
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error(error);
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:red;">無法載入資料</td></tr>';
        }
    }

    // 初次載入
    loadProducts();

    // ==========================================
    // 3. 彈窗控制邏輯
    // ==========================================
    
    // 開啟「新增模式」
    btnAdd.addEventListener('click', () => {
        form.reset();           // 清空表單
        inputId.value = '';     // 清空隱藏的 ID (代表是新增)
        modalTitle.textContent = "新增商品";
        modal.style.display = 'flex';
    });

    // 關閉彈窗
    btnClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // 點擊外部關閉
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });

    // ==========================================
    // 4. 表單送出 (新增或修改)
    // ==========================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // 防止網頁重新整理

        // 收集資料
        const id = inputId.value; // 如果有值就是修改，沒值就是新增
        const productData = {
            id: id ? parseInt(id) : 0, // 修改時後端需要 ID
            name: inputName.value,
            price: parseFloat(inputPrice.value),
            category: inputCategory.value
            // stock: 0 (庫存功能之後再補)
        };

        try {
            if (id) {
                // --- 修改模式 (Update) ---
                await ProductService.update(id, productData);
                alert("修改成功！");
            } else {
                // --- 新增模式 (Create) ---
                // 移除 ID 屬性，讓後端自動產生
                delete productData.id; 
                await ProductService.create(productData);
                alert("新增成功！");
            }

            // 成功後：關閉視窗 + 重新載入列表
            modal.style.display = 'none';
            loadProducts();

        } catch (error) {
            console.error(error);
            alert("操作失敗，請檢查後端連線");
        }
    });

    // ==========================================
    // 5. 列表按鈕事件 (編輯 / 刪除)
    // ==========================================
    // 使用事件委派 (Event Delegation) 監聽整個 tbody
    tbody.addEventListener('click', async (e) => {
        const target = e.target;

        // A. 點擊「編輯」
        if (target.classList.contains('btn-edit')) {
            // 從按鈕的 data 屬性把資料抓回來填入表單
            inputId.value = target.dataset.id;
            inputName.value = target.dataset.name;
            inputPrice.value = target.dataset.price;
            inputCategory.value = target.dataset.category;

            modalTitle.textContent = "編輯商品";
            modal.style.display = 'flex';
        }

        // B. 點擊「刪除」
        if (target.classList.contains('btn-delete')) {
            const id = target.dataset.id;
            const name = target.dataset.name;

            if (confirm(`確定要刪除「${name}」嗎？此動作無法復原。`)) {
                try {
                    await ProductService.delete(id);
                    // 刪除後重新整理
                    loadProducts();
                } catch (error) {
                    alert("刪除失敗");
                }
            }
        }
    });

});
