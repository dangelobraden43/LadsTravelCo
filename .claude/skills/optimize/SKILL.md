---
name: optimize
description: Optimize HTML files for performance. Use when Brady says "optimize", "compress", "speed up", "file size", or "PageSpeed".
---

# Optimization Workflow

## Image Optimization
1. Find all base64-embedded images in the specified HTML file
2. Report each image's approximate size in KB
3. For images over 150KB, suggest compression
4. If Brady approves, use Python/Pillow to re-encode at lower quality:
   ```python
   from PIL import Image
   import base64, io
   img = Image.open(io.BytesIO(base64.b64decode(data)))
   img = img.convert("RGB")
   buf = io.BytesIO()
   img.save(buf, format="JPEG", quality=72, optimize=True)
   new_b64 = base64.b64encode(buf.getvalue()).decode()
   ```

## Meta Tags Check
Verify every HTML file has:
- `<meta charset="UTF-8">`
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `<meta name="description" content="...">`
- `<meta property="og:title" content="...">`
- `<meta property="og:description" content="...">`
- `<meta property="og:type" content="website">`
- `<title>` tag with destination name + "The Lads Travel Co."

## Performance Checklist
- [ ] Total HTML file size reported
- [ ] Largest embedded image identified
- [ ] Google Fonts loaded with preconnect
- [ ] No render-blocking scripts
- [ ] CSS minified where possible
- [ ] All links valid (no broken hrefs)

## Output
Report findings as a summary table, then ask Brady which fixes to apply.
