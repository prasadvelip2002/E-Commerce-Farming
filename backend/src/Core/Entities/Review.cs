using System;

namespace AgriEcommerce.Core.Entities
{
    public class Review : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;
        
        public Guid CustomerId { get; set; }
        public User Customer { get; set; } = null!;
        
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
}
