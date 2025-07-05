// One-shot swap with a 50% chance
function maybeSandwich(img) {
  if (Math.random() < 0.5) {
    img.src = chrome.runtime.getURL("sandwich.webp");
    img.style.objectFit = "cover";

  }
}

// 1) Watch for new <img> elements
const observer = new MutationObserver(mutations => {
  for (const m of mutations) {
    if (m.type === "childList") {
      m.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.tagName === "IMG") maybeSandwich(node);
          node.querySelectorAll?.("img").forEach(maybeSandwich);
        }
      });
    }
    // 2) Watch for any <img src=...> changes
    else if (
      m.type === "attributes" &&
      m.target.tagName === "IMG" &&
      m.attributeName === "src"
    ) {
      maybeSandwich(m.target);
    }
  }
});

// Start observing before anything else happens
observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["src"],
});

// 3) For any <img> already in the HTML (very early), swap once
document.querySelectorAll("img").forEach(maybeSandwich);