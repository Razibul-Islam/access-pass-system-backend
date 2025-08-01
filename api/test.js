export default function handler(req, res) {
  res.status(200).json({
    message: "Vercel serverless function is working!",
    method: req.method,
    timestamp: new Date().toISOString(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
    },
  });
}
