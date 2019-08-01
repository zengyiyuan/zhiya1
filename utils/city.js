var city_data = {
  "互联网": {
    "互联网金融": ["技术总监"],
    "互联网医疗": [],
    "互联网教育": [],
  },
  "金融": {
    "P2P": [ "金融分析师"],
  }
};


function getCity() {
  return city_data;
}

module.exports = {
  getCity: getCity
}