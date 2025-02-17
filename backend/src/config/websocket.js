import { WebSocketServer } from "ws";
import url from "url";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
// import environmentData from "../models/environmentData.model.js";

function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  // Map to store active WebSocket connections
  const clients = new Map();
        // const heartbeat = () => (this.isAlive = true);

  wss.on("connection", async (ws, req) => {
    const queryObject = url.parse(req.url, true).query;
    const userId = queryObject.userid;

    // if (!userId) {
    //   ws.close(4001, "Missing userID in query params.");
    //   return;
    // }

    try {
      if(userId){
      const user = await User.findById(userId).select(
        "-password -refreshToken"
      );
      if (!user) {
        console.error(`User not found for userID: ${userId}`);
        ws.close(4002, "User authentication fobjectailed.");
        return;
      }

      clients.set(userId, ws);
    }
    console.log("Total clients",clients.size)
                  // ws.isAlive = true;
                  // ws.on("pong", heartbeat);
                  //   console.log(`User connected: ${userId}`);
                  // console.log(clients.get(userId));

      ws.on("message", async (message) => {
        // console.log(`Received message from ${userId}: ${message}`);
        try {
          console.log("ESP32 connected");
          const data = JSON.parse(message);
          console.log(data)
          // const newData = new environmentData({
          //   temperature: data.temperature,
          //   humidity: data.humidity,
          //   ch4_ppm: data.ch4_ppm,
          // });
          // await newData.save(); // Save to database
          // console.log("Environment data saved to database.")
          clients.forEach((client, clientId) => {
            if (client.readyState === client.OPEN) {
              const notification = {
                temperature: data.temperature,
                humidity: data.humidity,
                ch4_ppm:data.ch4_ppm
              };
              client.send(JSON.stringify(notification));
              console.log(`Sent data to user: ${clientId}`);
            }
          });
          if (data.temperature < 10) {
            ws.send("r");
            console.log("Sent 'r' to ESP32 due to high temperature.");
            const notification = {
              message: `⚠️ High Temperature Alert! Temp=${data.temperature}°C`,
              createdAt: new Date(),
            };
            await saveNotificationForConnectedUsers(notification);
            // Broadcast notification to all users
            clients.forEach((client, clientId) => {
              if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(notification));
                console.log(`Sent data to user: ${clientId}`);
              }
            });

          }else{
            ws.send("s");
            console.log("Sent 's' to ESP32 due to optimal temperature.");
          }

          if(data.humidity < 50){
            ws.send("w");
            console.log("Sent 'w' to ESP32 due to low humidity.");s
            const notification = {
              message: `⚠️ Low Humidity Alert! Temp=${data.humidity}°C`,
              createdAt: new Date(),
            };
            await saveNotificationForConnectedUsers(notification);
            // Broadcast notification to all users
            clients.forEach((client, clientId) => {
              if (client.readyState === client.OPEN) {
                client.send(JSON.stringify(notification));
                console.log(`Sent data to user: ${clientId}`);
              }
            });
          }else{
            ws.send("q");
            console.log("Sent 'q' to ESP32 due to optimal humidity.");
          }
        } catch (error) {
          console.error("Invalid JSON received:", message.toString());
        }
      });
      
     
     

      // Run daily average computation every hour
   

      ws.on("close", () => {
        // clients.delete(userId);
        ws.removeAllListeners();
        // console.log(`User disconnected: ${userId}`);
      });
    } catch (error) {
      console.error(`Error during WebSocket setup: ${error.message}`);
      ws.close(4002, "Internal server error during WebSocket setup.");
    }
  });

  
  async function saveNotificationForConnectedUsers(notification) {
    try {
      const connectedUserIds = Array.from(clients.keys()); // Get connected users' IDs
      if (connectedUserIds.length === 0) return; // No connected users, no need to save

      const notificationsToInsert = connectedUserIds.map((userId) => ({
        receiverID: userId,
        message: notification.message,
      }));

      await Notification.insertMany(notificationsToInsert);
      console.log("Notifications saved for connected users.");
    } catch (error) {
      console.error("Error saving notifications:", error.message);
    }
  }

  return {
    sendNotificationToSpecificUser: (targetUserId, notification) => {
      const userId = targetUserId.toString();
      const client = clients.get(userId);
      if (client && client.readyState === client.OPEN) {
        client.send(JSON.stringify(notification));
        console.log(`Socket Notification sent to user: ${userId}`);
      } else {
        console.log(`Target user ${userId} is not connected`);
      }
    },
  };
}

export { setupWebSocket };
