using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PosApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;

    public OrdersController(AppDbContext context)
    {
        _context = context;
    }

    // 1. 存訂單 (原本有的)
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {
        order.CreatedAt = DateTime.UtcNow;
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(CreateOrder), new { id = order.Id }, order);
    }

    // ★★★ 2. 讀取訂單 (補上這一段！) ★★★
    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        // 從資料庫撈資料，並依照時間倒序排列 (最新的在上面)
        return await _context.Orders
                             .OrderByDescending(o => o.CreatedAt)
                             .ToListAsync();
    }
}