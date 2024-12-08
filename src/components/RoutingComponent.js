import { useEffect } from "react";
import L from "leaflet";
import markerImage from "../assets/marker.webp";
import carImage from "../assets/carImage.png";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const customMarkerIcon = new L.Icon({
  iconUrl: markerImage,
  iconSize: [45, 45],
  popupAnchor: [0, -20],
});

const customCarImage = new L.Icon({
  iconUrl: carImage,
  iconSize: [45, 45],
  popupAnchor: [0, -20],
});

const RoutingComponent = ({ map, start, end }) => {
  useEffect(() => {
    if (!map || !start.length || !end.length) return;

    // Add car marker
    const marker = L.marker([start[0], start[1]], {
      icon: customCarImage,
    }).addTo(map);

    // Add routing control
    const routingControl = L.Routing.control({
      waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
      routeWhileDragging: true,
      createMarker: function (i, waypoint, n) {
        return L.marker(waypoint.latLng, {
          icon: customMarkerIcon,
        });
      },
    })
      .on("routesfound", function (e) {
        console.log(e);
        e.routes[0].coordinates.forEach((coord, index) => {
          setTimeout(() => {
            marker.setLatLng([coord.lat, coord.lng]);
          }, 200 * index);
        });
      })
      .addTo(map);

    // Cleanup on unmount or dependency change
    return () => {
      console.log("Map instance:", map);
      console.log("Layer to remove:", marker);

      // Safely remove the marker
      if (map && marker) {
        try {
          map.removeLayer(marker);
        } catch (error) {
          console.error("Error removing marker:", error);
        }
      }

      // Safely remove the routing control
      if (map && routingControl) {
        try {
          routingControl.getPlan().setWaypoints([]); // Clear waypoints
          map.removeControl(routingControl);
        } catch (error) {
          console.error("Error removing routing control:", error);
        }
      }
    };
  }, [map, start, end]);

  return null;
};

export default RoutingComponent;
