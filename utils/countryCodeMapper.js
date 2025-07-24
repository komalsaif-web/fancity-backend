// You can expand this list
const countryMap = {
  "Brazil": "br",
  "Spain": "es",
  "England": "gb-eng",
  "France": "fr",
  "Germany": "de",
  "Italy": "it",
  "Portugal": "pt",
  "Argentina": "ar",
  "Netherlands": "nl",
  "Belgium": "be",
  "Mexico": "mx",
  "USA": "us",
  "Uruguay": "uy",
  // Add more if needed
};

module.exports = function getCode(countryName) {
  return countryMap[countryName] || "unknown";
};
