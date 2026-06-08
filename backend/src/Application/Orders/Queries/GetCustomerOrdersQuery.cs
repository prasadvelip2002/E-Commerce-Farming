using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Orders.Queries
{
    public class OrderDto
    {
        public Guid OrderId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
        public int ItemCount { get; set; }
    }

    public class GetCustomerOrdersQuery : IRequest<List<OrderDto>>
    {
        public Guid CustomerId { get; set; }
    }

    public class GetCustomerOrdersQueryHandler : IRequestHandler<GetCustomerOrdersQuery, List<OrderDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetCustomerOrdersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<OrderDto>> Handle(GetCustomerOrdersQuery request, CancellationToken cancellationToken)
        {
            return await _context.Orders
                .Where(o => o.CustomerId == request.CustomerId)
                .Select(o => new OrderDto
                {
                    OrderId = o.Id,
                    TotalAmount = o.TotalAmount,
                    Status = o.Status,
                    CreatedAt = o.CreatedAt.ToString("O"),
                    ItemCount = o.OrderItems.Sum(oi => oi.Quantity)
                })
                .OrderByDescending(o => o.CreatedAt)
                .ToListAsync(cancellationToken);
        }
    }
}
