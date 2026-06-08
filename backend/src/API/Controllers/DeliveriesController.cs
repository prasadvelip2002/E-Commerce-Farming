using Microsoft.AspNetCore.Mvc;
using MediatR;
using System.Threading.Tasks;
using AgriEcommerce.Application.Deliveries.Commands;
using AgriEcommerce.Application.Deliveries.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using AgriEcommerce.API.Hubs;
using System;

namespace AgriEcommerce.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeliveriesController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IHubContext<DeliveryTrackingHub> _hubContext;

        public DeliveriesController(IMediator mediator, IHubContext<DeliveryTrackingHub> hubContext)
        {
            _mediator = mediator;
            _hubContext = hubContext;
        }

        [HttpGet("provider/{providerId}")]
        public async Task<IActionResult> GetAssignedDeliveries(Guid providerId)
        {
            var query = new GetAssignedDeliveriesQuery { DeliveryProviderId = providerId };
            var result = await _mediator.Send(query);
            return Ok(result);
        }

        [HttpPost("assign")]
        public async Task<IActionResult> AssignDelivery([FromBody] AssignDeliveryCommand command)
        {
            var result = await _mediator.Send(command);
            if (result == null) return NotFound("Order not found");
            return Ok(new { success = true, deliveryId = result });
        }

        [HttpPost("update-status")]
        // [Authorize(Roles = "Admin,DeliveryProvider")]
        public async Task<IActionResult> UpdateStatus([FromBody] UpdateDeliveryStatusCommand command)
        {
            var success = await _mediator.Send(command);
            
            if (!success)
            {
                return NotFound(new { message = "Delivery record not found." });
            }

            // SignalR: Broadcast the new status to everyone listening to this delivery's tracking ID
            await _hubContext.Clients.Group(command.DeliveryId.ToString())
                .SendAsync("ReceiveStatusUpdate", new { 
                    deliveryId = command.DeliveryId, 
                    status = command.NewStatus,
                    timestamp = DateTime.UtcNow
                });

            return Ok(new { success = true, newStatus = command.NewStatus });
        }

        public class LocationUpdateDto
        {
            public Guid DeliveryId { get; set; }
            public double Latitude { get; set; }
            public double Longitude { get; set; }
        }

        [HttpPost("update-location")]
        public async Task<IActionResult> UpdateLocation([FromBody] LocationUpdateDto dto)
        {
            await _hubContext.Clients.Group(dto.DeliveryId.ToString())
                .SendAsync("ReceiveLocationUpdate", new { 
                    deliveryId = dto.DeliveryId, 
                    latitude = dto.Latitude,
                    longitude = dto.Longitude,
                    timestamp = DateTime.UtcNow
                });
            return Ok(new { success = true });
        }

        [HttpGet("{trackingId}")]
        // [Authorize]
        public async Task<IActionResult> GetTrackingStatus(Guid trackingId)
        {
            var query = new GetDeliveryStatusQuery { DeliveryId = trackingId };
            var result = await _mediator.Send(query);
            
            if (result == null)
            {
                return NotFound(new { message = "Tracking ID not found." });
            }

            return Ok(result);
        }
    }
}
