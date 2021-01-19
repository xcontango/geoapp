import React, { useState, useEffect } from 'react';
// import Select from 'react-select';

// TODO: change to await
const getGeocode = (address, callback) => {
  if (address) {
    // TODO: csrf
    fetch(window.API_URL + 'geocode/?address=' + address)
      .then(response => response.json())
      .then(data => {
        callback(data.results || []);
      });
  } else callback([]);
}

const getAddress = (geocode, callback) => {
  if (geocode) {
    // TODO: csrf
    fetch(window.API_URL + 'address/?geocode=' + geocode)
      .then(response => response.json())
      .then(data => {
        callback(data.results || []);
      });
  } else callback([]);
}

export default function LocationForm(props) {
  const [results, setResults] = useState([]);
  const [address, setAddress] = useState('');
  const [geocode, setGeocode] = useState('');
  const [selection, setSelection] = useState(null);

  // TODO: reduce spamming
  useEffect(() => {
    // Was set by clicking into the results of the previous search
    if (selection !== null && results[selection] && results[selection].formatted_address === address) return;
    // Get search results for the new value
    setSelection(null);
    // Clear selection on the parent
    props.selected(null);
    // Do a new search
    getGeocode(address, setResults);
  }, [address]);

  useEffect(() => {
    // Was set by clicking into the results of the previous search
    if (selection !== null && results[selection] && results[selection].geocode === geocode) return;
    // Get search results for the new value
    setSelection(null);
    // Clear selection on the parent
    props.selected(null);
    // Do a new search
    getAddress(geocode, setResults)
  }, [geocode]);

  // Unselect when receiving new search results
  useEffect(() => setSelection(null), [results]);

  // Clicked on a row of selection results
  useEffect(() => {
    if (selection !== null && results[selection]) {
      let row = results[selection]
      setAddress(row.formatted_address);
      setGeocode(row.geocode);
      // Call back to the parent
      props.selected(row);
    }
  }, [selection]);

  // TODO: find a 17-compatible version of react-select
  return (
    <div className='container location-container'>
      <h4>Location {props.idx}:</h4>
      <div className='location-select row'>
        <div className='col-6'>
          <label>Address</label>
          <input type='text' value={address} onChange={event => setAddress(event.target.value)}></input>
        </div>

        <div className='col-6'>
          <label>Lat Lng</label>
          <input type='text' value={geocode} onChange={event => setGeocode(event.target.value)}></input>
        </div>
      </div>

      <h4>Matches:</h4>
      <div className='search-results'>
        {results.map(
          (row, idx) => (
            <div
              key={idx}
              className={'row search-results-row' + (idx === selection ? ' selected' : '')}
              onClick={() => setSelection(idx)}
            >
              <div className='col-6'> {row.formatted_address} </div>
              <div className='col-6'> {row.geocode} </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}