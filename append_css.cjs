const fs = require('fs');
const css = `
@media (max-width: 900px) {
  .podium-grid {
    grid-template-columns: 1fr !important;
  }
  .lb-podium-card.top1 { order: 1 !important; height: auto !important; padding: 40px 20px !important; }
  .lb-podium-card.top2 { order: 2 !important; height: auto !important; padding: 30px 20px !important; }
  .lb-podium-card.top3 { order: 3 !important; height: auto !important; padding: 30px 20px !important; }
}
`;
fs.appendFileSync('d:\\3. WEB\\WEB\\VITEAWARD\\src\\index.css', css);
