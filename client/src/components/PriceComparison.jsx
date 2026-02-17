import React, { useState, useEffect } from "react";
import axios from "axios";
import useToast from "../hooks/useToast";
import "./Styles/PriceComparison.css";

const apiUrl = process.env.REACT_APP_API_HOST;
const IS_MOBILE = () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;

function PriceComparison({ gameId, gameName }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const addToast = useToast();

  useEffect(() => {
    if (!gameId) return;
    setLoading(true);

    axios
      .get(`${apiUrl}/videogame/${gameId}/prices`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.error("Error loading prices:", err);
        setData({
          deals: [],
          fallbackLinks: [
            { storeName: "Steam", url: `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName || "")}` },
            { storeName: "GOG", url: `https://www.gog.com/en/games?search=${encodeURIComponent(gameName || "")}` },
            { storeName: "Epic Games", url: `https://store.epicgames.com/en-US/browse?q=${encodeURIComponent(gameName || "")}` },
            { storeName: "Humble Bundle", url: `https://www.humblebundle.com/store/search?search=${encodeURIComponent(gameName || "")}` },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [gameId, gameName]);

  const hasDeals = data?.deals?.length > 0;
  const hasFallback = data?.fallbackLinks?.length > 0;
  const hasContent = hasDeals || hasFallback;

  const handleStoreClick = (storeName) => {
    if (IS_MOBILE()) {
      addToast(`Opening ${storeName}…`, { type: "info", duration: 2000 });
    }
  };

  if (loading) {
    return (
      <section className="pc-section">
        <h2 className="pc-title">Where to buy</h2>
        <div className="pc-skeleton">
          <div className="pc-skeleton__row" />
          <div className="pc-skeleton__row" />
          <div className="pc-skeleton__row" />
          <div className="pc-skeleton__row" />
        </div>
      </section>
    );
  }

  if (!hasContent) return null;

  const formatPrice = (price) =>
    typeof price === "number" && !isNaN(price)
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)
      : "";

  return (
    <section className="pc-section">
      <h2 className="pc-title">Where to buy</h2>
      <div className="pc-content">
        {hasDeals && (
          <div className="pc-deals">
            <p className="pc-subtitle">Price comparison</p>
            <ul className="pc-list">
              {data.deals.map((deal, i) => (
                <li
                  key={`${deal.storeID}-${i}`}
                  className={`pc-item ${i === 0 ? "pc-item--best" : ""}`}
                >
                  <span className="pc-item__store">
                    {deal.storeName}
                    {i === 0 && (
                      <span className="pc-item__badge">Best price</span>
                    )}
                  </span>
                  <span className="pc-item__prices">
                    {deal.savings > 0 && (
                      <span className="pc-item__retail">{formatPrice(deal.retailPrice)}</span>
                    )}
                    <span
                      className={`pc-item__price ${i === 0 ? "pc-item__price--best" : ""}`}
                    >
                      {formatPrice(deal.price)}
                    </span>
                    {deal.savings > 0 && (
                      <span className="pc-item__savings">
                        -{Math.round(deal.savings)}%
                      </span>
                    )}
                  </span>
                  <a
                    href={deal.dealUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pc-item__link"
                    onClick={() => handleStoreClick(deal.storeName)}
                  >
                    Buy
                    <span className="material-symbols-rounded">open_in_new</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(!hasDeals || hasFallback) && (
          <div className="pc-fallback">
            <p className="pc-subtitle">
              {hasDeals ? "Search more stores" : "Search stores"}
            </p>
            <ul className="pc-list pc-list--links">
              {data.fallbackLinks.map((link) => (
                <li key={link.storeName}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pc-fallback__link"
                    onClick={() => handleStoreClick(link.storeName)}
                  >
                    {link.storeName}
                    <span className="material-symbols-rounded">open_in_new</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="pc-disclaimer">
          Prices may vary. Links via CheapShark.
        </p>
      </div>
    </section>
  );
}

export default PriceComparison;
