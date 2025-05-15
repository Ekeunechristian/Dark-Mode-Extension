(function(){"use strict";const o=document.createElement("style");o.textContent=`
  html, body {
    background-color: #111 !important;
    color: #eee !important;
  }

  * {
    background-color: transparent !important;
    color: #eee !important;
    border-color: #444 !important;
    box-shadow: none !important;
  }

  a, span, p, div, h1, h2, h3, h4, h5, h6, button {
    color: #eee !important;
  }

  header, nav, footer, section, aside {
    background-color: #111 !important;
  }

  input, textarea, select, option {
    background-color: #222 !important;
    color: #eee !important;
    border: 1px solid #444 !important;
  }

  img, video {
    filter: brightness(0.9) contrast(1.1) !important;
  }

  ::selection {
    background: #555 !important;
    color: #fff !important;
  }

  /* Hide shadows or gradients often used in light themes */
  *:before, *:after {
    background: transparent !important;
    box-shadow: none !important;
  }
`,document.head.appendChild(o),console.log("🌙 DARK MODE EXTENSION: Active")})();
