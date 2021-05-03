window.onload = onAllAssetsLoaded
document.write("<div id='loadingMessage'>Loading...</div>")
function onAllAssetsLoaded()
{
      // hide the webpage loading message
      document.getElementById('loadingMessage').style.visibility = "hidden"

      let locations;

      fetch("js/airports.json")
            .then(response => response.json())
            .then(data => obj = data)
            .then(() => displayMap(obj))
}

var radioValue = "cafe";
let labelIndex = 0;
const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const iconBase =
      "https://developers.google.com/maps/documentation/javascript/examples/full/images/";

const icons = {
      parking: {
            icon: iconBase + "parking_lot_maps.png",
      },
      library: {
            icon: iconBase + "library_maps.png",
      },
      info: {
            icon: iconBase + "info-i_maps.png",
      },
};

function createMarkerContent(place)
{

      var address = place.address.split(", ");
      let addressContent = "";
      address.map((line) =>
      {
            addressContent += line + "<br/>";
      })

      return "<div id='infoWindow'> <h3>" + place.name + "</h3><br/><img class='places_image' src='" + place.img + "'><p class='address'>" + addressContent + "</p></div>";
}

function checkRadio(type = "cafe")
{
      document.getElementById(type).checked = true;
      radioValue = type;
      onAllAssetsLoaded();
}

// function getRadioValue()
// {
//       let value = document.getElementById('restaurantRadio').checked;
//       if (value)
//       {
//             return 'restaurant';
//       }
//       return 'cafe';
// }

function createWindowContent(place)
{

      let stars = "";
      for (i = 1; i < place.rating; i++)
      {
            stars += "<span class='fa fa-star checked'></span>"
      }

      let review = "<br/><br/> Reviews:<br/> " + place.reviews[0].text;


      let serviceDetails = "";
      place.address_components.map((component) =>
      {
            serviceDetails += component.long_name + "<br/>";
      })
      serviceDetails += place.formatted_phone_number + "<br/>";

      if (typeof place.photos === "undefined" || place.photos.length == 0)
      {
            return ("<div><h3>" + place.name + "</h3> <p>" + serviceDetails + " Rating: " + stars + "</p></div>");

      }
      else
      {
            let image = place.photos[0].getUrl();
            return ("<div id='infoWindow'><h3>" + place.name + "</h3> <img class='services_image' src='" + image + "'> <p>" + serviceDetails + " <br/>Rating: " + stars + review + "</p></div>");
      }

}
let directionsDisplay = null,
      directionsService = null

function displayMap(obj)
{
      var rendOpts = { preserveViewport: true, draggable: true, hideRouteList: true };
      directionsService = new google.maps.DirectionsService()
      // route planner
      directionsDisplay = new google.maps.DirectionsRenderer(rendOpts)
      // These constants must start at 0

      let tokyo_map = new google.maps.Map(document.getElementById('mapDiv'),
            {
                  zoom: 10,
                  center: new google.maps.LatLng(35.6, 139.6),
                  mapTypeId: google.maps.MapTypeId.ROADMAP,
                  options: {
                        gestureHandling: 'greedy',
                  },
                  mapTypeControlOptions: {
                        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.TOP_CENTER,
                  }
            })

      let location_marker
      let mapWindow = new google.maps.InfoWindow()

      google.maps.event.addListener(tokyo_map, "click", (event) =>
      {
            addMarker(event.latLng, tokyo_map);
      });

      let new_marker;
      function addMarker(location, map)
      {
            new_marker= new google.maps.Marker({
                  position: location,
                  label: labels[labelIndex++ % labels.length],
                  map: map,
            });

            
      }

      obj.map((ob, index) =>
      {
            let lati = parseFloat(ob.lat);
            let longt = parseFloat(ob.long);
            location_marker = new google.maps.Marker({
                  position: new google.maps.LatLng(ob.lat, ob.long),
                  map: tokyo_map,
            })

            google.maps.event.addListener(location_marker, 'click', (function (location_marker)
            {
                  return function ()
                  {
                        tokyo_map.panTo(this.getPosition());
                        tokyo_map.setZoom(14);
                        mapWindow.setContent(createMarkerContent(ob))
                        mapWindow.open(tokyo_map, location_marker)

                        let services_centre_location = { lat: ob.lat, lng: ob.long }
                        let service = new google.maps.places.PlacesService(tokyo_map)
                        service.nearbySearch(
                              {
                                    location: services_centre_location,
                                    radius: 1000,
                                    type: [radioValue],
                              }, getNearbyServicesMarkers)
                  }
            })(location_marker, index))
      })

      let nearbyServicesMarkers = [] // used in both getNearbyServicesMarkers() and createMarker()
      function getNearbyServicesMarkers(results, status)
      {
            if (status === google.maps.places.PlacesServiceStatus.OK)
            {
                  // hide any previously displayed services markers
                  if (nearbyServicesMarkers.length > 0)
                  {
                        nearbyServicesMarkers.map(nearbyServicesMarker =>
                        {
                              nearbyServicesMarker.setVisible(false)
                        })
                  }
                  // empty nearbyServicesMarkers[], so that it can be used to hold the nearby services markers for the currently clicked marker
                  nearbyServicesMarkers = []


                  // Previously was just creating markers but now get the details of the service 
                  // What is in createServiceMarkers was the code in place below instead of querying for service details
                  results.map((result) =>
                  {
                        let request = {
                              placeId: result.place_id,
                        }
                        service = new google.maps.places.PlacesService(tokyo_map);
                        service.getDetails(request, createServiceMarkers);
                  })

            }
      }


      function createServiceMarkers(place, status)
      {

            if (status == google.maps.places.PlacesServiceStatus.OK)
            {
                  createMarker(place);
            }
      }


      function createMarker(place)
      {


            let icon = null;
            if (place.types.includes("cafe"))
            {
                  icon = {
                        url: "../assets/img/cafe.png",  //File Path
                        scaledSize: new google.maps.Size(30, 30),
                  }
            }
            else if (place.types.includes("restaurant"))
            {
                  icon = {
                        url: "../assets/img/restaurant.png",  //File Path
                        scaledSize: new google.maps.Size(25, 30),
                  }
            }
            else if (place.types.includes("convenience_store"))
            {
                  icon = {
                        url: "../assets/img/gas_station.jpg",  //File Path
                        scaledSize: new google.maps.Size(25, 30),
                  }
            }
            else if (place.types.includes("point_of_interest"))
            {
                  icon = {
                        url: "../assets/img/hotel.png",  //File Path
                        scaledSize: new google.maps.Size(25, 30),
                  }
            }

            let marker = new google.maps.Marker(
                  {
                        map: tokyo_map,
                        position: place.geometry.location,
                        icon: icon

                  })

            // add the marker to nearbyServicesMarkers[]       
            nearbyServicesMarkers.push(marker)

            google.maps.event.addListener(marker, 'click', function ()
            {
                  tokyo_map.setZoom(16);
                  tokyo_map.panTo(this.getPosition());
                  mapWindow.setContent(createWindowContent(place))
                  mapWindow.open(tokyo_map, this)
            })
      }
      directionsDisplay.setMap(tokyo_map)
      calculateRoute("DRIVING");


}

const calculateRoute = (travelMode = "DRIVING") => 
{
      console.log("Start");
      // document.getElementById("transport-mode").innerHTML = travelMode
      let start = document.getElementById("start").value
      let end = document.getElementById("end").value
      let request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode[travelMode]
      }

      directionsService.route(request, (response, status) =>
      {
            if (status == google.maps.DirectionsStatus.OK)
            {
                  directionsDisplay.setDirections(response)
            }
      })
}
