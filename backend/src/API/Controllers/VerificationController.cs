using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using AgriEcommerce.Application.Verifications.Commands;
using AgriEcommerce.Application.Verifications.Queries;
using Microsoft.AspNetCore.Authorization;

namespace AgriEcommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VerificationController : ControllerBase
    {
        private readonly IMediator _mediator;

        public VerificationController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("submit")]
        // [Authorize(Roles = "Farmer")]
        public async Task<IActionResult> Submit([FromBody] SubmitVerificationCommand command)
        {
            // Note: In a production scenario, we extract the UserId from User.Claims.
            var result = await _mediator.Send(command);
            return Ok(new { VerificationId = result });
        }

        [HttpPost("review")]
        // [Authorize(Roles = "Admin,Authorizer")]
        public async Task<IActionResult> Review([FromBody] ReviewVerificationCommand command)
        {
            var result = await _mediator.Send(command);
            if (!result) return NotFound(new { message = "Verification not found." });
            return Ok(new { success = true });
        }

        [HttpGet("pending")]
        // [Authorize(Roles = "Admin,Authorizer")]
        public async Task<IActionResult> GetPending()
        {
            var result = await _mediator.Send(new GetPendingVerificationsQuery());
            return Ok(result);
        }
    }
}
