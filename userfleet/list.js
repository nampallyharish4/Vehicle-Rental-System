/* global bootstrap: false */
(() => {
  'use strict';
  const tooltipTriggerList = Array.from(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
})();

function addVehicle(type) {
  const vehicleName = prompt('Enter Vehicle Name:')?.trim();
  const vehicleNumber = prompt('Enter Vehicle Number:')?.trim();
  const carPrice = prompt('Enter Price:')?.trim();

  if (!vehicleName || !vehicleNumber || !carPrice) {
    alert('All fields are required!');
    return;
  }

  const price = parseFloat(carPrice);
  if (isNaN(price) || price <= 0) {
    alert('Please enter a valid positive number for price!');
    return;
  }

  const tableBody = document.getElementById('vehicle-list');
  if (!tableBody) {
    alert('Vehicle list table not found!');
    return;
  }

  // Generate new ID based on max existing ID
  let maxId = 0;
  Array.from(tableBody.rows).forEach((row) => {
    const id = parseInt(row.cells[1].innerText);
    if (!isNaN(id) && id > maxId) maxId = id;
  });
  const carId = maxId + 1;

  const newRow = tableBody.insertRow();
  newRow.innerHTML = `
    <td>${type}</td>
    <td>${carId}</td>
    <td>${vehicleName}</td>
    <td>${vehicleNumber}</td>
    <td>$${price.toFixed(2)}</td>
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
  const tableBody = document.getElementById('vehicle-list');
  const row = Array.from(tableBody.rows).find(
    (r) => parseInt(r.cells[1].innerText) === id
  );

  if (!row) {
    alert('Vehicle not found!');
    return;
  }

  let newValue;
  switch (field) {
    case 'name':
      newValue = prompt(
        'Enter new Vehicle Name:',
        row.cells[2].innerText
      )?.trim();
      if (newValue) {
        row.cells[2].innerText = newValue;
      } else {
        alert('Name cannot be empty.');
      }
      break;

    case 'number':
      newValue = prompt(
        'Enter new Vehicle Number:',
        row.cells[3].innerText
      )?.trim();
      if (newValue) {
        row.cells[3].innerText = newValue;
      } else {
        alert('Number cannot be empty.');
      }
      break;

    case 'price':
      newValue = prompt(
        'Enter new Price:',
        row.cells[4].innerText.replace('$', '')
      )?.trim();
      const price = parseFloat(newValue);
      if (newValue && !isNaN(price) && price > 0) {
        row.cells[4].innerText = `$${price.toFixed(2)}`;
      } else {
        alert('Please enter a valid positive number for price!');
      }
      break;

    default:
      alert('Unknown modification field!');
  }
}

function deleteVehicle(id) {
  const tableBody = document.getElementById('vehicle-list');
  const row = Array.from(tableBody.rows).find(
    (r) => parseInt(r.cells[1].innerText) === id
  );

  if (!row) {
    alert('Vehicle not found!');
    return;
  }

  if (confirm(`Are you sure you want to delete vehicle ID ${id}?`)) {
    tableBody.deleteRow(row.rowIndex - 1); // account for table head
  }
}

let vehicleId = 1;

function addVehicle(event) {
  event.preventDefault();
  const type = document.getElementById('vehicleType').value;
  const name = document.getElementById('vehicleName').value;
  const number = document.getElementById('vehicleNumber').value;
  const price = document.getElementById('vehiclePrice').value;

  const table = document.getElementById('vehicle-list');
  const row = document.createElement('tr');
  row.setAttribute('id', `vehicle-${vehicleId}`);

  row.innerHTML = `
          <td>${type}</td>
          <td>${vehicleId}</td>
          <td>${name}</td>
          <td>${number}</td>
          <td>$${price}</td>
          <td>
            <button class="btn btn-sm btn-warning me-1" onclick="editVehicle(${vehicleId})">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteVehicle(${vehicleId})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        `;
  table.appendChild(row);
  vehicleId++;

  // Reset modal
  document.querySelector('#addVehicleModal form').reset();
  const modal = bootstrap.Modal.getInstance(
    document.getElementById('addVehicleModal')
  );
  modal.hide();
}

function editVehicle(id) {
  const row = document.getElementById(`vehicle-${id}`);
  const cells = row.querySelectorAll('td');

  const name = prompt('Edit Vehicle Name:', cells[2].innerText);
  const number = prompt('Edit Vehicle Number:', cells[3].innerText);
  const price = prompt('Edit Price:', cells[4].innerText.replace('$', ''));

  if (name !== null) cells[2].innerText = name;
  if (number !== null) cells[3].innerText = number;
  if (price !== null) cells[4].innerText = `$${price}`;
}

function deleteVehicle(id) {
  if (confirm('Are you sure you want to delete this vehicle?')) {
    const row = document.getElementById(`vehicle-${id}`);
    row.remove();
  }
}
