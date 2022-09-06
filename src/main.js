import fetch from 'node-fetch';
import fs from 'fs-extra'
const restCountries = await fetch('https://restcountries.com/v3.1/all')



const restCountriesJson = (await restCountries.json()).sort((x, y) => {
    if (x.name.common < y.name.common) return -1;
    if (x.name.common > y.name.common) return 1;
    return 0;
})
const regions = await fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/states.json').then(x =>x.json());



await fs.writeJson('./dist/all.json', restCountriesJson, {spaces: 4})
const names3 = restCountriesJson.map(x => ({name: x.name.common, cca3: x.cca3, flag: x.flag,}));
const names2 = restCountriesJson.map(x => ({name: x.name.common, cca2: x.cca2, flag: x.flag,}));

const names2To3Map = {};
restCountriesJson.forEach(c => {
    names2To3Map[c.cca2] = c.cca3;
})

const regionsByCountry2 = {};
regions.forEach(region => {
    if(!regionsByCountry2[region.country_code]) {
        regionsByCountry2[region.country_code] = [];
    }
    regionsByCountry2[region.country_code].push(region.name);
})

const regionsByCountry3 = {};
regions.forEach(region => {
    const code = names2To3Map[region.country_code];
    if(!code) throw new Error('no country code exists for ' + region.country_code)
    if(!regionsByCountry3[code]) {
        regionsByCountry3[code] = [];
    }
    regionsByCountry3[code].push(region.name);
})

const phoneAlpha3 = [];
restCountriesJson.forEach(country => {
    (country.idd?.suffixes || []).forEach(prefix => {
        phoneAlpha3.push({
            name: country.name.common,
            cca3: country.cca3,
            prefix: `${country.idd?.root}${prefix}`,
            flag: country.flag
        })
    })
});

const phoneAlpha2 = [];
restCountriesJson.forEach(country => {
    (country.idd?.suffixes || []).forEach(prefix => {
        phoneAlpha2.push({
            name: country.name.common,
            cca2: country.cca2,
            prefix: `${country.idd?.root}${prefix}`,
            flag: country.flag
        })
    })
});

await fs.writeJson('./dist/names-alpha-3.json', names3, {spaces: 4})
await fs.writeJson('./dist/names-alpha-2.json', names2, {spaces: 4})
await fs.writeJson('./dist/phone-alpha-3.json', phoneAlpha3, {spaces: 4})
await fs.writeJson('./dist/phone-alpha-2.json', phoneAlpha2, {spaces: 4})
await fs.writeJson('./dist/regions-alpha-2.json', regionsByCountry2, {spaces: 4})
await fs.writeJson('./dist/regions-alpha-3.json', regionsByCountry3, {spaces: 4})
