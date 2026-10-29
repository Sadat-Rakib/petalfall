import "./embed.css";
import {
  createPetalfall,
  BONSAI_FORMS,
  FORMS,
  PALETTES,
  TREE_DEFAULTS,
  type FormOption,
  type Petalfall,
  type PetalfallOptions,
  type TreeOption,
  type Weather,
} from "./index";
import { makeRamp } from "./palettes";
import { css } from "./color";

// The embed builder: pick options on the left, watch the tree on the right, copy code that
// reproduces exactly what you see. The preview is the same engine the library ships.

interface State {
  tree: TreeOption;
  form: FormOption;
  palette: string;
  weather: Weather;
  rain: boolean;
  wind: number; // 0..10, 0 is still air
  petals: number; // 1..10
  background: "sky" | "transparent";
  detail: boolean;
  height: number; // px, used in the generated snippet
}

const state: State = {
  tree: "sakura",
  form: TREE_DEFAULTS.sakura.form,
  palette: TREE_DEFAULTS.sakura.palette,
  weather: "clear",
  rain: false,
  wind: 3,
  petals: 5,
  background: "sky",
  detail: false,
  height: 420,
};

const WEATHER_LABELS: Readonly<Record<Weather, string>> = {
  clear: "Clear",
  sunset: "Sunset",
  moonlight: "Moonlight",
  overcast: "Overcast",
  mist: "Mist",
};

const HEIGHTS = [320, 420, 560];

const $ = (id: string): HTMLElement => document.getElementById(id)!;
const cap = (s: string): string => s[0].toUpperCase() + s.slice(1);

const petalfall: Petalfall = createPetalfall($("preview"), options());

function options(): PetalfallOptions {
  return {
    tree: state.tree,
    form: state.form,
    palette: state.palette as PetalfallOptions["palette"],
    weather: state.weather,
    rain: state.rain,
    wind: state.wind === 0 ? false : state.wind,
    petals: state.petals,
    background: state.background,
    detail: state.detail,
  };
}

// ---- the generated code -------------------------------------------------------------

/** Only the choices that differ from the defaults, so a default tree stays a two liner. */
function codeEntries(): string[] {
  const d = TREE_DEFAULTS[state.tree];
  const entries: string[] = [];
  if (state.tree !== "sakura") entries.push(`tree: "${state.tree}"`);
  if (state.form !== d.form) entries.push(`form: "${state.form}"`);
  if (state.palette !== d.palette) entries.push(`palette: "${state.palette}"`);
  if (state.weather !== "clear") entries.push(`weather: "${state.weather}"`);
  if (state.rain) entries.push("rain: true");
  if (state.detail) entries.push("detail: true");
  if (state.wind !== 3) entries.push(`wind: ${state.wind}`);
  if (state.petals !== 5) entries.push(`petals: ${state.petals}`);
  if (state.background !== "sky") entries.push(`background: "${state.background}"`);
  return entries;
}

function attrLines(): string[] {
  return codeEntries().map((entry) => {
    const [key, value] = entry.split(": ");
    return value === "true" ? key : `${key}=${value}`;
  });
}

function htmlSnippet(): string {
  const style = `style="width: 100%; height: ${state.height}px"`;
  const attrs = attrLines();
  const tag = attrs.length
    ? `<petal-fall\n  ${attrs.join("\n  ")}\n  ${style}\n></petal-fall>`
    : `<petal-fall ${style}></petal-fall>`;
  return `<script src="https://unpkg.com/petalfall"><\/script>\n\n${tag}`;
}

function optionsBlock(indent: string): string {
  const entries = codeEntries();
  if (!entries.length) return "{}";
  const closing = indent.slice(2) || "";
  return `{\n${entries.map((e) => `${indent}${e},`).join("\n").replace(/,$/, "")}\n${closing}}`;
}

function reactSnippet(): string {
  return `"use client"; // needed in Next.js; remove it anywhere else

import { useEffect, useRef } from "react";
import { createPetalfall } from "petalfall";

export default function PetalfallTree() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const petalfall = createPetalfall(ref.current!, ${optionsBlock("      ")});
    return () => petalfall.destroy();
  }, []);

  return <div ref={ref} style={{ width: "100%", height: ${state.height} }} />;
}`;
}

function vueSnippet(): string {
  return `<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { createPetalfall } from "petalfall";

const stage = ref(null);
let petalfall;

onMounted(() => {
  petalfall = createPetalfall(stage.value, ${optionsBlock("    ")});
});

onBeforeUnmount(() => {
  petalfall?.destroy();
});
<\/script>

<template>
  <div ref="stage" style="width: 100%; height: ${state.height}px"></div>
</template>`;
}

const SNIPPETS: Readonly<Record<string, () => string>> = {
  HTML: htmlSnippet,
  React: reactSnippet,
  Vue: vueSnippet,
};
let activeTab = "HTML";

// ---- UI helpers ----------------------------------------------------------------------

function seg(id: string, choices: { value: string; label: string }[], current: string, onPick: (value: string) => void): void {
  const box = $(id);
  box.textContent = "";
  for (const choice of choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = choice.label;
    button.dataset.value = choice.value;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(choice.value === current));
    button.onclick = () => onPick(choice.value);
    box.appendChild(button);
  }
}

function setSegChecked(id: string, value: string): void {
  for (const button of $(id).querySelectorAll<HTMLButtonElement>("button")) {
    button.setAttribute("aria-checked", String(button.dataset.value === value));
  }
}

