using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AgriEcommerce.Application.Interfaces;
using AgriEcommerce.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgriEcommerce.Application.Orders.Commands
{
    public class OrderItemDto
    {
        public Guid ProductId { get; set; }
        public int Quantity { get; set; }
    }

    public class PlaceOrderCommand : IRequest<Guid>
    {
        public Guid CustomerId { get; set; }
        public string ShippingAddress { get; set; } = string.Empty;
        public List<OrderItemDto> Items { get; set; } = new List<OrderItemDto>();
    }

    public class PlaceOrderCommandHandler : IRequestHandler<PlaceOrderCommand, Guid>
    {
        private readonly IApplicationDbContext _context;

        public PlaceOrderCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> Handle(PlaceOrderCommand request, CancellationToken cancellationToken)
        {
            var productIds = request.Items.Select(i => i.ProductId).ToList();
            
            var products = await _context.Products
                .Where(p => productIds.Contains(p.Id))
                .ToListAsync(cancellationToken);

            if (products.Count != productIds.Count)
                throw new Exception("One or more products not found.");

            var order = new Order
            {
                CustomerId = request.CustomerId,
                ShippingAddress = request.ShippingAddress,
                Status = "Pending",
                TotalAmount = 0
            };

            foreach (var itemDto in request.Items)
            {
                var product = products.First(p => p.Id == itemDto.ProductId);
                
                if (product.StockQuantity < itemDto.Quantity)
                    throw new Exception($"Insufficient stock for product: {product.Name}");

                var orderItem = new OrderItem
                {
                    Order = order,
                    ProductId = product.Id,
                    Quantity = itemDto.Quantity,
                    UnitPrice = product.FinalPrice
                };

                order.OrderItems.Add(orderItem);
                order.TotalAmount += (product.FinalPrice * itemDto.Quantity);
                
                product.StockQuantity -= itemDto.Quantity;
                if(product.StockQuantity == 0)
                {
                    product.Status = "OutOfStock";
                }
            }

            _context.Orders.Add(order);
            await _context.SaveChangesAsync(cancellationToken);

            return order.Id;
        }
    }
}
