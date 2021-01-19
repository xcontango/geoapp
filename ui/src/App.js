import React, { useState } from 'react';
import './App.css';
import LocationForm from './components/location';

// TODO: add saving to and loading from local storage

const calcDistance = (location1, location2) => {
  try {
    const { lat: lat1, lng: lng1 } = location1;
    const { lat: lat2, lng: lng2 } = location2;
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c; // in metres
    return isNaN(d) ? null : Math.round(d) / 1000;
  } catch {
    return null;
  }
}

function App() {
  const [data, setData] = useState({});

  const changeCoordinates = idx => location => {
    let d = { ...data };
    if (location === null) delete d[idx];
    else d[idx] = location;
    setData(d);
  }

  const displayDistance = () => {
    // TODO: check for blow-up scenarios
    let distance = calcDistance(data[1].location, data[2].location);
    if (distance === null) return <div></div>;
    return (
      <div>
        <h4>The distance between these points is {distance} kilometres</h4>
      </div>
    )
  }

  return (
    <div className='App container'>
      <h4>Calculate a straight line difference between two locations</h4>
      <div className='main'>
        <LocationForm idx={1} selected={changeCoordinates(1)} />
        <LocationForm idx={2} selected={changeCoordinates(2)} />

        <div className='output'>
          {Object.keys(data).length === 2 && displayDistance()}
        </div>
      </div>
    </div>
  );
}

export default App;
