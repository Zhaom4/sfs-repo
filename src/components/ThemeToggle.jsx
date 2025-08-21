import { useState } from "react";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";
import styles from "../components/ThemeToggle.module.css";
import clsx from "clsx";


function ThemeToggle() {
  const [selected, setSelected] = useState("dark");

  const themes = [
    { id: "light", icon: <FaSun /> },
    { id: "dark", icon: <FaMoon /> },
    { id: "system", icon: <FaDesktop /> },
  ];

  return (
    <div className={styles["theme-toggle"]}>
      {themes.map((theme) => (
        <button
          key={theme.id}
          className={clsx(styles["theme-button"],
            selected === theme.id && styles["active"]
          )}
          onClick={() => setSelected(theme.id)}
        >
          {theme.icon}
        </button>
      ))}
    </div>
  );
}

export default ThemeToggle;
