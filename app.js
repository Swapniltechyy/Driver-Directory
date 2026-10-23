import { CITIES_DATA, AREAS_DATA, DRIVERS_DATA } from './data.js';

// Application State
const state = {
  searchTerm: '',
  selectedCityId: null,
  selectedAreaId: null,
  selectedCategories: ['Owner', 'Driver'], // Pre-selected as per screenshot reference
  sortBy: 'name-asc',
  filteredDrivers: [...DRIVERS_DATA]
};

// DOM References
const nameSearchInput = document.getElementById('nameSearchInput');
const citySelect = document.getElementById('citySelect');
const areaSelect = document.getElementById('areaSelect');
const categoryDropdownTrigger = document.getElementById('categoryDropdownTrigger');
const categoryDropdownText = document.getElementById('categoryDropdownText');
const categoryPopover = document.getElementById('categoryPopover');
const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
const btnSearch = document.getElementById('btnSearch');
const btnClear = document.getElementById('btnClear');
const resultsCountEl = document.getElementById('resultsCount');
const footerCountEl = document.getElementById('footerCount');
const sortSelect = document.getElementById('sortSelect');
const driverListEl = document.getElementById('driverList');
const emptyStateEl = document.getElementById('emptyState');

// Profile Detail Modal Elements
const profileModal = document.getElementById('profileModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalAvatar = document.getElementById('modalAvatar');
const modalName = document.getElementById('modalName');
const modalVehicle = document.getElementById('modalVehicle');
const modalPhoneVal = document.getElementById('modalPhoneVal');
const modalCityVal = document.getElementById('modalCityVal');
const modalAreaVal = document.getElementById('modalAreaVal');
const modalBadgesContainer = document.getElementById('modalBadgesContainer');
const modalCallBtn = document.getElementById('modalCallBtn');
const modalWaBtn = document.getElementById('modalWaBtn');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  populateCityDropdown();
  populateAreaDropdown();
  updateCategoryDropdownLabel();
  setupEventListeners();
  applyFiltersAndRender();
});

// Populate City Dropdown
function populateCityDropdown() {
  citySelect.innerHTML = `<option value="">All Cities</option>`;
  CITIES_DATA.forEach(city => {
    const opt = document.createElement('option');
    opt.value = city.id;
    opt.textContent = city.name;
    // Set initial city to Darjeeling (id: 1) matching screenshot reference
    if (city.id === 1) opt.selected = true;
    citySelect.appendChild(opt);
  });
  state.selectedCityId = 1;
}

// Populate Area/Stand Dropdown dynamically based on selected City
function populateAreaDropdown() {
  const currentCityId = citySelect.value ? parseInt(citySelect.value, 10) : null;
  areaSelect.innerHTML = `<option value="">All Areas / Stands</option>`;
  
  const applicableAreas = currentCityId 
    ? AREAS_DATA.filter(a => a.cityId === currentCityId)
    : AREAS_DATA;

  applicableAreas.forEach(area => {
    const opt = document.createElement('option');
    opt.value = area.id;
    opt.textContent = area.name;
    // Initial area set to Mall Road Stand (id: 101) matching screenshot
    if (area.id === 101 && currentCityId === 1) opt.selected = true;
    areaSelect.appendChild(opt);
  });

  state.selectedAreaId = areaSelect.value ? parseInt(areaSelect.value, 10) : null;
}

// Update Category Dropdown Label
function updateCategoryDropdownLabel() {
  if (state.selectedCategories.length === 0) {
    categoryDropdownText.textContent = 'All Categories';
  } else if (state.selectedCategories.length === 3) {
    categoryDropdownText.textContent = 'Owner + Driver + Vendor';
  } else {
    categoryDropdownText.textContent = state.selectedCategories.join(' + ');
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Realtime search input
  nameSearchInput.addEventListener('input', (e) => {
    state.searchTerm = e.target.value.trim();
    applyFiltersAndRender();
  });

  // City change handler
  citySelect.addEventListener('change', (e) => {
    state.selectedCityId = e.target.value ? parseInt(e.target.value, 10) : null;
    populateAreaDropdown();
    applyFiltersAndRender();
  });

  // Area change handler
  areaSelect.addEventListener('change', (e) => {
    state.selectedAreaId = e.target.value ? parseInt(e.target.value, 10) : null;
    applyFiltersAndRender();
  });

  // Category dropdown trigger toggle
  categoryDropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    categoryDropdownTrigger.classList.toggle('open');
    categoryPopover.classList.toggle('show');
  });

  // Close category popover when clicking outside
  document.addEventListener('click', (e) => {
    if (!categoryPopover.contains(e.target) && !categoryDropdownTrigger.contains(e.target)) {
      categoryDropdownTrigger.classList.remove('open');
      categoryPopover.classList.remove('show');
    }
  });

  // Category checkbox change
  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const selected = Array.from(categoryCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);
      state.selectedCategories = selected;
      updateCategoryDropdownLabel();
      applyFiltersAndRender();
    });
  });

  // Search Button Click
  btnSearch.addEventListener('click', () => {
    applyFiltersAndRender();
  });

  // Clear Filters Button Click
  btnClear.addEventListener('click', () => {
    state.searchTerm = '';
    nameSearchInput.value = '';
    
    citySelect.value = '';
    state.selectedCityId = null;

    populateAreaDropdown();
    areaSelect.value = '';
    state.selectedAreaId = null;

    state.selectedCategories = [];
    categoryCheckboxes.forEach(cb => cb.checked = false);
    updateCategoryDropdownLabel();

    state.sortBy = 'name-asc';
    sortSelect.value = 'name-asc';

    applyFiltersAndRender();
  });

  // Sort Handler
  sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    applyFiltersAndRender();
  });

  // Modal Close Events
  modalCloseBtn.addEventListener('click', closeModal);
  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeModal();
  });
}

