export const initializeTradeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("subscribeMarket", (symbol) => {
      console.log("📡 Subscribed to:", symbol);

      const interval = setInterval(() => {
        const price = (Math.random() * 200 + 100).toFixed(2);
        const change = (Math.random() * 5 - 2.5).toFixed(2);

        socket.emit("marketUpdate", {
          symbol,
          price: Number(price),
          priceChange: Number(change),
        });
      }, 2000);

      socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
        clearInterval(interval);
      });
    });
  });
};