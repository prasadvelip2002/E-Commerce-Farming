using System;

namespace AgriEcommerce.Core.Entities
{
    public class ProductImage : BaseEntity
    {
        public Guid ProductId { get; set; }
        public Product Product { get; set; } = null!;
        
        public string ImageUrl { get; set; } = string.Empty;
    }
}
