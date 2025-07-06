// src/Popup.tsx
import React, { useEffect, useState } from "react";

export function Popup() {
  const [pos, setPos] = useState(0);

  const MIN = 0.01; // 0.01%
  const MAX = 95; // 95%
  const MID = 10; // desired freq at slider = 50

  // compute ratio and exponent so that at p=50, freq≈MID
  const R = MAX / MIN; // overall ratio
  const fracMid = Math.log(MID / MIN) / Math.log(R);
  const exponent = Math.log(fracMid) / Math.log(0.5);

  // 0–100 → [0,1]^exponent → log interpolation → actual %
  function posToFreq(p) {
    const t = Math.pow(p / 100, exponent);
    return MIN * Math.pow(R, t);
  }

  // invert: given freq, find p so that posToFreq(p)=freq
  function freqToPos(f) {
    const t = Math.log(f / MIN) / Math.log(R);
    return Math.pow(t, 1 / exponent) * 100;
  }

  // load saved percent, convert to pos
  useEffect(() => {
    chrome.storage.local.get(
      { sandwichFrequency: 10 },
      ({ sandwichFrequency }) => {
        // clamp between MIN and MAX
        const pct = Math.min(MAX, Math.max(MIN, sandwichFrequency));
        setPos(freqToPos(pct));
      }
    );
  }, []);

  // when slider moves
  function handleChange(e) {
    const newPos = Number(e.target.value);
    setPos(newPos);
    const freq = posToFreq(newPos);
    chrome.storage.local.set({ sandwichFrequency: freq });
  }

  return (
    <div className="pt-4 pb-2 px-4 w-64">
      <div className="flex justify-center">
        <img src="sandwich.webp" alt="Sandwich" className="w-full" />
      </div>
      <div className="flex items-center space-x-2 mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="freq" className="font-medium">
            Frequency:
          </label>
          <span className="w-12">{posToFreq(pos).toFixed(2)}%</span>
        </div>
        <input
          id="freq"
          type="range"
          min="0"
          max="100"
          step="1"
          value={pos}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      <div className="text-center text-[0.5rem] text-gray-500 mt-2">
        an{" "}
        <a
          className="underline text-blue-300"
          target="_blank"
          href="https://addisongoolsbee.com"
        >
          Addison Goolsbee
        </a>{" "}
        production
      </div>
    </div>
  );
}
