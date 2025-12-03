// src/modules/core/ProductService.js

const API_URL = "http://localhost:5099/api/products";

export class ProductService {
    
    // 1. 讀取所有 (原有功能，加上防快取)
    static async fetchAll() {
        try {
            const timestamp = new Date().getTime();
            const response = await fetch(`${API_URL}?t=${timestamp}`);
            if (!response.ok) throw new Error("讀取失敗");
            return await response.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // 2. 新增商品
    static async create(productData) {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error("新增失敗");
        return await response.json();
    }

    // 3. 修改商品
    static async update(id, productData) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error("修改失敗");
        return true;
    }

    // 4. 刪除商品
    static async delete(id) {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("刪除失敗");
        return true;
    }
}
