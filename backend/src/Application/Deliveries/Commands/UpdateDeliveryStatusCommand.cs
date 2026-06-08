using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Deliveries.Commands
{
    public class UpdateDeliveryStatusCommand : IRequest<bool>
    {
        public Guid DeliveryId { get; set; }
        public string NewStatus { get; set; } = string.Empty;
    }

    public class UpdateDeliveryStatusCommandHandler : IRequestHandler<UpdateDeliveryStatusCommand, bool>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDeliveryStatusCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Handle(UpdateDeliveryStatusCommand request, CancellationToken cancellationToken)
        {
            var delivery = await _context.Deliveries
                .FirstOrDefaultAsync(d => d.Id == request.DeliveryId, cancellationToken);

            if (delivery == null)
                return false;

            delivery.Status = request.NewStatus;
            
            // Optionally update the linked order status if delivery is finished
            if (request.NewStatus == "Delivered")
            {
                var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == delivery.OrderId, cancellationToken);
                if (order != null)
                {
                    order.Status = "Delivered";
                }
            }

            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}
