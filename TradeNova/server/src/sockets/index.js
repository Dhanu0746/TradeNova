import { initializeTradeSocket } from "./trade.socket.js";

export const initSocket = (io) => {
  initializeTradeSocket(io);
};