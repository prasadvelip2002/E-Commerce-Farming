using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AgriEcommerce.Application.Deliveries.Queries
{
    public class DeliveryDto
    {
        public Guid DeliveryId { get; set; }
        public Guid OrderId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string TrackingUrl { get; set; } = string.Empty;
        public string LastUpdated { get; set; } = string.Empty;
    }

    public class GetDeliveryStatusQuery : IRequest<DeliveryDto?>
    {
        public Guid DeliveryId { get; set; }
    }

    public class GetDeliveryStatusQueryHandler : IRequestHandler<GetDeliveryStatusQuery, DeliveryDto?>
    {
        private readonly IApplicationDbContext _context;

        public GetDeliveryStatusQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DeliveryDto?> Handle(GetDeliveryStatusQuery request, CancellationToken cancellationToken)
        {
            var delivery = await _context.Deliveries
                .Where(d => d.Id == request.DeliveryId)
                .Select(d => new
                {
                    DeliveryId = d.Id,
                    OrderId = d.OrderId,
                    Status = d.Status,
                    TrackingUrl = d.TrackingUrl,
                    UpdatedAt = d.UpdatedAt
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (delivery == null) return null;

            return new DeliveryDto
            {
                DeliveryId = delivery.DeliveryId,
                OrderId = delivery.OrderId,
                Status = delivery.Status,
                TrackingUrl = delivery.TrackingUrl,
                LastUpdated = delivery.UpdatedAt?.ToString("O") ?? string.Empty
            };
        }
    }
}
