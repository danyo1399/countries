import fetch from "node-fetch";
import fs from "fs-extra";

const countryCodeOverrides = {
  US: "+1",
  DO: "+1",
  KZ: "+7",
  PR: "+1",
  RU: "+7",
  SH: "+290",
  VA: "+379",
  EH: "+212",
};

const restCountries = await fetch("https://restcountries.com/v3.1/all");

const restCountriesJson = (await restCountries.json()).sort((x, y) => {
  if (x.name.common < y.name.common) return -1;
  if (x.name.common > y.name.common) return 1;
  return 0;
});
const states = await fetch(
  "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/states.json"
).then((x) => x.json());

const names3 = restCountriesJson.map((x) => ({
  name: x.name.common,
  cca3: x.cca3,
  flag: x.flag,
}));
const names2 = restCountriesJson.map((x) => ({
  name: x.name.common,
  cca2: x.cca2,
  flag: x.flag,
}));

const names = restCountriesJson.map((x) => ({
  name: x.name.common,
  cca2: x.cca2,
  cca3: x.cca3,
  flag: x.flag,
}));

const names2To3Map = {};
restCountriesJson.forEach((c) => {
  names2To3Map[c.cca2] = c.cca3;
});

const statesByCountry2 = {};
states.forEach((state) => {
  if (!statesByCountry2[state.country_code]) {
    statesByCountry2[state.country_code] = [];
  }
  statesByCountry2[state.country_code].push({
    name: state.name,
    type: state.type,
    latitude: state.latitude,
    longitude: state.longitude,
    code: state.state_code,
  });
});

function getCountryCode(country) {
  let prefix = null;
  if (country.idd?.suffixes?.length === 1) {
    prefix = `${country.idd?.root}${country.idd?.suffixes[0]}`;
  } else if (country.idd?.suffixes?.length > 1) {
    const countryCodeOverride = countryCodeOverrides[country.cca2];
    if (!countryCodeOverride) {
      throw new Error(
        `Country ${country.cca2} has multiple suffixes an no overrides`
      );
    }
    prefix = `${countryCodeOverride}`;
  }
  return prefix;
}
const statesByCountry3 = {};
states.forEach((province) => {
  const code = names2To3Map[province.country_code];
  if (!code)
    throw new Error("no country code exists for " + province.country_code);
  if (!statesByCountry3[code]) {
    statesByCountry3[code] = [];
  }
  statesByCountry3[code].push({
    name: province.name,
    type: province.type,
    latitude: province.latitude,
    longitude: province.longitude,
    code: province.state_code,
  });
});
restCountriesJson.forEach((x) => {
  x.states = statesByCountry2[x.cca2];
});

const phoneAlpha3 = [];
const phoneAlpha2 = [];
restCountriesJson.forEach((country) => {
  const prefix = getCountryCode(country);
  if (prefix) {
    phoneAlpha3.push({
      name: country.name.common,
      cca3: country.cca3,
      prefix,
      flag: country.flag,
    });
    phoneAlpha2.push({
      name: country.name.common,
      cca2: country.cca2,
      prefix,
      flag: country.flag,
    });
  }
});

for (let key of Object.keys(statesByCountry3)) {
  await fs.writeJson(`./dist/states/${key}.json`, statesByCountry3[key], {
    spaces: 4,
  });
}
for (let key of Object.keys(statesByCountry2)) {
  await fs.writeJson(`./dist/states/${key}.json`, statesByCountry2[key], {
    spaces: 4,
  });
}

for (const c of restCountriesJson) {
  await fs.writeJson(`./dist/countries/${c.cca2}.json`, c, { spaces: 4 });
  await fs.writeJson(`./dist/countries/${c.cca3}.json`, c, { spaces: 4 });
}
await fs.writeJson("./dist/all.json", restCountriesJson, { spaces: 4 });
await fs.writeJson("./dist/names.json", names, { spaces: 4 });
await fs.writeJson("./dist/names-alpha-3.json", names3, { spaces: 4 });
await fs.writeJson("./dist/names-alpha-2.json", names2, { spaces: 4 });
await fs.writeJson("./dist/phone-alpha-3.json", phoneAlpha3, { spaces: 4 });
await fs.writeJson("./dist/phone-alpha-2.json", phoneAlpha2, { spaces: 4 });
await fs.writeJson("./dist/states-alpha-2.json", statesByCountry2, {
  spaces: 4,
});
await fs.writeJson("./dist/states-alpha-3.json", statesByCountry3, {
  spaces: 4,
});
