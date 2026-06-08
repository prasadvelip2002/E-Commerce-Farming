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
    public class AdminOrderDto
    {
        public Guid OrderId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string CustomerLocation { get; set; } = string.Empty;
        public List<AdminOrderItemDto> Items { get; set; } = new List<AdminOrderItemDto>();
        public decimal TotalAmount { get; set; }
        public string OrderDate { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class AdminOrderItemDto
    {
        public string Name { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }

    public class GetAllOrdersQuery : IRequest<List<AdminOrderDto>>
    {
    }

    public class GetAllOrdersQueryHandler : IRequestHandler<GetAllOrdersQuery, List<AdminOrderDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetAllOrdersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<AdminOrderDto>> Handle(GetAllOrdersQuery request, CancellationToken cancellationToken)
        {
            return await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.Customer)
                .OrderByDescending(o => o.CreatedAt)
                .Select(o => new AdminOrderDto
                {
                    OrderId = o.Id,
                    CustomerName = o.Customer.Email ?? "Unknown", // Assuming Email is name
                    CustomerLocation = "Nashik", // Mock location for demo
                    Items = o.OrderItems.Select(oi => new AdminOrderItemDto
                    {
                        Name = oi.Product.Name,
                        Quantity = oi.Quantity
                    }).ToList(),
                    TotalAmount = o.TotalAmount,
                    OrderDate = o.CreatedAt.ToString("yyyy-MM-dd HH:mm"),
                    Status = o.Status
                })
                .ToListAsync(cancellationToken);
        }
    }
}
