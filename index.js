const express = require('express');
const fetch = require('node-fetch');

const bikeShareURL = 'https://feeds.bikesharetoronto.com/stations/stations.json';

let app = express();
let fullData = {};
let simpleData = {};
let stations = {};

//Filter out bare minimum props we need for assignment
const filterSimpleData = data => {
  return data.stationBeanList.map( bean => {
    const {
      stAddress1,
      latitude,
      longitude,
      status,
      availableBikes,
      testStation,
      is_renting,
    } = bean;

    return {
      stAddress1,
      latitude,
      longitude,
      status,
      availableBikes,
      testStation,
      is_renting,
    };
  });
};

const stationsFilter = data => {
  return data.stationBeanList.map( bean => {
    const {
      stAddress1,
      status,
      is_renting,
    } = bean;

    return {
      stAddress1,
      status,
      is_renting,
    };
  });
};

const updateData = () => {
  fetch(bikeShareURL)
    .then( response => response.json())
    .then(data => {
    fullData = data;
    simpleData = filterSimpleData(data);
    stations = stationsFilter(data);
    }).catch( err => fs.appendFile('log.txt', err))
  };

updateData();

app.get('/full', function(req, res) {
	res.json(fullData);
});

app.get('/simple', function(req, res) {
	res.json(simpleData);
});

app.get('/status', function(req, res) {
	res.json(stations);
});

app.listen(3000);
console.log('running');
