import { SKINS, setSkin, toggleTheme, useSkin, useTheme, type Skin } from "../../utils/theme";
import Icon from "./Icon";

const SkinSymbol = ({ skin }: { skin: Skin }) => skin === "bb" ? (
  <svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true" fill="none">
    <rect x="3.5" y="3.5" width="21" height="21" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <text x="6.5" y="10" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="5" fontWeight="600">35</text>
    <text x="14" y="21" textAnchor="middle" fill="currentColor" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700">Br</text>
  </svg>
) : <Icon name="hat" size={28} />;

export const SkinSwitch = () => {
  const selected = useSkin();
  return (
    <div className="skin-switch" role="group" aria-label="Visual theme">
      {(["bb", "rdr2"] as const).map((skin) => (
        <button
          key={skin}
          type="button"
          className={`skin-option skin-option--${skin}`}
          aria-label={`${SKINS[skin].name} theme`}
          aria-pressed={selected === skin}
          title={`${SKINS[skin].name} · T to switch`}
          onClick={() => setSkin(skin)}
        >
          <SkinSymbol skin={skin} />
          <span className="theme-control-tooltip" aria-hidden="true">{SKINS[skin].name}</span>
        </button>
      ))}
    </div>
  );
};

export const ModeSwitch = () => {
  const mode = useTheme();
  const next = mode === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="mode-switch"
      onClick={toggleTheme}
      aria-label={`Switch to ${next} mode (L)`}
      title={`${next === "light" ? "Light" : "Dark"} mode · L`}
    >
      <Icon name={mode === "dark" ? "sun" : "moon"} size={20} />
      <span className="theme-control-tooltip" aria-hidden="true">{next === "light" ? "Light" : "Dark"} mode</span>
    </button>
  );
};
