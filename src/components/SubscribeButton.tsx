import React from "react";

export default function SubscribeButton() {
  const handleClick = () => {
    window.location.href = "/pro-guide";
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "16px 32px",
        background: "linear-gradient(90deg,#8ed6ff,#436fff)",
        color: "#181821",
        fontWeight: "bold",
        fontSize: 18,
        borderRadius: 16,
        border: "none",
        cursor: "pointer",
      }}
    >
      구독하기
    </button>
  );
}
