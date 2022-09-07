import fetch from 'node-fetch';
import fs from 'fs-extra'
const restCountries = await fetch('https://restcountries.com/v3.1/all')



const restCountriesJson = (await restCountries.json()).sort((x, y) => {
    if (x.name.common < y.name.common) return -1;
    if (x.name.common > y.name.common) return 1;
    return 0;
})
const provinces = await fetch('https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/states.json').then(x =>x.json());




const names3 = restCountriesJson.map(x => ({name: x.name.common, cca3: x.cca3, flag: x.flag,}));
const names2 = restCountriesJson.map(x => ({name: x.name.common, cca2: x.cca2, flag: x.flag,}));

const names2To3Map = {};
restCountriesJson.forEach(c => {
    names2To3Map[c.cca2] = c.cca3;
})

const provincesByCountry2 = {};
provinces.forEach(province => {
    if(!provincesByCountry2[province.country_code]) {
        provincesByCountry2[province.country_code] = [];
    }
    provincesByCountry2[province.country_code].push(province.name);
})

const provincesByCountry3 = {};
provinces.forEach(province => {
    const code = names2To3Map[province.country_code];
    if(!code) throw new Error('no country code exists for ' + province.country_code)
    if(!provincesByCountry3[code]) {
        provincesByCountry3[code] = [];
    }
    provincesByCountry3[code].push(province.name);
})
restCountriesJson.forEach(x => {
    x.provinces = provincesByCountry2[x.cca2];
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

for(let key of Object.keys(provincesByCountry3)) {
    await fs.writeJson(`./dist/provinces/${key}.json`, provincesByCountry3[key], {spaces: 4})
}
for(let key of Object.keys(provincesByCountry2)) {
    await fs.writeJson(`./dist/provinces/${key}.json`, provincesByCountry2[key], {spaces: 4})
}

for(const c of restCountriesJson) {
    await fs.writeJson(`./dist/countries/${c.cca2}.json`, c, {spaces: 4})
    await fs.writeJson(`./dist/countries/${c.cca3}.json`, c, {spaces: 4})
}
await fs.writeJson('./dist/all.json', restCountriesJson, {spaces: 4})
await fs.writeJson('./dist/names-alpha-3.json', names3, {spaces: 4})
await fs.writeJson('./dist/names-alpha-2.json', names2, {spaces: 4})
await fs.writeJson('./dist/phone-alpha-3.json', phoneAlpha3, {spaces: 4})
await fs.writeJson('./dist/phone-alpha-2.json', phoneAlpha2, {spaces: 4})
await fs.writeJson('./dist/provinces-alpha-2.json', provincesByCountry2, {spaces: 4})
await fs.writeJson('./dist/provinces-alpha-3.json', provincesByCountry3, {spaces: 4})
