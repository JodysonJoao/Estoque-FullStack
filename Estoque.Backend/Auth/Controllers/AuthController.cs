using Estoque.Backend.Auth.Models;
using Estoque.Backend.Auth.Services;
using Microsoft.AspNetCore.Mvc;

namespace Estoque.Backend.Auth.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        public IActionResult Authenticate([FromBody] User user)
        {
            var token = _authService.Authenticate(user);
            if (token == null)
            {
                return Unauthorized();
            }
            return Ok(new { Token = token });
        }
    }
}
