# VANTA Works website

The customer-facing website for VANTA Works, managed property services in Zimbabwe.
*Essential services. Exceptionally managed.*

It's a static site: plain HTML, CSS and JavaScript, with no build step and no dependencies.

```
index.html              The full one-page site
404.html                Not-found page
assets/css/styles.css   Brand tokens and all styles
assets/js/main.js       Contact settings, WhatsApp links, mobile menu, enquiry form
assets/img/             Keystone V mark, favicon, social share image
robots.txt
```

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Before going live

These are placeholders taken from the brand pack. Replace them once they're confirmed.

1. **WhatsApp number.** In `assets/js/main.js`, set `CONFIG.whatsapp` to the business number in international format with digits only (for example `263771234567`). Every "Message us on WhatsApp" button, the enquiry form and the phone button pick it up. While it's empty, WhatsApp opens its own contact picker with the message already filled in.
2. **Phone, email and areas.** Set `CONFIG.phoneDisplay`, `CONFIG.email`, `CONFIG.areas` and `CONFIG.areasShort` in the same file. Also update the matching fallback text in `index.html` (search for `+263 7X XXX XXXX` and `hello@vantaworks.co.zw`), which is what search engines and visitors without JavaScript see. Update the `email` and `areaServed` fields in the JSON-LD block in the `<head>` too.
3. **Photography.** The hero has a striped placeholder labelled *Photo · client office, daylight*. Replace it with a real job photo, used with the client's permission, as the brand guide asks:
   ```html
   <figure class="photo photo-hero">
     <img src="assets/img/hero.jpg" alt="Cleaned office reception in daylight">
   </figure>
   ```
4. **Business name and domain.** VANTA Works is a working name. Confirm business-name, trademark and `.co.zw` domain availability before launch, as the brand strategy notes.
5. **Example content.** The job record (VW-0142), the WhatsApp conversation, the visit record and the Care Plan scope are labelled as examples. Swap in real records, with permission, once pilot jobs are done.

## How the enquiry form works

There's no server. When a visitor submits, the form writes a tidy message (name, business, phone, city, property type, services, notes) and opens WhatsApp with it filled in, or their email app if they choose email. The message also appears on the page with a copy button in case neither app opens.

To collect submissions in an inbox or a spreadsheet instead, point the form at a form service such as Netlify Forms, Formspree or Google Apps Script. The `compose()` function in `main.js` already builds the message text.

## Deploying

Any static host works. Upload the folder as it is.

- **Netlify or Cloudflare Pages:** connect this repository. Leave the build command empty and set the publish directory to `/`.
- **GitHub Pages:** Settings → Pages → deploy from the `main` branch, root folder.
- **cPanel or other shared hosting** (common with `.co.zw` registrars): upload everything into `public_html`.

## Brand system in use

| Token | Value | Use |
| --- | --- | --- |
| Warm Ivory | `#F4F1E9` | Page ground (about 60%) |
| Graphite | `#202522` | Text, assessment offer, CTA band, footer (about 25%) |
| Sage | `#728574` / deep `#4A5B4D` | Status, verification, hover (about 10%) |
| Stone | `#B8A98C` / deep `#6E6046` | Eyebrows, photo ground (about 5%) |

Type: **Archivo** (wide) for display, **IBM Plex Sans** for text, **IBM Plex Mono** for references, times and data. All three load from Google Fonts.

The service divisions (Facilities, Energy, Maintenance, Supply) appear as sections under the one master brand, with their real status shown: *Available now*, *Coming*, *Through vetted specialists* or *Later*. When a division launches, change its chip in the Services section of `index.html`.
