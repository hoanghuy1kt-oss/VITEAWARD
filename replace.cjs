const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach((file) => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
            walk(file, (err, res) => {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            if (!--pending) done(null, results);
          }
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('d:\\3. WEB\\WEB\\VITEAWARD', (err, results) => {
  if (err) throw err;
  
  const targetExts = ['.jsx', '.js', '.json', '.html'];
  
  results.forEach(file => {
    const ext = path.extname(file);
    if (!targetExts.includes(ext)) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    // Explicit 2026->2025 replacements
    const replacements = [
      ['VITA Award 2026', 'VITA Award 2025'],
      ['Mùa giải 2026', 'Mùa giải 2025'],
      ['Season 2026', 'Season 2025'],
      ['Giải thưởng Du lịch Việt Nam 2026', 'Giải thưởng Du lịch Việt Nam 2025'],
      ['Vietnam Tourism Awards 2026', 'Vietnam Tourism Awards 2025'],
      ['© 2026 VITA Award', '© 2025 VITA Award'],
      ['năm 2026', 'năm 2025'],
      ['for 2026', 'for 2025'],
      ['<span className="apg-hero-year-block">2026</span>', '<span className="apg-hero-year-block">2025</span>'],
      ['<title>VITA Award 2026</title>', '<title>VITA Award 2025</title>']
    ];

    replacements.forEach(([search, replace]) => {
      content = content.split(search).join(replace);
    });
    
    // Custom replacements for vi.json
    if (file.endsWith('vi.json')) {
      content = content.replace('Đơn vị tổ chức: Hiệp hội Du lịch Việt Nam', 'Đơn vị tổ chức: Tạp chí Vietnam Travel');
      content = content.replace('do Hiệp hội Du lịch Việt Nam chủ trì tổ chức, phối hợp cùng Tạp chí Vietnam Travel', 'do Tạp chí Vietnam Travel chủ trì tổ chức, phối hợp cùng các cơ quan');
      content = content.replace('15.12.2026', '09.07.2026');
      content = content.replace('"year": "2026"', '"year": "2025"');
    }
    
    // Custom replacements for en.json
    if (file.endsWith('en.json')) {
      content = content.replace('Organizer: Vietnam Tourism Association', 'Organizer: Vietnam Travel Magazine');
      content = content.replace('hosted by the Vietnam Tourism Association, in coordination with Vietnam Travel Magazine', 'hosted by Vietnam Travel Magazine, in coordination with agencies');
      content = content.replace('Dec 15, 2026', 'Jul 09, 2026');
      content = content.replace('"year": "2026"', '"year": "2025"');
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated', file);
    }
  });
});
