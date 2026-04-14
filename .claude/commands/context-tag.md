Read the destination name Brady provides.
Open src/data/[destination].js
For every spot that has an empty or missing contexts array:
- Read the spot's category, vibeTags, city, and description
- Assign appropriate contexts from this list:
  city-framework:[destination] (always include)
  adventure:rung-1 (if it involves hiking, outdoors, physical activity)
  sacred-sites (if it's a UNESCO site, historic monument, religious site, or "stops you")
  calendar:[month] (best months based on bestTime field or category)
  charity:npca (if it's a national park or nature site)
  featured (if it's a top-tier spot, landmark, or has a strong ladsTake)
Update the file. Report how many spots were tagged and a summary of context distribution.
