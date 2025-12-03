using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PosApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProductsController(AppDbContext context)
    {
        _context = context;
    }

    // 1. 讀取所有商品 (GET: api/products)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        return await _context.Products.OrderBy(p => p.Id).ToListAsync();
    }

    // 2. 新增商品 (POST: api/products)
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        // 伺服器自動填寫建立時間
        product.CreatedAt = DateTime.UtcNow;
        
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // 回傳 201 Created 與新商品資料
        return CreatedAtAction(nameof(GetProducts), new { id = product.Id }, product);
    }

    // 3. 修改商品 (PUT: api/products/5)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest();
        }

        _context.Entry(product).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Products.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent(); // 204 No Content 代表成功但不回傳內容
    }

    // 4. 刪除商品 (DELETE: api/products/5)
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
