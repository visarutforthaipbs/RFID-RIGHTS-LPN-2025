const fs = require("fs");
const path = require("path");

// Create a simple favicon.ico replacement using base64 encoded PNG
const favicon16x16 = `<svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 12C8 7.58172 11.5817 4 16 4H32C36.4183 4 40 7.58172 40 12V28C40 36.8366 32.8366 44 24 44C15.1634 44 8 36.8366 8 28V12Z" 
        fill="#ffc314" stroke="#000000" stroke-width="1.5"/>
  <path d="M12 12H36" stroke="#000000" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M16 24L20 28L32 16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const favicon32x32 = `<svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 12C8 7.58172 11.5817 4 16 4H32C36.4183 4 40 7.58172 40 12V28C40 36.8366 32.8366 44 24 44C15.1634 44 8 36.8366 8 28V12Z" 
        fill="#ffc314" stroke="#000000" stroke-width="2"/>
  <path d="M12 12H36" stroke="#000000" stroke-width="2" stroke-linecap="round"/>
  <path d="M16 24L20 28L32 16" stroke="#000000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M14 14C14 12.8954 14.8954 12 16 12H32C33.1046 12 34 12.8954 34 14V26C34 32.0751 29.0751 37 23 37C16.9249 37 12 32.0751 12 26V16" 
        fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)" stroke-width="1"/>
</svg>`;

// Write the favicon SVG files
fs.writeFileSync(
  path.join(__dirname, "../public/favicon-16x16.svg"),
  favicon16x16
);
fs.writeFileSync(
  path.join(__dirname, "../public/favicon-32x32.svg"),
  favicon32x32
);

console.log("Favicon SVG files created successfully!");
console.log(
  "You can now use these as favicons or convert them to PNG/ICO format."
);
