using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PosApi.Controllers;

[ApiController]
[Route("api/[controller]")] // 網址會是 /api/auth
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto request)
    {
        // 1. 找找看有沒有這個帳號
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        // 2. 驗證帳號是否存在，以及密碼是否正確
        // (資安觀念：為了防止枚舉攻擊，帳號錯或密碼錯我們通常回傳一樣的模糊錯誤)
        if (user == null || user.Password != request.Password)
        {
            return Unauthorized("帳號或密碼錯誤");
        }

        // 3. 登入成功，回傳使用者的基本資料 (不包含密碼)
        return Ok(new 
        { 
            message = "登入成功", 
            username = user.Username, 
            role = user.Role 
        });
    }
}