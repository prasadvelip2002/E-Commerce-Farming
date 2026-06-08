using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace AgriEcommerce.API.Hubs
{
    public class DeliveryTrackingHub : Hub
    {
        public async Task JoinTrackingGroup(string trackingId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, trackingId);
        }

        public async Task LeaveTrackingGroup(string trackingId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, trackingId);
        }
    }
}
