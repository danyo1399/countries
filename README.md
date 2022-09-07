# countries
Country information split out in different ways useful for binding
to ui controls. The files are hosted in cloudflare with cors headers set so they can 
be consumed via API


- https://countries-api.pages.dev/all.json
- https://countries-api.pages.dev/names-alpha-2.json
- https://countries-api.pages.dev/names-alpha-3.json
- https://countries-api.pages.dev/phone-alpha-2.json
- https://countries-api.pages.dev/phone-alpha-3.json
- https://countries-api.pages.dev/provinces-alpha-2.json
- https://countries-api.pages.dev/provinces-alpha-3.json

Or to get regions for specific country. eg
- https://countries-api.pages.dev/provinces/NZ.json
- https://countries-api.pages.dev/provinces/AUS.json

If you want the data refreshed, raise a PR bumping the package version.
Triggering a build will refresh the data

Special thx to the follow resources
- https://restcountries.com
- https://github.com/dr5hn/countries-states-cities-database
- cloudflare for hosting