using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using AgriEcommerce.Application.Orders.Commands;
using AgriEcommerce.Application.Orders.Queries;
using Microsoft.AspNetCore.Authorization;
using System;

namespace AgriEcommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IMediator _mediator;

        public OrdersController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("place")]
        // [Authorize(Roles = "Customer")]
        public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderCommand command)
        {
            try
            {
                // In production, UserId should be extracted from User.Claims
                // if (command.CustomerId == Guid.Empty)
                //     command.CustomerId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                var orderId = await _mediator.Send(command);
                return Ok(new { OrderId = orderId });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("my-orders")]
        // [Authorize(Roles = "Customer")]
        public async Task<IActionResult> GetMyOrders([FromQuery] Guid customerId)
        {
            // In production, customerId would come from User.Claims
            var query = new GetCustomerOrdersQuery { CustomerId = customerId };
            var orders = await _mediator.Send(query);
            return Ok(orders);
        }

        [HttpGet("all")]
        // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _mediator.Send(new GetAllOrdersQuery());
            return Ok(orders);
        }

        /// <summary>
        /// Update the status of an order (Admin only in production).
        /// </summary>
        [HttpPatch("{id:guid}/status")]
        public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateOrderStatusRequest request)
        {
            var success = await _mediator.Send(new UpdateOrderStatusCommand 
            { 
                OrderId = id, 
                NewStatus = request.Status 
            });
            
            if (!success) return NotFound(new { message = "Order not found." });
            return Ok(new { message = "Status updated successfully." });
        }
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
