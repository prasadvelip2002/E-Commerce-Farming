using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Deliveries.Queries
{
    public class AssignedDeliveryDto
    {
        public Guid DeliveryId { get; set; }
        public Guid OrderId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string CustomerAddress { get; set; } = string.Empty;
        public string FarmerGps { get; set; } = string.Empty;
    }

    public class GetAssignedDeliveriesQuery : IRequest<List<AssignedDeliveryDto>>
    {
        public Guid DeliveryProviderId { get; set; }
    }

    public class GetAssignedDeliveriesQueryHandler : IRequestHandler<GetAssignedDeliveriesQuery, List<AssignedDeliveryDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetAssignedDeliveriesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<AssignedDeliveryDto>> Handle(GetAssignedDeliveriesQuery request, CancellationToken cancellationToken)
        {
            return await _context.Deliveries
                .Include(d => d.Order)
                .ThenInclude(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.FarmerProfile)
                .Where(d => d.DeliveryProviderId == request.DeliveryProviderId)
                .Select(d => new AssignedDeliveryDto
                {
                    DeliveryId = d.Id,
                    OrderId = d.OrderId,
                    Status = d.Status,
                    CustomerAddress = d.Order.ShippingAddress,
                    FarmerGps = d.Order.OrderItems.FirstOrDefault() != null ? d.Order.OrderItems.First().Product.FarmerProfile.GpsLocation : ""
                })
                .ToListAsync(cancellationToken);
        }
    }
}
