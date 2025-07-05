let freq = 50; // default 50%

// load initial value
chrome.storage.local.get({ sandwichFrequency: 50 }, ({ sandwichFrequency }) => {
  freq = sandwichFrequency;
});

function maybeSandwich(img) {
  // Mark to prevent re-processing
  if (img.dataset.sandwichProcessed) return;
  img.dataset.sandwichProcessed = "true";
  
  if (Math.random() < Math.min(freq / 100, 0.95)) {
    // Create a wrapper div for the crossfade effect
    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    wrapper.style.width = img.offsetWidth + 'px';
    wrapper.style.height = img.offsetHeight + 'px';
    
    // Clone the original image
    const originalImg = img.cloneNode(true);
    originalImg.style.position = 'absolute';
    originalImg.style.top = '0';
    originalImg.style.left = '0';
    originalImg.style.transition = 'opacity 0.4s ease-in-out';
    
    // Create the sandwich image
    const sandwichImg = document.createElement('img');
    sandwichImg.src = chrome.runtime.getURL("sandwich.webp");
    sandwichImg.style.position = 'absolute';
    sandwichImg.style.top = '0';
    sandwichImg.style.left = '0';
    sandwichImg.style.opacity = '0';
    sandwichImg.style.transition = 'opacity 0.4s ease-in-out';
    sandwichImg.style.objectFit = 'cover';
    sandwichImg.style.width = '100%';
    sandwichImg.style.height = '100%';
    
    // Insert the wrapper before the original image
    img.parentNode.insertBefore(wrapper, img);
    
    // Add both images to the wrapper
    wrapper.appendChild(originalImg);
    wrapper.appendChild(sandwichImg);
    
    // Start the crossfade
    setTimeout(() => {
      originalImg.style.opacity = '0';
      sandwichImg.style.opacity = '1';
    }, 50);
    
    // Remove the original image
    img.remove();
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