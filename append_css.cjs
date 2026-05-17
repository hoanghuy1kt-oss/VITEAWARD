const fs = require('fs');
const css = `
@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 200%; }
}
`;
fs.appendFileSync('d:\\3. WEB\\WEB\\VITEAWARD\\src\\index.css', css);
