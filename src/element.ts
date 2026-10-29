import { createPetalfall, DEFAULTS, TREE_DEFAULTS, TREES, type Petalfall, type PetalfallOptions } from "./petalfall";

// <petalfall palette="lavender" form="shidare" weather="rain" rain></petalfall>
// <petalfall tree="bonsai" form="kengai" palette="maple"></petalfall>
//
// Importing this file registers the element. Style it like any block: give it a width and a height.
const ATTRIBUTES = ["tree", "palette", "form", "detail", "petals", "wind", "weather", "rain", "background", "fps", "seed", "interactive", "cursor", "sound"] as const;

const STYLE_ID = "petalfall-style";

export class PetalfallElement extends HTMLElement {
  static observedAttributes = [...ATTRIBUTES];

  private petalfall: Petalfall | null = null;

  /** The running scene, for methods such as `gust()` and `regrow()`. */
  get instance(): Petalfall | null {
    return this.petalfall;
  }

  connectedCallback(): void {
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = "petalfall{display:block;position:relative;min-height:240px;overflow:hidden}";
      document.head.prepend(style); // first, so any style of yours wins
    }
    if (!this.petalfall) this.petalfall = createPetalfall(this, this.read());
  }

  disconnectedCallback(): void {
    this.petalfall?.destroy();
    this.petalfall = null;
  }

  attributeChangedCallback(): void {
    this.petalfall?.set(this.read());
  }

  // A switch is on when the attribute is there and not "false"; one that is on by default is off only when it says "false".
  private flag(name: string, fallback: boolean): boolean {
    const value = this.getAttribute(name);
    if (value === null) return fallback;
    return value !== "false";
  }

  private number(name: string): number | undefined {
    const value = this.getAttribute(name);
    return value === null || value === "" ? undefined : Number(value);
  }

  private read(): PetalfallOptions {
    const wind = this.getAttribute("wind");
    const asked = this.getAttribute("tree");
    const tree = TREES.find((t) => t === asked) ?? DEFAULTS.tree;
    return {
      tree,
      // what is not given falls back to what suits the tree: green leaves for a bonsai, blossom for the cherry
      palette: (this.getAttribute("palette") ?? TREE_DEFAULTS[tree].palette) as PetalfallOptions["palette"],
      form: (this.getAttribute("form") ?? TREE_DEFAULTS[tree].form) as PetalfallOptions["form"],
      weather: (this.getAttribute("weather") ?? DEFAULTS.weather) as PetalfallOptions["weather"],
      background: (this.getAttribute("background") ?? DEFAULTS.background) as PetalfallOptions["background"],
      detail: this.hasAttribute("detail") && this.getAttribute("detail") !== "false",
      rain: this.hasAttribute("rain") && this.getAttribute("rain") !== "false",
      sound: this.hasAttribute("sound") && this.getAttribute("sound") !== "false",
      interactive: this.flag("interactive", true),
      cursor: this.flag("cursor", true),
      wind: wind === "off" || wind === "false" ? false : this.number("wind"),
      petals: this.number("petals"),
      fps: this.number("fps"),
      seed: this.number("seed"),
    };
  }
}

if (typeof customElements !== "undefined" && !customElements.get("petalfall")) {
  customElements.define("petalfall", PetalfallElement);
}
