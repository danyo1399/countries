import fetch from 'node-fetch';

const x = await fetch('https://restcountries.com/v3.1/all')
import fs from 'fs-extra'

const json = (await x.json()).sort((x, y) => {
    if (x.name.common < y.name.common) return -1;
    if (x.name.common > y.name.common) return 1;
    return 0;
})
await fs.writeJson('./dist/all.json', json, {spaces: 4})
const names3 = json.map(x => ({name: x.name.common, cca3: x.cca3, flag: x.flag,}));
const names2 = json.map(x => ({name: x.name.common, cca2: x.cca2, flag: x.flag,}));

const phoneAlpha3 = [];
json.forEach(country => {
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
json.forEach(country => {
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
