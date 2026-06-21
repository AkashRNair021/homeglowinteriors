const fs = require('fs');
const path = require('path');

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace Filter Buttons
  content = content.replace(
    /<button class="filter-btn" data-filter="living-rooms" id="btn-filter-living">Living Rooms<\/button>\s*<button class="filter-btn" data-filter="bedrooms" id="btn-filter-bedrooms">Bedrooms<\/button>\s*<button class="filter-btn" data-filter="kitchens" id="btn-filter-kitchens">Modular Kitchens<\/button>\s*<button class="filter-btn" data-filter="bathrooms" id="btn-filter-bathrooms">Bathroom(?: Settings)?<\/button>/g,
    '<button class="filter-btn" data-filter="interior" id="btn-filter-interior">Interior</button>\n        <button class="filter-btn" data-filter="kitchens" id="btn-filter-kitchens">Modular Kitchens</button>'
  );

  // Replace Load More Buttons in index.html
  content = content.replace(
    /<a href="projects\.html" class="btn-premium btn-premium-primary load-more-btn d-none"\s*data-load-more="living-rooms" id="btn-loadmore-living">Load More Living Rooms<\/a>\s*<a href="projects\.html" class="btn-premium btn-premium-primary load-more-btn d-none" data-load-more="bedrooms"\s*id="btn-loadmore-bedrooms">Load More Bedrooms<\/a>\s*<a href="projects\.html" class="btn-premium btn-premium-primary load-more-btn d-none" data-load-more="kitchens"\s*id="btn-loadmore-kitchens">Load More Modular Kitchens<\/a>\s*<a href="projects\.html" class="btn-premium btn-premium-primary load-more-btn d-none" data-load-more="bathrooms"\s*id="btn-loadmore-bathrooms">Load More Bathroom(?: Settings)?<\/a>/g,
    '<a href="projects.html" class="btn-premium btn-premium-primary load-more-btn d-none"\n          data-load-more="interior" id="btn-loadmore-interior">Load More Interior</a>\n        <a href="projects.html" class="btn-premium btn-premium-primary load-more-btn d-none" data-load-more="kitchens"\n          id="btn-loadmore-kitchens">Load More Modular Kitchens</a>'
  );

  // Replace Load More Buttons in projects.html
  content = content.replace(
    /<a href="#" class="btn-premium btn-premium-primary load-more-btn d-none" data-load-more="living-rooms" id="btn-loadmore-living">Load More Living Rooms<\/a>\s*<a href="#" class="btn-premium btn-premium-primary load-more-btn d-none" data-load-more="bedrooms" id="btn-loadmore-bedrooms">Load More Bedrooms<\/a>\s*<a href="#" class="btn-premium btn-premium-primary load-more-btn d-none" data-load-more="kitchens" id="btn-loadmore-kitchens">Load More Modular Kitchens<\/a>\s*<a href="#" class="btn-premium btn-premium-primary load-more-btn d-none" data-load-more="bathrooms" id="btn-loadmore-bathrooms">Load More Bathroom(?:s| Settings)?<\/a>/g,
    '<a href="#" class="btn-premium btn-premium-primary load-more-btn d-none" data-load-more="interior" id="btn-loadmore-interior">Load More Interior</a>\n        <a href="#" class="btn-premium btn-premium-primary load-more-btn d-none" data-load-more="kitchens" id="btn-loadmore-kitchens">Load More Modular Kitchens</a>'
  );

  // Replace hardcoded class names
  content = content.replace(/portfolio-item living-rooms/g, 'portfolio-item interior');
  content = content.replace(/portfolio-item bedrooms/g, 'portfolio-item interior');
  content = content.replace(/portfolio-item bathrooms/g, 'portfolio-item interior');

  // Replace hardcoded category labels in the overlay
  content = content.replace(/<span class="project-category">Living Rooms<\/span>/g, '<span class="project-category">Interior</span>');
  content = content.replace(/<span class="project-category">Bedrooms<\/span>/g, '<span class="project-category">Interior</span>');
  content = content.replace(/<span class="project-category">Bathroom Settings<\/span>/g, '<span class="project-category">Interior</span>');
  content = content.replace(/<span class="project-category">Bathrooms<\/span>/g, '<span class="project-category">Interior</span>');

  fs.writeFileSync(filePath, content, 'utf8');
}

updateFile(path.join(__dirname, 'index.html'));
updateFile(path.join(__dirname, 'projects.html'));
console.log('HTML files updated successfully!');
