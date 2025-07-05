function maybeSandwich(img) {
  // mark it so we don't re-process the same <img>
  if (img.dataset.sandwichChecked) return;
  img.dataset.sandwichChecked = "true";

  // 50% chance
  if (Math.random() < 0.5) {
    img.src = chrome.runtime.getURL("sandwich.webp");
    // Add CSS to make the image fit within its container
    img.style.objectFit = "contain";
    img.style.maxWidth = "100%";
    img.style.maxHeight = "100%";
  }
}

// Process all <img> currently on the page
document.querySelectorAll("img").forEach(maybeSandwich);

// (Optional) Watch for new images added later
const observer = new MutationObserver(mutations => {
  for (const m of mutations) {
    m.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        // If it's an <img> or contains <img>s
        if (node.tagName === "IMG") maybeSandwich(node);
        node.querySelectorAll?.("img").forEach(maybeSandwich);
      }
    });
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true
});
