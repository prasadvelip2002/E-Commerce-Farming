using System;

namespace AgriEcommerce.Core.Entities
{
    public class Delivery : BaseEntity
    {
        public Guid OrderId { get; set; }
        public Order Order { get; set; } = null!;
        
        public Guid DeliveryProviderId { get; set; }
        public User DeliveryProvider { get; set; } = null!;
        
        public string Status { get; set; } = "Assigned"; // Assigned, PickedUp, InTransit, Delivered
        public string TrackingUrl { get; set; } = string.Empty;
    }
}
