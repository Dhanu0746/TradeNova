import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../services/api";
import { socket } from "../services/socket";

import {
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [symbol, setSymbol] = useState("AAPL");
  const [quote, setQuote] = useState(null);
  const [status, setStatus] = useState("Loading...");
  const [watchlist, setWatchlist] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // ✅ INITIAL LOAD
  useEffect(() => {
    const initializeDashboard = async () => {
      const savedToken = localStorage.getItem("tradenova_token");

      if (!savedToken) {
        navigate("/login");
        return;
      }

      // ✅ Only auth failure should log the user out
      try {
        const profile = await request("/api/auth/profile");
        setUser(profile.user);
      } catch (err) {
        console.error("Auth failed:", err);
        localStorage.removeItem("tradenova_token");
        navigate("/login");
        return;
      }

      // ✅ Data loading — failures here should NOT log the user out
      setStatus(null);
      fetchQuote(symbol);
      loadWatchlist();
      loadPortfolio();
    };

    initializeDashboard();
  }, []);

  // ✅ SOCKET
  useEffect(() => {
    socket.connect();

    socket.emit("subscribeMarket", symbol);

    socket.on("marketUpdate", (data) => {
      if (data.symbol === symbol) {
        setQuote((prev) => ({
          ...prev,
          price: data.price,
          priceChange: data.priceChange
        }));
      }
    });

    return () => {
      socket.off("marketUpdate");
      socket.disconnect();
    };
  }, [symbol]);

  // ✅ FETCH QUOTE
  const fetchQuote = async (sym) => {
    try {
      setStatus(`Loading ${sym}...`);

      const data = await request(`/api/market/${sym}`);

      setQuote({
        price: data.price,
        priceChange: data.change,
        open: data.price
      });

      setStatus(null);

    } catch (err) {
      console.error(err);
      setStatus(err.message);
    }
  };

  // ✅ WATCHLIST
  const loadWatchlist = async () => {
    try {
      const data = await request("/api/watchlist");

      setWatchlist(data.watchlist || []);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ PORTFOLIO
  const loadPortfolio = async () => {
    try {
      const data = await request("/api/trade");

      setPortfolio(data);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SEARCH
  const handleSearch = async (e) => {
    e.preventDefault();

    await fetchQuote(symbol);
  };

  // ✅ WATCHLIST ADD
  const addToWatchlist = async () => {
    try {
      const data = await request("/api/watchlist", {
        method: "POST",
        body: { symbol }
      });

      setWatchlist(data.watchlist);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ BUY
  const buyStock = async () => {
    try {
      const data = await request("/api/trade/buy", {
        method: "POST",
        body: {
          symbol,
          price: quote.price
        }
      });

      setPortfolio(data);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ SELL
  const sellStock = async () => {
    try {
      const data = await request("/api/trade/sell", {
        method: "POST",
        body: {
          symbol,
          price: quote.price
        }
      });

      setPortfolio(data);

    } catch (err) {
      console.error(err);
    }
  };

  // ✅ AI CHAT
  const sendMessage = async () => {
    const savedToken = localStorage.getItem("tradenova_token");

    if (!savedToken) {
      navigate("/login");
      return;
    }

    if (!input.trim()) return;

    const userMsg = {
      role: "user",
      text: input
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await request("/api/ai/chat", {
        method: "POST",
        body: {
          message: input
        }
      });

      const aiMsg = {
        role: "ai",
        text: res.reply
      };

      setMessages((prev) => [...prev, aiMsg]);

    } catch (err) {
      console.error(err);
    }

    setInput("");
  };

  const styles = {
    page: {
      display: "flex",
      minHeight: "100vh",
      background: "#000",
      color: "white"
    },

    sidebar: {
      width: "220px",
      background: "#0b0b0b",
      padding: "25px",
      borderRight: "1px solid #222"
    },

    logo: {
      color: "#10b981",
      marginBottom: "25px"
    },

    menu: {
      marginBottom: "15px",
      color: "#bbb",
      cursor: "pointer"
    },

    main: {
      flex: 1,
      padding: "30px"
    },

    topbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },

    searchForm: {
      display: "flex",
      gap: "10px"
    },

    search: {
      padding: "10px",
      borderRadius: "8px",
      background: "#111",
      border: "1px solid #222",
      color: "white"
    },

    button: {
      padding: "10px 16px",
      background: "#10b981",
      border: "none",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer"
    },

    user: {
      background: "#111",
      padding: "8px 14px",
      borderRadius: "8px"
    },

    actions: {
      display: "flex",
      gap: "10px",
      margin: "20px 0"
    },

    action: {
      padding: "10px 14px",
      background: "#111",
      border: "1px solid #222",
      borderRadius: "8px",
      color: "white",
      cursor: "pointer"
    },

    cards: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: "20px"
    },

    card: {
      background: "#111",
      padding: "20px",
      borderRadius: "12px"
    },

    middle: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr",
      gap: "20px",
      marginTop: "20px"
    },

    graph: {
      background: "#111",
      padding: "20px",
      borderRadius: "12px"
    },

    watch: {
      background: "#111",
      padding: "20px",
      borderRadius: "12px"
    },

    table: {
      marginTop: "20px",
      background: "#111",
      padding: "20px",
      borderRadius: "12px"
    },

    row: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #222"
    },

    status: {
      margin: "10px 0",
      color: "#aaa"
    }
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>TradeNova</h2>

        <p style={styles.menu}>Dashboard</p>
        <p style={styles.menu}>Portfolio</p>
        <p style={styles.menu}>Orders</p>
        <p style={styles.menu}>Watchlist</p>
      </aside>

      <main style={styles.main}>
        <div style={styles.topbar}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              value={symbol}
              onChange={(e) =>
                setSymbol(e.target.value.toUpperCase())
              }
              placeholder="Search stock..."
              style={styles.search}
            />

            <button style={styles.button}>
              Search
            </button>
          </form>

          <div style={styles.user}>
            {user ? `Hi, ${user.name}` : "Guest"}
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.action} onClick={buyStock}>
            Buy
          </button>

          <button style={styles.action} onClick={sellStock}>
            Sell
          </button>

          <button
            style={styles.action}
            onClick={addToWatchlist}
          >
            Add to Watchlist
          </button>
        </div>

        {status && (
          <p style={styles.status}>{status}</p>
        )}

        <div style={styles.cards}>
          <div style={styles.card}>
            <h4>Portfolio Value</h4>

            <h2>
              {portfolio
                ? `$${portfolio.balance.toFixed(2)}`
                : "$0.00"}
            </h2>
          </div>

          <div style={styles.card}>
            <h4>Today's Gain</h4>

            <h2 style={{ color: "#10b981" }}>
              +$2,430
            </h2>
          </div>

          <div style={styles.card}>
            <h4>Available Funds</h4>

            <h2>
              {portfolio
                ? `$${portfolio.balance}`
                : "$0"}
            </h2>
          </div>
        </div>

        <div style={styles.middle}>
          <div style={styles.graph}>
            <h3>Performance</h3>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart
                data={[
                  { value: 100 },
                  { value: 120 },
                  { value: 110 },
                  { value: 140 },
                  { value: 130 }
                ]}
              >
                <Line
                  dataKey="value"
                  stroke="#10b981"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.watch}>
            <h3>{symbol}</h3>

            <div style={styles.row}>
              <span>Price</span>

              <span>
                {quote
                  ? `$${quote.price}`
                  : "--"}
              </span>
            </div>

            <div style={styles.row}>
              <span>Change</span>

              <span>
                {quote
                  ? `${quote.priceChange}%`
                  : "--"}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.table}>
          <h3>Watchlist</h3>

          {watchlist.length === 0 ? (
            <p>No stocks added</p>
          ) : (
            watchlist.map((s, i) => (
              <div key={i} style={styles.row}>
                {s}
              </div>
            ))
          )}
        </div>

        <div style={styles.table}>
          <h3>Portfolio</h3>

          {portfolio?.holdings?.length === 0 ? (
            <p>No holdings</p>
          ) : (
            portfolio?.holdings.map((h, i) => (
              <div key={i} style={styles.row}>
                <span>{h.symbol}</span>
                <span>{h.quantity} shares</span>
                <span>${h.avgPrice}</span>
              </div>
            ))
          )}

          <div style={{ marginTop: "10px" }}>
            Balance: $
            {portfolio?.balance?.toFixed(2)}
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            background: "#111",
            padding: "20px",
            borderRadius: "12px"
          }}
        >
          <h3>AI Assistant</h3>

          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              marginBottom: "10px"
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  margin: "5px 0",
                  color:
                    m.role === "user"
                      ? "#10b981"
                      : "#ccc"
                }}
              >
                <strong>
                  {m.role === "user"
                    ? "You"
                    : "AI"}
                  :
                </strong>{" "}
                {m.text}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px"
            }}
          >
            <input
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              placeholder="Ask about stocks..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                background: "#000",
                color: "white"
              }}
            />

            <button
              onClick={sendMessage}
              style={styles.button}
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}