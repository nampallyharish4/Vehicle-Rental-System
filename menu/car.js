/* global bootstrap: false */
(() => {
  'use strict'
  const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  tooltipTriggerList.forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl)
  })
})()

function addVehicle(type) {
  const vehicleName = prompt("Enter Vehicle Name:");
  const vehicleNumber = prompt("Enter Vehicle Number:");
  const carPrice = prompt("Enter Price:");

  if (!vehicleName || !vehicleNumber || !carPrice) {
    alert("All fields are required!");
    return;
  }

  if (isNaN(carPrice)) {
    alert("Price must be a number!");
    return;
  }

  const tableBody = document.getElementById("vehicle-list");
  const lastRow = tableBody.rows[tableBody.rows.length - 1];
  let carId = lastRow ? parseInt(lastRow.cells[1].innerText) + 1 : 1;

  const newRow = tableBody.insertRow();
  newRow.innerHTML = `
    <td>${type}</td>
    <td>${carId}</td>
    <td>${vehicleName}</td>
    <td>${vehicleNumber}</td>
    <td>$${carPrice}</td>
    <td>
      <div class="dropdown d-inline-block me-2">
        <button class="btn btn-warning dropdown-toggle" type="button" id="modifyVehicleDropdown${carId}" data-bs-toggle="dropdown" aria-expanded="false">
          Modify
        </button>
        <ul class="dropdown-menu" aria-labelledby="modifyVehicleDropdown${carId}">
          <li><a class="dropdown-item" href="#" onclick="modifyVehicle(${carId}, 'name')">Name</a></li>
          <li><a class="dropdown-item" href="#" onclick="modifyVehicle(${carId}, 'number')">Number</a></li>
          <li><a class="dropdown-item" href="#" onclick="modifyVehicle(${carId}, 'price')">Price</a></li>
        </ul>
      </div>
      <div class="dropdown d-inline-block">
        <button class="btn btn-danger dropdown-toggle" type="button" id="deleteVehicleDropdown${carId}" data-bs-toggle="dropdown" aria-expanded="false">
          Delete
        </button>
        <ul class="dropdown-menu" aria-labelledby="deleteVehicleDropdown${carId}">
          <li><a class="dropdown-item" href="#" onclick="deleteVehicle(${carId})">Confirm Delete</a></li>
        </ul>
      </div>
    </td>
  `;
}

function modifyVehicle(id, field) {
  const row = document.querySelector(`#vehicle-list tr:nth-child(${id})`);
  let newValue;

  switch (field) {
    case 'name':
      newValue = prompt("Enter new Vehicle Name:", row.cells[2].innerText);
      if (newValue) row.cells[2].innerText = newValue;
      break;
    case 'number':
      newValue = prompt("Enter new Vehicle Number:", row.cells[3].innerText);
      if (newValue) row.cells[3].innerText = newValue;
      break;
    case 'price':
      newValue = prompt("Enter new Price:", row.cells[4].innerText.replace("$", ""));
      if (newValue && !isNaN(newValue)) row.cells[4].innerText = `$${newValue}`;
      else alert("Invalid price!");
      break;
  }
}

function deleteVehicle(id) {
  if (confirm("Are you sure you want to delete this vehicle?")) {
    const row = document.querySelector(`#vehicle-list tr:nth-child(${id})`);
    row.remove();
  }
}

const themeSwitch = document.getElementById('themeSwitch');
themeSwitch.addEventListener('change', function() {
  if (this.checked) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  }
});