// Apply Search & Category Filters (Strict AND-based Category Logic)
function applyFiltersAndRender() {
  let results = DRIVERS_DATA.filter(driver => {
    // 1. Name Search (Case insensitive, partial match)
    if (state.searchTerm) {
      const term = state.searchTerm.toLowerCase();
      const matchName = driver.name.toLowerCase().includes(term);
      const matchVehicle = `${driver.vehicleMake} ${driver.vehicleModel}`.toLowerCase().includes(term);
      if (!matchName && !matchVehicle) return false;
    }

    // 2. City Filter
    if (state.selectedCityId && driver.cityId !== state.selectedCityId) {
      return false;
    }

    // 3. Area Filter
    if (state.selectedAreaId && driver.areaId !== state.selectedAreaId) {
      return false;
    }

    // 4. Strict AND-based Multi-Category Filter
    // Driver must possess ALL selected categories
    if (state.selectedCategories.length > 0) {
      const hasAllCategories = state.selectedCategories.every(cat => 
        driver.categories.includes(cat)
      );
      if (!hasAllCategories) return false;
    }

    return true;
  });

  // Apply Sorting
  results.sort((a, b) => {
    if (state.sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (state.sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    } else if (state.sortBy === 'city') {
      return a.cityName.localeCompare(b.cityName);
    }
    return 0;
  });

  state.filteredDrivers = results;
  renderDriverList(results);
  updateCounters(results.length, DRIVERS_DATA.length);
}

// Render Driver Cards
function renderDriverList(drivers) {
  if (drivers.length === 0) {
    driverListEl.style.display = 'none';
    emptyStateEl.style.display = 'flex';
    return;
  }

  driverListEl.style.display = 'flex';
  emptyStateEl.style.display = 'none';
  driverListEl.innerHTML = '';

  drivers.forEach(driver => {
    const card = document.createElement('div');
    card.className = 'driver-card';
    card.dataset.driverId = driver.id;

    // Badges HTML
    const badgesHtml = driver.categories.map(cat => {
      const badgeClass = cat === 'Owner' ? 'badge-owner' : cat === 'Driver' ? 'badge-driver' : 'badge-vendor';
      return `<span class="badge ${badgeClass}">${cat}</span>`;
    }).join('');

    card.innerHTML = `
      <div class="driver-identity">
        <div class="avatar-circle" style="background-color: ${driver.avatarBg}; color: ${driver.avatarColor};">
          ${driver.initials}
        </div>
        <div class="driver-name-details">
          <span class="driver-name">${driver.name}</span>
          <span class="driver-vehicle">
            <i class="fa-solid fa-car-side"></i> ${driver.vehicleMake} ${driver.vehicleModel}
          </span>
        </div>
      </div>

      <div class="driver-contact">
        <a href="tel:${driver.phone.replace(/\s+/g, '')}" class="contact-phone-link" onclick="event.stopPropagation()">
          <i class="fa-solid fa-phone"></i>
          <span>${driver.phone}</span>
        </a>
        <a href="https://wa.me/${driver.whatsapp}" target="_blank" rel="noopener noreferrer" class="whatsapp-btn" title="Chat on WhatsApp" onclick="event.stopPropagation()">
          <i class="fa-brands fa-whatsapp"></i>
        </a>
      </div>

      <div class="driver-location">
        <i class="fa-solid fa-location-dot"></i>
        <div class="location-text">
          <span class="city-name">${driver.cityName}</span>
          <span class="area-name">${driver.areaName}</span>
        </div>
      </div>

      <div class="driver-categories">
        ${badgesHtml}
      </div>

      <div class="action-chevron">
        <i class="fa-solid fa-chevron-right"></i>
      </div>
    `;

    // Click event to open driver details modal
    card.addEventListener('click', () => openModal(driver));

    driverListEl.appendChild(card);
  });
}

// Update Result Counters
function updateCounters(filteredCount, totalCount) {
  resultsCountEl.textContent = `${filteredCount} driver${filteredCount === 1 ? '' : 's'} found`;
  footerCountEl.textContent = `Showing ${filteredCount} of ${totalCount} drivers`;
}

// Modal Detail Handler
function openModal(driver) {
  modalAvatar.style.backgroundColor = driver.avatarBg;
  modalAvatar.style.color = driver.avatarColor;
  modalAvatar.textContent = driver.initials;
  
  modalName.textContent = driver.name;
  modalVehicle.textContent = `${driver.vehicleMake} ${driver.vehicleModel}`;
  
  modalPhoneVal.textContent = driver.phone;
  modalCityVal.textContent = driver.cityName;
  modalAreaVal.textContent = driver.areaName;

  modalBadgesContainer.innerHTML = driver.categories.map(cat => {
    const badgeClass = cat === 'Owner' ? 'badge-owner' : cat === 'Driver' ? 'badge-driver' : 'badge-vendor';
    return `<span class="badge ${badgeClass}">${cat}</span>`;
  }).join('');

  modalCallBtn.href = `tel:${driver.phone.replace(/\s+/g, '')}`;
  modalWaBtn.href = `https://wa.me/${driver.whatsapp}`;

  profileModal.classList.add('active');
}

function closeModal() {
  profileModal.classList.remove('active');
}
