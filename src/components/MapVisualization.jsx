import React, { useState, useEffect } from "react";
import dummyData from "../utils/dummyData"; // Importing dummy GPS data
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css"; // Import Mapbox CSS

mapboxgl.accessToken = 'pk.eyJ1IjoiYWJoaXNoZWswOTA4IiwiYSI6ImNsd2x3bW5qdzBoNWMyanBnaXZycW1hOGEifQ.xi9mwo5LXiMZLc54e7C9TQ'; // Replace with your Mapbox access token

const MapVisualization = () => {
  const [map, setMap] = useState(null);
  const [threshold, setThreshold] = useState(1); // Default threshold value is 1 minute
  const [stoppageMarkers, setStoppageMarkers] = useState([]);

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12", // Navigation day style for detailed street views
        center: [74.9173533, 12.9294916], // Starting coordinates
        zoom: 10, // Adjusted zoom level for a smaller map
      });

      // Add zoom and rotation controls to the map.
      mapInstance.addControl(new mapboxgl.NavigationControl());

      mapInstance.on("load", () => {
        setMap(mapInstance);
        addGPSDataToMap(mapInstance);
      });
    };

    if (!map) initializeMap();
  }, [map]);

  useEffect(() => {
    updateStoppageMarkers();
  }, [threshold]);

  const addGPSDataToMap = (mapInstance) => {
    // Create an array to store coordinates for drawing the path
    const pathCoordinates = [];
    const newStoppageMarkers = []; // New array to store markers

    for (let i = 1; i < dummyData.length; i++) {
      const dataPoint = dummyData[i];
      // Add each data point's coordinates to the pathCoordinates array
      pathCoordinates.push([dataPoint.longitude, dataPoint.latitude]);

      if (dataPoint.speed === 0) {
        const duration = calculateDuration(dummyData[i-1].eventGeneratedTime, dataPoint.eventGeneratedTime);

        const stoppageMarker = new mapboxgl.Marker({ color: "#007cbf", size: 0.5 }) // Blue marker with size 0.5 (default size is 1)
          .setLngLat([dataPoint.longitude, dataPoint.latitude])
          .setPopup(new mapboxgl.Popup().setHTML(
            `<h3>Stoppage Information</h3>
            <p>Reach Time: ${new Date(dummyData[i-1].eventGeneratedTime).toLocaleString()}</p>
            <p>End Time: ${new Date(dataPoint.eventGeneratedTime).toLocaleString()}</p>
            <p>Duration: ${duration} minutes</p>`
          ))
          .addTo(mapInstance);

        // Add the necessary properties to the marker
        stoppageMarker.properties = {
          eventDate: dataPoint.eventDate,
          eventGeneratedTime: dataPoint.eventGeneratedTime,
          duration: duration, // Add duration property
        };

        newStoppageMarkers.push(stoppageMarker); // Add marker to the new array
      }
    }

    setStoppageMarkers(newStoppageMarkers); // Update stoppageMarkers state with new array

    // Draw the path on the map using the pathCoordinates array
    mapInstance.addLayer({
      id: "path",
      type: "line",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: pathCoordinates,
          },
        },
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#007cbf", // Blue color for the path
        "line-width": 2,
      },
    });

    // Fit the map view to the path's bounding box
    const bounds = pathCoordinates.reduce((bounds, coord) => {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(pathCoordinates[0], pathCoordinates[0]));

    mapInstance.fitBounds(bounds, {
      padding: 20
    });

    // Call updateStoppageMarkers to apply the initial threshold
    updateStoppageMarkers(newStoppageMarkers);
  };

  const updateStoppageMarkers = (markers = stoppageMarkers) => {
    for (let i = 0; i < markers.length; i++) {
      const marker = markers[i];
      if (marker.properties.duration > threshold) {
        marker.getElement().style.display = "block"; // Show the marker if duration is above threshold
      } else {
        marker.getElement().style.display = "none"; // Hide the marker if duration is below threshold
      }
    }
  };

  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (Math.abs(end - start) / (1000 * 60)); // Convert milliseconds to minutes
    return parseFloat(duration.toFixed(2)); // Return duration rounded to 2 decimal places
  };

  const handleThresholdChange = (e) => {
    const value = parseFloat(e.target.value);
    setThreshold(value);
  };

  return (
    <div className="map-container">
      <header className="map-header">
      </header>
      <div id="map" className="map"></div>
      <div className="threshold-control mt-10">
        <label htmlFor="threshold" className="block font-bold text-lg mb-2">Stoppage Threshold (minutes):</label>
        <input
          type="number"
          id="threshold"
          name="threshold"
          min="0.01"
          step="0.01"
          value={threshold}
          onChange={handleThresholdChange}
          className="border border-gray-300 rounded px-3 py-2 mt-1"
        />
      </div>
    </div>
  );
};

export default MapVisualization;
