using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using AgriEcommerce.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Deliveries.Commands
{
    public class AssignDeliveryCommand : IRequest<Guid?>
    {
        public Guid OrderId { get; set; }
        public Guid DeliveryProviderId { get; set; }
    }

    public class AssignDeliveryCommandHandler : IRequestHandler<AssignDeliveryCommand, Guid?>
    {
        private readonly IApplicationDbContext _context;

        public AssignDeliveryCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid?> Handle(AssignDeliveryCommand request, CancellationToken cancellationToken)
        {
            var order = await _context.Orders.FindAsync(new object[] { request.OrderId }, cancellationToken);
            if (order == null) return null;

            var delivery = new Delivery
            {
                OrderId = request.OrderId,
                DeliveryProviderId = request.DeliveryProviderId,
                Status = "Assigned",
                TrackingUrl = $"/delivery/track/{Guid.NewGuid()}"
            };

            _context.Deliveries.Add(delivery);
            
            // Advance order status
            order.Status = "Shipped";
            
            await _context.SaveChangesAsync(cancellationToken);

            return delivery.Id;
        }
    }
}
