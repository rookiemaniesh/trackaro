import type { NextConfig } from "next";
import { networkInterfaces } from "os";

// Function to get local network IPs
function getLocalNetworkIPs(): string[] {
  const interfaces = networkInterfaces();
  const ips: string[] = [];
  
  for (const name of Object.keys(interfaces)) {
    const networkInterface = interfaces[name];
    if (networkInterface) {
      for (const iface of networkInterface) {
        // Skip internal (localhost) and IPv6 addresses
        if (!iface.internal && iface.family === 'IPv4') {
          ips.push(iface.address);
        }
      }
    }
  }
  
  return ips;
}

const nextConfig: NextConfig = {
  /* config options here */
  
  // Allow cross-origin requests for mobile development
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // Configure development server for mobile testing
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      // Allow cross-origin requests in development
      allowedDevOrigins: [
        ...getLocalNetworkIPs(), // Automatically detect local network IPs
        '192.168.0.0/16', // Local network range
        '10.0.0.0/8',     // Private network range
        '172.16.0.0/12',  // Private network range
      ],
    },
  }),
};

export default nextConfig;
