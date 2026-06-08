using System;
using System.Collections.Generic;

namespace AgriEcommerce.Core.Entities
{
    public class Product : BaseEntity
    {
        public Guid FarmerProfileId { get; set; }
        public FarmerProfile FarmerProfile { get; set; } = null!;
        
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string UnitOfMeasure { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public decimal AdminMargin { get; set; }
        public decimal FinalPrice { get; set; }
        public int StockQuantity { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Active, OutOfStock

        // Crop Origin Details
        public string FarmLocation { get; set; } = string.Empty;
        public string SoilType { get; set; } = string.Empty;
        public double AcresGrown { get; set; }

        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
