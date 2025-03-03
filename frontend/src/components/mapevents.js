import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Map = ({ location }) => {
  const mapContainerStyle = {
    height: "400px",
    width: "100%",
  };

  const center = {
    lat: location.lat,
    lng: location.lng,
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyDZZVXfgnLuVR2GCeNvyzgx0I6cL47422c">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={15}>
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
