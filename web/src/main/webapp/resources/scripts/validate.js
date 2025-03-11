document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded ✅");

    const customerNameInput = document.getElementById("customer-name");
    const errorMessage = document.getElementById("name-error");
    const customerForm = document.getElementById("customer-form");

    if (!customerNameInput || !errorMessage || !customerForm) {
        console.error("ERROR: Some elements are missing in the DOM!");
        return;
    }

    function validateCustomerName() {
        let nameValue = customerNameInput.value.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' '); // Trim and fix multiple spaces
        console.log("Customer Name Input:", nameValue);

        let isValid = true;

        if (nameValue === "") {
            errorMessage.textContent = "Customer Name is required.";
            errorMessage.style.display = "block";
            isValid = false;
        } else if (nameValue.length < 2 || nameValue.length > 50) {
            errorMessage.textContent = "Customer Name must be between 2 and 50 characters.";
            errorMessage.style.display = "block";
            isValid = false;
        } else if (!/^[A-Za-z\s'-]+$/.test(nameValue)) {
            errorMessage.textContent = "Only letters, spaces, hyphens, and apostrophes are allowed.";
            errorMessage.style.display = "block";
            isValid = false;
        } else {
            errorMessage.textContent = "";
            errorMessage.style.display = "none";
        }

        return isValid;
    }

    // Auto-Capitalize each word while typing and remove extra spaces
    customerNameInput.addEventListener("input", function () {
        this.value = this.value
            .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize each word
            .replace(/\s+/g, ' '); // Ensure only one space between words
        validateCustomerName();
    });

    // Remove extra spaces at the start & end when losing focus
    customerNameInput.addEventListener("blur", function () {
        this.value = this.value.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' '); // Trim and fix spaces
        validateCustomerName();
    });

    // Prevent form submission if validation fails
    customerForm.addEventListener("submit", function (event) {
        if (!validateCustomerName()) {
            event.preventDefault();
            alert("Please fix the errors before submitting.");
        }
    });
});
