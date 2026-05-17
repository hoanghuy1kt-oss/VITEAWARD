const sharp = require('sharp');
const fs = require('fs');

async function extractSprites(imagePath, outDir) {
  console.log('Loading image:', imagePath);
  const { data, info } = await sharp(imagePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  console.log(`Image size: ${width}x${height}, channels: ${channels}`);
  
  // Create a 2D boolean array of transparency
  const visited = new Uint8Array(width * height);
  const isOpaque = new Uint8Array(width * height);
  
  for (let i = 0; i < width * height; i++) {
    // If it's pure white background, we might need to treat white as transparent.
    // Let's check both alpha and white.
    const r = data[i * channels];
    const g = data[i * channels + 1];
    const b = data[i * channels + 2];
    const alpha = data[i * channels + 3];
    
    // Treat as transparent if alpha is low OR if it's very close to pure white
    if (alpha < 10 || (r > 250 && g > 250 && b > 250)) {
        isOpaque[i] = 0;
    } else {
        isOpaque[i] = 1;
    }
  }

  const components = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (isOpaque[idx] && !visited[idx]) {
        // BFS to find connected component
        const q = [[x, y]];
        visited[idx] = 1;
        let minX = x, maxX = x, minY = y, maxY = y;
        
        let qIdx = 0;
        while (qIdx < q.length) {
          const [cx, cy] = q[qIdx++];
          
          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;
          
          const neighbors = [
            [cx-1, cy], [cx+1, cy], [cx, cy-1], [cx, cy+1],
            [cx-1, cy-1], [cx+1, cy+1], [cx-1, cy+1], [cx+1, cy-1]
          ];
          
          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nIdx = ny * width + nx;
              if (isOpaque[nIdx] && !visited[nIdx]) {
                visited[nIdx] = 1;
                q.push([nx, ny]);
              }
            }
          }
        }
        
        const compW = maxX - minX + 1;
        const compH = maxY - minY + 1;
        if (compW > 15 && compH > 15) { // filter out noise
          components.push({ minX, minY, width: compW, height: compH });
        }
      }
    }
  }

  console.log(`Found ${components.length} components`);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  
  // Sort components by y, then x
  components.sort((a, b) => {
    if (Math.abs(a.minY - b.minY) < 50) return a.minX - b.minX;
    return a.minY - b.minY;
  });

  for (let i = 0; i < components.length; i++) {
    const box = components[i];
    // Add a tiny padding if possible
    const pad = 2;
    const l = Math.max(0, box.minX - pad);
    const t = Math.max(0, box.minY - pad);
    const w = Math.min(width - l, box.width + pad * 2);
    const h = Math.min(height - t, box.height + pad * 2);

    await sharp(imagePath)
      .extract({ left: l, top: t, width: w, height: h })
      .toFile(`${outDir}/sprite_${i}.png`);
    console.log(`Saved sprite_${i}.png: W:${w} H:${h}`);
  }
}

extractSprites('../public/assets_sprite.png', './extracted').catch(console.error);
