const fs = require('fs');
const path = require('path');
const dir = process.cwd();
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('rel="icon"')) {
    content = content.replace('</head>', '  <link rel="icon" type="image/png" href="images/favicon.png">\n</head>');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + file);
  }
});
