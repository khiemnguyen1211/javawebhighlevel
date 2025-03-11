const addressModal = document.getElementById("address-modal");
const openModalButton = document.getElementById("address-btn");
const closeModalButton = document.getElementById("close-modal");
const customerAddressInput = document.getElementById("customer-address");
const addressForm = document.getElementById("address-form");
const addressDisplay = document.getElementById("address-display");

// Show the modal
openModalButton.addEventListener("click", () => {
    addressModal.style.display = "block";
});

// Close the modal
closeModalButton.addEventListener("click", () => {
    addressModal.style.display = "none";
});

// Submit the address form
addressForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const streetNumber = document.getElementById("street-number").value.trim();
    const streetName = document.getElementById("street-name").value.trim();
    const suburb = document.getElementById("suburb").value.trim();
    const state = document.getElementById("state").value.trim();
    const postcode = document.getElementById("postcode").value.trim();

    if (!streetName || !suburb || !state || !postcode) {
        alert("Please fill in all address fields.");
        return;
    }

    // Combine the address into a formatted string
    const fullAddress = `${streetNumber} ${streetName}, ${suburb}, ${state}, ${postcode}, Australia`;

    // Set the customer address input field
    customerAddressInput.value = fullAddress;

    // Geocode the address to get latitude and longitude
    geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
            const location = results[0].geometry.location;

            // Move the marker to the new location
            marker.setPosition(location);
            marker.setMap(map);

            // Center and zoom the map
            map.setCenter(location);
            map.setZoom(17);
        } else {
            alert("Could not find location: " + status);
        }
    });

    // Close the modal
    addressModal.style.display = "none";
});


// Close modal when clicking outside the modal content
window.addEventListener("click", (event) => {
    if (event.target === addressModal) {
        addressModal.style.display = "none";
    }
});




//integrate googlemap
let map;
let marker;
let geocoder;
let autocomplete;
let formAutocomplete;

function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: { lat: -33.8568, lng: 151.2153 }, // Default center
    });

    marker = new google.maps.Marker({
        map,
        draggable: true,
    });

    geocoder = new google.maps.Geocoder();

    // Autocomplete for main address input
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("customer-address"),
        { types: ["geocode"], componentRestrictions: { country: "AU" } }
    );

    autocomplete.addListener("place_changed", function () {
        let place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
            alert("No details available for the selected address.");
            return;
        }

        // Move marker and center map with zoom
        map.setCenter(place.geometry.location);
        map.setZoom(17);
        marker.setPosition(place.geometry.location);
        marker.setMap(map);

        // Fill address field
        document.getElementById("customer-address").value = place.formatted_address;

        // Fill form fields
        fillFormFields(place);
    });

    // Autocomplete for form fields (street, suburb, state, postcode)
    formAutocomplete = new google.maps.places.Autocomplete(
        document.getElementById("street-name"),
        { types: ["geocode"], componentRestrictions: { country: "AU" } }
    );

    formAutocomplete.addListener("place_changed", fillInAddress);

    // Marker drag event to update address and zoom in
    google.maps.event.addListener(marker, "dragend", function () {
        geocodePosition(marker.getPosition());
    });
}

// Reverse geocode to update form when marker moves
function geocodePosition(pos) {
    geocoder.geocode({ location: pos }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                document.getElementById("customer-address").value = results[0].formatted_address;
                fillFormFields(results[0]);

                // Zoom in when marker moves
                map.setCenter(pos);
                map.setZoom(17);
            }
        }
    });
}

// Extract and fill form fields (with street number)
function fillInAddress() {
    const place = formAutocomplete.getPlace();
    if (!place.geometry) {
        alert("No details available for this address!");
        return;
    }

    fillFormFields(place);

    // Move marker, center map, and zoom in
    map.setCenter(place.geometry.location);
    map.setZoom(17);
    marker.setPosition(place.geometry.location);
}

// Helper function to extract address components
function fillFormFields(place) {
    let unitNumber = "";
    let streetNumber = "";
    let streetName = "";
    let streetType = "";
    let suburb = "";
    let state = "";
    let postcode = "";
    let country = "Australia"; // Default

    console.log("Address Components:", place.address_components); // Debugging

    place.address_components.forEach((component) => {
        const types = component.types;

        if (types.includes("subpremise")) unitNumber = component.long_name;
        if (types.includes("street_number")) streetNumber = component.long_name;
        if (types.includes("route")) {
            let streetParts = component.long_name.split(" ");
            streetName = streetParts.slice(0, -1).join(" ");
            streetType = streetParts.slice(-1).join(" ");
        }
        if (types.includes("locality") || types.includes("sublocality")) suburb = component.long_name;
        if (types.includes("administrative_area_level_1")) state = component.short_name;
        if (types.includes("postal_code")) postcode = component.long_name;
        if (types.includes("country")) country = component.long_name;
    });

    console.log("Extracted Street Name:", streetName);
    console.log("Extracted Street Type:", streetType);

    if (document.getElementById("street-name")) document.getElementById("street-name").value = streetName;
    if (document.getElementById("street-type")) document.getElementById("street-type").value = streetType;
    if (document.getElementById("street-number")) document.getElementById("street-number").value = streetNumber;
    if (document.getElementById("suburb")) document.getElementById("suburb").value = suburb;
    if (document.getElementById("state")) document.getElementById("state").value = state;
    if (document.getElementById("postcode")) document.getElementById("postcode").value = postcode;
    if (document.getElementById("country")) document.getElementById("country").value = country;
}





// Assign the function to global window object
window.initMap = initMap;








