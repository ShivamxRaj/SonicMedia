import fs from 'fs';
import path from 'path';
import * as lucide from 'lucide-react';

function check(d) {
  fs.readdirSync(d).forEach(f => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      check(p);
    } else if (f.endsWith('.jsx')) {
      const c = fs.readFileSync(p, 'utf8');
      const matches = [...c.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g)];
      matches.forEach(m => {
        const imports = m[1].split(',').map(s => s.trim()).filter(Boolean);
        imports.forEach(imp => {
          if (!lucide[imp]) {
            console.log('❌ INVALID ICON:', imp, 'in', p);
          } else {
            console.log('✅ Valid Icon:', imp);
          }
        });
      });
    }
  });
}

check('src');
console.log('--- AUDIT COMPLETE ---');
