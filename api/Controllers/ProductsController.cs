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

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        // 從資料庫撈取所有商品
        return await _context.Products.ToListAsync();
    }
}