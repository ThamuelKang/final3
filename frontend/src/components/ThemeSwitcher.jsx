function ThemeSwitcher({ theme, setTheme }) {
  const themes = [
    { id: "light", icon: "☀️" },
    { id: "dark", icon: "🌙" },
    { id: "duck", icon: "🐥" },
  ];

  return (
    <div className="theme-switcher">
      {themes.map((t) => (
        <button
          key={t.id}
          className={`theme-btn ${theme === t.id ? "active" : ""}`}
          onClick={() => setTheme(t.id)}
          title={`${t.id} theme`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}

export default ThemeSwitcher;
