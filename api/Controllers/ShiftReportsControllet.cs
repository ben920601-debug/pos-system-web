using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PosApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShiftReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ShiftReportsController(AppDbContext context)
    {
        _context = context;
    }

    // 1. 存檔交班紀錄 (POST)
    [HttpPost]
    public async Task<ActionResult<ShiftReport>> CreateReport(ShiftReport report)
    {
        report.CreatedAt = DateTime.UtcNow;
        _context.ShiftReports.Add(report);
        await _context.SaveChangesAsync();
        return Ok(report);
    }

    // 2. 讀取所有交班紀錄 (GET) - 未來報表用
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ShiftReport>>> GetReports()
    {
        return await _context.ShiftReports
                             .OrderByDescending(r => r.CreatedAt)
                             .ToListAsync();
    }
}
