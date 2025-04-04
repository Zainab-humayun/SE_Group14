import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: L.LatLngExpression;

}

const Map = ({ 
  center = [0, 0], 

}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapContainerRef.current.style.overflow = 'hidden';
      
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        preferCanvas: true,
      }).setView(center);

      L.control.zoom({ position: 'topright' }).addTo(mapRef.current);

      tileLayerRef.current = L.tileLayer(
       
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          noWrap: true
        }
      ).addTo(mapRef.current);

      updateMarker();

      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 0);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  const updateMarker = () => {
    if (mapRef.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng(center);
      } else {
        markerRef.current = L.marker(center)
          .addTo(mapRef.current)
          .bindPopup('Selected Location')
          .openPopup();
      }
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center);
      updateMarker();
      mapRef.current.invalidateSize(); 
    }
  }, [center]);

  useEffect(() => {
    if (mapRef.current && tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
      
      tileLayerRef.current = L.tileLayer(
       
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          noWrap: true
        }
      ).addTo(mapRef.current);
      
      mapRef.current.invalidateSize(); 
    }
  }, []);

  return (
    <div 
      ref={mapContainerRef}
      className={`h-full w-full  `}
      style={{ position: 'sticky' }}
    />
  );
};

export default Map;



// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// import L, { LatLngExpression } from "leaflet";

// import "leaflet/dist/leaflet.css";

// // Fix missing marker icons in Leaflet
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// const customIcon = new L.Icon({
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const LocationMap: React.FC = () => {
//   const [location, setLocation] = useState<LatLngExpression | null>(null);

//   useEffect(() => {
//     if (!navigator.geolocation) {
//       console.error("Geolocation is not supported by your browser.");
//       return;
//     }

//     const watchId = navigator.geolocation.watchPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         console.log("Latitude: ", latitude);
//         console.log("Longtude: ", longitude);
//         setLocation([latitude, longitude]);
//       },
//       (error) => {
//         console.error("Error getting location:", error);
//       },
//       { enableHighAccuracy: true, maximumAge: 0, timeout: 9000 } // Improved accuracy settings
//     );

//     return () => navigator.geolocation.clearWatch(watchId); // Cleanup on unmount
//   }, []);

//   if (!location) return <div>Loading location...</div>;

//   return (
//     // <MapContainer center={location} zoom={16} style={{ height: "100vh", width: "100%" }}>
//     <MapContainer center={location} zoom={16} style={{ height: "500px", width: "100%" }}>

//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <Marker position={location} icon={customIcon}>
//         <Popup>Your current location</Popup>
//       </Marker>
//       <RecenterMap location={location} />
//     </MapContainer>
//   );
// };

// // 🔄 Auto-center map when location changes
// const RecenterMap: React.FC<{ location: LatLngExpression }> = ({ location }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(location, map.getZoom(), { animate: true });
//   }, [location, map]);
//   return null;
// };

// export default LocationMap;
