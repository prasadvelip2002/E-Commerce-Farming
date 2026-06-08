using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using AgriEcommerce.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System;

namespace AgriEcommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IApplicationDbContext _context;

        public RolesController(IApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var users = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Select(u => new
                {
                    UserId = u.Id,
                    Email = u.Email,
                    Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailableRoles()
        {
            var roles = await _context.Roles.Select(r => r.Name).ToListAsync();
            return Ok(roles);
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignRole([FromBody] AssignRoleDto request)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles)
                .FirstOrDefaultAsync(u => u.Id == request.UserId);

            if (user == null) return NotFound("User not found");

            var role = await _context.Roles.FirstOrDefaultAsync(r => r.Name == request.RoleName);
            if (role == null) return NotFound("Role not found");

            if (!user.UserRoles.Any(ur => ur.RoleId == role.Id))
            {
                _context.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.Id });
                await _context.SaveChangesAsync(new System.Threading.CancellationToken());
            }

            return Ok(new { success = true });
        }

        [HttpPost("revoke")]
        public async Task<IActionResult> RevokeRole([FromBody] AssignRoleDto request)
        {
            var userRole = await _context.UserRoles
                .Include(ur => ur.Role)
                .FirstOrDefaultAsync(ur => ur.UserId == request.UserId && ur.Role.Name == request.RoleName);

            if (userRole != null)
            {
                _context.UserRoles.Remove(userRole);
                await _context.SaveChangesAsync(new System.Threading.CancellationToken());
            }

            return Ok(new { success = true });
        }
    }

    public class AssignRoleDto
    {
        public Guid UserId { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }
}
