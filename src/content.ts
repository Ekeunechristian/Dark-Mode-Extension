import tinycolor from "tinycolor2";

// Custom dark palette - tweak as you like
const darkPalette = {
  background: "#121212",
  surface: "#1E1E1E",
  primaryText: "#E0E0E0",
  secondaryText: "#A0A0A0",
  accent: "#4FC3F7",  // muted blue accent
  error: "#EF5350",
  warning: "#FFA726",
  border: "#2A2A2A",
};

function isTransparent(color: string): boolean {
  const c = tinycolor(color);
  return c.getAlpha() === 0;
}

function mapBackgroundColor(origColor: string): string {
  const c = tinycolor(origColor);
  if (!c.isValid()) return origColor;
  if (isTransparent(origColor)) return "transparent";

  if (c.isLight()) {
    // Light backgrounds -> dark background or surface
    return tinycolor.mix(darkPalette.background, darkPalette.surface, 30).toString();
  }

  // Already dark bg? Make it slightly lighter surface for layering
  return tinycolor(darkPalette.surface).lighten(5).toString();
}

function mapTextColor(origColor: string, bgColor: string): string {
  const c = tinycolor(origColor);
  const bg = tinycolor(bgColor);

  if (!c.isValid()) return origColor;

  // Transparent text? Leave it
  if (isTransparent(origColor)) return "transparent";

  if (c.isLight()) {
    // Light text on dark bg -> primary text color
    return darkPalette.primaryText;
  }

  if (c.isDark()) {
    // Dark text on dark bg, improve contrast
    const contrast = tinycolor.readability(c, bg);
    if (contrast < 4.5) {
      return darkPalette.secondaryText;
    }
    return c.lighten(20).toString();
  }

  // Accent mapping based on hue
  const hue = c.toHsv().h;

  // Blue-ish hues -> accent
  if (hue >= 180 && hue <= 240) {
    return darkPalette.accent;
  }

  // Reds and yellows keep similar shade but darker
  if ((hue >= 0 && hue <= 30) || (hue >= 330)) {
    return tinycolor(darkPalette.error).toString();
  }

  if (hue >= 30 && hue <= 60) {
    return tinycolor(darkPalette.warning).toString();
  }

  // Otherwise keep original but darken a bit
  return c.darken(20).toString();
}

function mapBorderColor(origColor: string): string {
  const c = tinycolor(origColor);
  if (!c.isValid() || isTransparent(origColor)) return "transparent";

  if (c.isLight()) {
    return tinycolor(darkPalette.border).toString();
  }

  return tinycolor(darkPalette.border).lighten(10).toString();
}

function applyDarkModeToElement(el: HTMLElement) {
  const style = getComputedStyle(el);

  // Background
  const bgOrig = style.backgroundColor;
  if (bgOrig && bgOrig !== "rgba(0, 0, 0, 0)" && bgOrig !== "transparent") {
    const mappedBg = mapBackgroundColor(bgOrig);
    el.style.backgroundColor = mappedBg;
  }

  // Text color
  const colorOrig = style.color;
  if (colorOrig) {
    const mappedText = mapTextColor(colorOrig, el.style.backgroundColor || bgOrig || darkPalette.background);
    el.style.color = mappedText;
  }

  // Border color
  const borderOrig = style.borderColor;
  if (borderOrig && borderOrig !== "rgba(0, 0, 0, 0)" && borderOrig !== "transparent") {
    const mappedBorder = mapBorderColor(borderOrig);
    el.style.borderColor = mappedBorder;
  }

  // Box shadows - optionally remove or darken
  const boxShadow = style.boxShadow;
  if (boxShadow && boxShadow !== "none") {
    // Remove or set subtle dark shadow
    el.style.boxShadow = "0 0 5px rgba(0,0,0,0.4)";
  }
}

function walkDOM(node: Node) {
  if (node.nodeType === Node.ELEMENT_NODE) {
    applyDarkModeToElement(node as HTMLElement);
  }
  node.childNodes.forEach(walkDOM);
}

console.log("🌙 DARK MODE EXTENSION: Applying advanced dark mode...");

walkDOM(document.body);

// Set page background as well
document.documentElement.style.backgroundColor = darkPalette.background;
document.body.style.backgroundColor = darkPalette.background;

console.log("🌙 DARK MODE EXTENSION: Done.");
