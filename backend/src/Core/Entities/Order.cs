using System;
using System.Collections.Generic;

namespace AgriEcommerce.Core.Entities
{
    public class Order : BaseEntity
    {
        public Guid CustomerId { get; set; }
        public User Customer { get; set; } = null!;
        
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Delivered, Cancelled
        public string ShippingAddress { get; set; } = string.Empty;

        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public Delivery? Delivery { get; set; }
    }
}
