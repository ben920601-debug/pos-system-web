import { ProductService } from './modules/core/Product.js';
import { Cart } from './modules/core/Cart.js';
import { renderProductList } from './modules/ui/ProductListUI.js';
import { updateCartUI } from './modules/ui/CartUI.js';

// --------------------------------------
    // ★ 新增：系統時間顯示 (System Clock)
    // --------------------------------------
    function updateClock() {
        const now = new Date();
        
        // 取得時間字串 (HH:mm)
        const timeStr = now.toLocaleTimeString('zh-TW', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // 取得日期字串 (MM/DD)
        const dateStr = now.toLocaleDateString('zh-TW', {
            month: '2-digit',
            day: '2-digit'
        });

        // 更新畫面
        const timeEl = document.querySelector('.clock-time');
        const dateEl = document.querySelector('.clock-date');

        if (timeEl) timeEl.textContent = timeStr;
        if (dateEl) dateEl.textContent = dateStr;
    }

    // 1. 馬上執行一次，避免剛載入時顯示 --:--
    updateClock();

    // 2. 設定每秒更新一次 (1000ms)
    setInterval(updateClock, 1000);

// ==========================================
// 1. 安全權限檢查 (Security Check)
// ==========================================
const currentUserJson = localStorage.getItem('currentUser');
if (!currentUserJson) {
    alert("請先登入系統！");
    window.location.href = '../login/index.html';
    throw new Error("Unauthorized"); 
}

// 解析使用者資料
const currentUser = JSON.parse(currentUserJson);

// 初始化購物車
const myCart = new Cart();

// ==========================================
// 2. DOM 載入後的主程式
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {

    // --------------------------------------
    // A. 顯示使用者資訊
    // --------------------------------------
    const userDisplay = document.getElementById('current-user-display');
    if (userDisplay) {
        const roleText = currentUser.role === 'Manager' ? '(店長)' : '(員工)';
        userDisplay.textContent = `Hi, ${currentUser.username} ${roleText}`;
    }

    // (注意：舊的交班邏輯 B區塊 已在此處完全移除)

    // --------------------------------------
    // C. 商品載入與購物車互動
    // --------------------------------------
    const products = await ProductService.fetchAll();

    renderProductList(products, (selectedProduct) => {
        myCart.addItem(selectedProduct);
        updateCartUI(myCart);
        calculateChange();
    });

    // --------------------------------------
    // D. 購物車數量控制 (+ / - 按鈕)
    // --------------------------------------
    const cartContainer = document.getElementById('cart-items-container');
    
    cartContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-qty');
        if (!btn) return;

        const id = parseInt(btn.dataset.id);
        const isPlus = btn.classList.contains('plus');

        if (isPlus) {
            myCart.updateQuantity(id, 1);
        } else {
            myCart.updateQuantity(id, -1);
        }

        updateCartUI(myCart);
        calculateChange();
    });

    // --------------------------------------
    // E. 找零計算邏輯
    // --------------------------------------
    const receivedInput = document.getElementById('received-amount');
    
    receivedInput.addEventListener('input', calculateChange);

    function calculateChange() {
        const total = myCart.getTotal();
        const received = parseInt(receivedInput.value) || 0;
        const changeDisplay = document.getElementById('change-display');

        if (receivedInput.value) {
             const change = received - total;
             changeDisplay.textContent = `$${change}`;
             changeDisplay.style.color = change < 0 ? 'red' : 'var(--accent-color)';
        } else {
             changeDisplay.textContent = `$${0}`; 
             changeDisplay.style.color = 'var(--accent-color)';
        }
    }

    // --------------------------------------
    // F. 結帳功能
    // --------------------------------------
    const checkoutBtn = document.getElementById('btn-checkout');
    
    checkoutBtn.addEventListener('click', async () => {
        // 1. 驗證購物車
        if (myCart.getItems().length === 0) {
            alert("購物車是空的，無法結帳！");
            return;
        }

        // 2. 驗證金額
        const total = myCart.getTotal();
        const received = parseInt(receivedInput.value) || 0;

        if (received < total) {
            alert(`金額不足！還差 $${total - received}`);
            return;
        }

        // 3. 打包訂單資料
        const orderData = {
            totalAmount: total,
            itemsJson: JSON.stringify(myCart.getItems()),
        };

        // 4. 發送 API 請求
        try {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = "結帳中...";

            const response = await fetch("http://localhost:5099/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error("結帳失敗");
            }

            // 5. 成功後處理
            alert(`結帳成功！找零：$${received - total}`);
            
            myCart.clear();
            updateCartUI(myCart);
            receivedInput.value = "";
            calculateChange();
            
        } catch (error) {
            console.error(error);
            alert("系統錯誤，無法建立訂單！");
        } finally {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = "結帳";
        }
    });

});