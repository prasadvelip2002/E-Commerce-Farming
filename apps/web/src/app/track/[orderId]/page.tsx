'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

interface LocationUpdate {
  latitude: number;
  longitude: number;
  timestamp: string;
}

export default function TrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  
  const [status, setStatus] = useState('Connecting...');
  const [location, setLocation] = useState<LocationUpdate>({ latitude: 19.9975, longitude: 73.7898, timestamp: new Date().toISOString() });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    const connectToHub = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/hubs/delivery`)
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        connection.on('ReceiveStatusUpdate', (data: any) => {
          setStatus(data.status);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        connection.on('ReceiveLocationUpdate', (data: any) => {
          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
            timestamp: data.timestamp
          });
        });

        await connection.start();
        await connection.invoke('JoinTrackingGroup', orderId);
        
        setStatus('Tracking active (waiting for updates...)');

        return () => {
          connection.invoke('LeaveTrackingGroup', orderId);
          connection.stop();
        };
      } catch (err) {
        setError('Failed to connect to tracking server.');
        console.error(err);
      }
    };

    const cleanup = connectToHub();
    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, [orderId]);

  // Map latitude/longitude to a CSS grid. 
  // Let's pretend Nashik (19.9975, 73.7898) is top left and Pune (18.5204, 73.8567) is bottom right.
  // We'll normalize these to percentages for the mock map.
  
  const normalize = (val: number, min: number, max: number) => {
    return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100));
  };

  const topPercent = normalize(location.latitude, 20.0, 18.5); // flipped because lat goes down as we go south
  const leftPercent = normalize(location.longitude, 73.7, 74.0);

  const simulateMovement = () => {
    // Helper to send a fake movement ping to the local API
    const newLat = location.latitude - 0.1;
    const newLon = location.longitude + 0.02;
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5153'}/api/deliveries/update-location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deliveryId: orderId,
        latitude: newLat,
        longitude: newLon
      })
    });
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Tracking</h1>
        <p className="text-gray-500 mb-8 font-mono text-sm">Order: {orderId}</p>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Current Status</p>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <p className="font-bold text-gray-900 text-lg">{status}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-semibold mb-1">Last Updated</p>
              <p className="font-mono text-gray-700">{new Date(location.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>

          {/* Map Container */}
          <div className="relative w-full h-[500px] bg-blue-50 rounded-2xl border border-gray-200 overflow-hidden shadow-inner">
            {/* Map Grid Pattern Background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4A7C59 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            {/* Start / End Markers */}
            <div className="absolute top-[10%] left-[10%] text-2xl" title="Nashik Farm">👨‍🌾</div>
            <div className="absolute bottom-[20%] right-[20%] text-2xl" title="Your House">🏠</div>

            {/* Moving Truck */}
            <div 
              className="absolute text-4xl transition-all duration-1000 ease-linear transform -translate-x-1/2 -translate-y-1/2 drop-shadow-lg z-10"
              style={{ top: `${topPercent}%`, left: `${leftPercent}%` }}
            >
              🚚
            </div>

            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg border border-gray-200 text-xs font-mono text-gray-600 shadow-sm">
              LAT: {location.latitude.toFixed(4)} <br/>
              LON: {location.longitude.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Demo Button to simulate driver movement */}
        <div className="text-center">
          <button 
            onClick={simulateMovement}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-indigo-600/30"
          >
            (Demo) Trigger Driver Movement
          </button>
          <p className="text-xs text-gray-400 mt-3 max-w-sm mx-auto">
            In production, the driver&apos;s mobile app would continuously POST GPS coordinates to the API, which instantly broadcasts them here over SignalR.
          </p>
        </div>
      </div>
    </div>
  );
}