function switchBox(id: string, initial: boolean, onToggle: (on: boolean) => void): void {
  const box = $(id);
  box.setAttribute("aria-checked", String(initial));
  box.onclick = () => {
    const on = box.getAttribute("aria-checked") !== "true";
    box.setAttribute("aria-checked", String(on));
    onToggle(on);
  };
}

function toast(message: string): void {
  const box = $("toast");
  box.textContent = message;
  box.classList.add("show");
  window.setTimeout(() => box.classList.remove("show"), 2200);
}

// ---- build the panel -------------------------------------------------------------------

function fillFormChoices(): void {
  const select = $("sel-form") as HTMLSelectElement;
  const forms = (state.tree === "bonsai" ? BONSAI_FORMS : FORMS).filter((f) => f !== "random");
  select.textContent = "";
  for (const form of forms) {
    const option = document.createElement("option");
    option.value = form;
    option.textContent = cap(form);
    select.appendChild(option);
  }
  select.value = state.form;
}

function fillSwatches(): void {
  const box = $("swatches");
  box.textContent = "";
  for (const name of PALETTES) {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(name === state.palette));
    const dot = document.createElement("i");
    dot.className = "emb-dot";
    dot.style.background = css(makeRamp(name)[3]);
    const label = document.createElement("span");
    label.textContent = name;
    button.appendChild(dot);
    button.appendChild(label);
    button.onclick = () => {
      state.palette = name;
      sync();
    };
    box.appendChild(button);
  }
}

function fillTabs(): void {
  const box = $("tabs");
  box.textContent = "";
  for (const name of Object.keys(SNIPPETS)) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(name === activeTab));
    button.onclick = () => {
      activeTab = name;
      fillTabs();
      refreshCode();
    };
    box.appendChild(button);
  }
}

// ---- sync -------------------------------------------------------------------------------

function refreshCode(): void {
  $("code").textContent = SNIPPETS[activeTab]();
}

function syncPreviewSize(): void {
  $("preview-box").style.height = `${state.height}px`;
  $("preview-box").classList.toggle("transparent", state.background === "transparent");
}

function sync(): void {
  petalfall.set(options());
  syncPreviewSize();
  $("val-wind").textContent = state.wind === 0 ? "off" : String(state.wind);
  $("val-petals").textContent = String(state.petals);
  $("sw-rain").setAttribute("aria-checked", String(state.rain));
  $("sw-detail").setAttribute("aria-checked", String(state.detail));
  setSegChecked("seg-tree", state.tree);
  setSegChecked("seg-weather", state.weather);
  setSegChecked("seg-background", state.background);
  setSegChecked("seg-height", String(state.height));
  for (const button of $("swatches").querySelectorAll("button")) {
    button.setAttribute("aria-checked", String(button.textContent === state.palette));
  }
  refreshCode();
}

// ---- wire it up --------------------------------------------------------------------------

seg(
  "seg-tree",
  [
    { value: "sakura", label: "Sakura" },
    { value: "bonsai", label: "Bonsai" },
  ],
  state.tree,
  (value) => {
    state.tree = value as TreeOption;
    state.form = TREE_DEFAULTS[state.tree].form;
    state.palette = TREE_DEFAULTS[state.tree].palette;
    fillFormChoices();
    sync();
  },
);

$("sel-form").onchange = () => {
  state.form = ($("sel-form") as HTMLSelectElement).value as FormOption;
  sync();
};

seg(
  "seg-weather",
  (Object.keys(WEATHER_LABELS) as Weather[]).map((w) => ({ value: w, label: WEATHER_LABELS[w] })),
  state.weather,
  (value) => {
    state.weather = value as Weather;
    sync();
  },
);

switchBox("sw-rain", state.rain, (on) => {
  state.rain = on;
  sync();
});

switchBox("sw-detail", state.detail, (on) => {
  state.detail = on;
  sync();
});

$("rng-wind").oninput = () => {
  state.wind = Number(($("rng-wind") as HTMLInputElement).value);
  sync();
};

$("rng-petals").oninput = () => {
  state.petals = Number(($("rng-petals") as HTMLInputElement).value);
  sync();
};

seg(
  "seg-background",
  [
    { value: "sky", label: "Night sky" },
    { value: "transparent", label: "Transparent" },
  ],
  state.background,
  (value) => {
    state.background = value as State["background"];
    sync();
  },
);

seg(
  "seg-height",
  HEIGHTS.map((h) => ({ value: String(h), label: `${h}px` })),
  String(state.height),
  (value) => {
    state.height = Number(value);
    sync();
  },
);

$("btn-regrow").onclick = () => petalfall.regrow();

$("btn-copy").onclick = async () => {
  const code = SNIPPETS[activeTab]();
  const button = $("btn-copy");
  try {
    await navigator.clipboard.writeText(code);
  } catch {
    // clipboard can be blocked: fall back to a hidden selection
    const helper = document.createElement("textarea");
    helper.value = code;
    document.body.appendChild(helper);
    helper.select();
    const ok = document.execCommand("copy");
    helper.remove();
    if (!ok) {
      toast("Copy failed. Select the code and copy it manually.");
      return;
    }
  }
  button.textContent = "Copied!";
  button.classList.add("copied");
  window.setTimeout(() => {
    button.textContent = "Copy code";
    button.classList.remove("copied");
  }, 1800);
};

fillFormChoices();
fillSwatches();
fillTabs();
sync();
