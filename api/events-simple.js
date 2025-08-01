export default async function handler(req, res) {
  try {
    // Enable CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    // Check environment variables
    const dbUser = process.env.DB_USER_NAME;
    const dbPassword = process.env.DB_PASSWORD;

    console.log("Environment check:", {
      hasDbUser: !!dbUser,
      hasDbPassword: !!dbPassword,
      nodeEnv: process.env.NODE_ENV,
    });

    if (req.method === "GET") {
      res.status(200).json({
        message: "Simple events endpoint working",
        environment: {
          hasDbUser: !!dbUser,
          hasDbPassword: !!dbPassword,
          timestamp: new Date().toISOString(),
        },
        // Mock data for testing
        events: [
          {
            _id: "test123",
            eventName: "Test Event",
            category: "Test",
            description: "This is a test event",
            startDate: "2025-01-01",
            endDate: "2025-01-02",
            sold: 0,
          },
        ],
      });
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error("Function error:", error);
    res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
}
