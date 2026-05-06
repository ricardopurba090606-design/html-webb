export default function Learn() {
  const cards = [
    {
      id: 1,
      category: "Design",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      ),
      title: "Adobe Photoshop",
      time: "in 3 days",
      avatars: ["#4A90D9", "#E87C5A", "#6BC47E"],
      extraCount: 9,
      bg: "#DCF0FA",
      textColor: "#1a3a5c",
      categoryColor: "#3a6a9c",
      size: "large",
      starred: false,
    },
    {
      id: 2,
      category: "AI",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
          <polygon points="10,8 16,11.5 10,15" fill="currentColor" stroke="none"/>
        </svg>
      ),
      title: "DALL·E 2, Midjourney, Stable Diffusion",
      time: "in 5 days",
      avatars: ["#E87C5A", "#4A90D9"],
      extraCount: 3,
      bg: "#D7F0D7",
      textColor: "#1a3a2a",
      categoryColor: "#2a6a3a",
      size: "large",
      starred: true,
    },
    {
      id: 3,
      category: "Design",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      ),
      title: "Figma",
      time: "8 hours ago",
      avatars: [],
      extraCount: 0,
      bg: "#E2DCFA",
      textColor: "#2a1a5c",
      categoryColor: "#5a3a9c",
      size: "small",
      starred: false,
    },
    {
      id: 4,
      category: "Coding",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      ),
      title: "Python",
      time: "2 days ago",
      avatars: [],
      extraCount: 0,
      bg: "#FAE8DC",
      textColor: "#5c2a1a",
      categoryColor: "#9c4a2a",
      size: "small",
      starred: false,
    },
    {
      id: 5,
      category: "Design",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" />
        </svg>
      ),
      title: "Sketch",
      time: "4 days ago",
      avatars: [],
      extraCount: 0,
      bg: "#FAD7DC",
      textColor: "#5c1a2a",
      categoryColor: "#9c2a3a",
      size: "small",
      starred: false,
    },
  ];

  const StarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );

  const LogoIcon = () => (
    <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
      <path d="M14 2 L26 9 L26 16 L14 10 L2 16 L2 9 Z" fill="#9ca3af" />
      <path d="M2 16 L14 22 L26 16 L26 23 L14 30 L2 23 Z" fill="#9ca3af" opacity="0.6" />
    </svg>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0f0f0",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: "32px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Logo */}
      <div style={{ marginBottom: "32px" }}>
        <LogoIcon />
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "auto auto",
          gap: "16px",
          maxWidth: "900px",
        }}
      >
        {/* Large card 1 - Adobe Photoshop */}
        <div
          style={{
            gridColumn: "1 / 2",
            gridRow: "1 / 2",
            backgroundColor: cards[0].bg,
            borderRadius: "20px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "220px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: cards[0].categoryColor,
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {cards[0].icon}
            <span>{cards[0].category}</span>
          </div>
          <div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: cards[0].textColor,
                margin: "0 0 12px 0",
                lineHeight: 1.3,
              }}
            >
              {cards[0].title}
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: cards[0].categoryColor }}>{cards[0].time}</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                {cards[0].avatars.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: color,
                      border: "2px solid white",
                      marginLeft: i === 0 ? 0 : "-8px",
                      zIndex: cards[0].avatars.length - i,
                      position: "relative",
                    }}
                  />
                ))}
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    backgroundColor: "#c8d8e8",
                    border: "2px solid white",
                    marginLeft: "-8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    color: cards[0].categoryColor,
                    fontWeight: 600,
                    position: "relative",
                    zIndex: 0,
                  }}
                >
                  {cards[0].extraCount}+
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large card 2 - AI */}
        <div
          style={{
            gridColumn: "2 / 4",
            gridRow: "1 / 2",
            backgroundColor: cards[1].bg,
            borderRadius: "20px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: "220px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: cards[1].categoryColor,
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {cards[1].icon}
              <span>{cards[1].category}</span>
            </div>
            <span style={{ color: cards[1].categoryColor }}>
              <StarIcon />
            </span>
          </div>
          <div>
            <h2
              style={{
                fontSize: "26px",
                fontWeight: 700,
                color: cards[1].textColor,
                margin: "0 0 12px 0",
                lineHeight: 1.3,
              }}
            >
              {cards[1].title}
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", color: cards[1].categoryColor }}>{cards[1].time}</span>
              <div style={{ display: "flex", alignItems: "center" }}>
                {cards[1].avatars.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      backgroundColor: color,
                      border: "2px solid white",
                      marginLeft: i === 0 ? 0 : "-8px",
                      zIndex: cards[1].avatars.length - i,
                      position: "relative",
                    }}
                  />
                ))}
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    backgroundColor: "#b8d8b8",
                    border: "2px solid white",
                    marginLeft: "-8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    color: cards[1].categoryColor,
                    fontWeight: 600,
                    position: "relative",
                    zIndex: 0,
                  }}
                >
                  {cards[1].extraCount}+
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Small cards row */}
        {cards.slice(2).map((card) => (
          <div
            key={card.id}
            style={{
              backgroundColor: card.bg,
              borderRadius: "20px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "180px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: card.categoryColor,
                fontSize: "13px",
                fontWeight: 500,
              }}
            >
              {card.icon}
              <span>{card.category}</span>
            </div>
            <div>
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: card.textColor,
                  margin: "0 0 6px 0",
                }}
              >
                {card.title}
              </h2>
              <p style={{ fontSize: "13px", color: card.categoryColor, margin: 0 }}>{card.time}</p>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}