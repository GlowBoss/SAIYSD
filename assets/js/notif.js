

// Global function so it works with onclick=
function changeCardStatus(button, newStatus) {
  const card = button.closest('[data-status]');
  const select = card.querySelector('.status-selector');
  const actionButtons = card.querySelector('.action-buttons');

  // 1. Update data-status
  card.setAttribute('data-status', newStatus);

  // 2. Update dropdown
  if (select) select.value = newStatus;

  // 3. Hide action buttons if not preparing
  if (actionButtons) {
    actionButtons.style.display = (newStatus === 'preparing') ? 'flex' : 'none';
  }

  // 4. Re-apply filter
  const activeCategoryBtn = document.querySelector('.categorybtn-active');
  if (activeCategoryBtn) {
    const selectedCategory = activeCategoryBtn.getAttribute('data-category');
    const cardStatus = card.getAttribute('data-status');
    card.style.display = (selectedCategory === 'all' || selectedCategory === cardStatus) ? 'block' : 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Handle dropdown change
  document.querySelectorAll('.status-selector').forEach(select => {
    select.addEventListener('change', function () {
      const card = this.closest('[data-status]');
      const status = this.value;

      card.setAttribute('data-status', status);

      const actionButtons = card.querySelector('.action-buttons');
      if (actionButtons) {
        actionButtons.style.display = (status === 'preparing') ? 'flex' : 'none';
      }

      // Re-apply filter
      const activeCategoryBtn = document.querySelector('.categorybtn-active');
      if (activeCategoryBtn) {
        const selectedCategory = activeCategoryBtn.getAttribute('data-category');
        card.style.display = (selectedCategory === 'all' || selectedCategory === status) ? 'block' : 'none';
      }
    });
  });

  // Filter by category buttons
  document.querySelectorAll('.categorybtn, .categorybtn-active').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.categorybtn, .categorybtn-active').forEach(b => {
        b.classList.remove('categorybtn-active');
      });
      btn.classList.add('categorybtn-active');

      const selectedCategory = btn.getAttribute('data-category');

      document.querySelectorAll('.card[data-status]').forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        card.style.display = (selectedCategory === 'all' || cardStatus === selectedCategory) ? 'block' : 'none';
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const offcanvasElement = document.getElementById("offcanvasSidebar");
  const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);

  // Open offcanvas by default on small screens
  if (window.innerWidth < 768) {
    bsOffcanvas.show();
  }
});


// jam
fetch("../modal/inventory-management-modal.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("modal-placeholder").innerHTML = data;
    document.querySelector('.addbtn').addEventListener('click', function (e) {
      e.preventDefault();
      confirmOrder();
    });
  });

function openPopup() {
  const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
  modal.show();
}

function confirmOrder() {
  const modal = bootstrap.Modal.getInstance(document.getElementById('confirmModal'));
  modal.hide();

  const toastElement = document.getElementById('orderToast');
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// Get both arrays from localStorage
const completedOrders = JSON.parse(localStorage.getItem('completedOrders') || '[]');
const orderData = JSON.parse(localStorage.getItem('orderData') || '[]');

// Combine the arrays
const allOrders = [...completedOrders, ...orderData];

// Check if we have any orders
const display = document.getElementById('orderCardsContainer');

if (Array.isArray(allOrders) && allOrders.length > 0) {
  const productsHTML = allOrders.map(item => `
    <div class="card rounded-4 p-3 text-start" data-status="all">
      <!-- Main Content Row -->
      <div class="d-flex flex-column flex-md-row justify-content-between">
        <!-- Left Content - Order Details -->
        <div class="order-details">
          <strong class="order-title fs-5 fs-md-3">${item.name || 'No name'}</strong>
          <div class="order-item ms-0 ms-md-5 mt-1">
            <strong>${item.quantity || 1}x</strong> ${item.name || 'No name'}
          </div>
          <div class="order-price ms-0 ms-md-5 mt-1">₱${item.price || '0'}</div>
        </div>
        
        <!-- Right Content - Controls -->
        <div class="order-controls mt-3 mt-md-0">
          <div class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2">
            <!-- Status Dropdown -->
            <div class="status-selector-container">
              <select class="form-select status-selector icon-select">
                <option value="all" selected>🟡Pending</option>
                <option value="preparing">🟡Preparing</option>
                <option value="ready">🟢Ready</option>
                <option value="completed">✅Completed</option>
              </select>
            </div>
            
            <!-- Action Buttons -->
            <div class="action-buttons d-flex gap-2">
              <button class="btn btn-accept text-white fw-semibold rounded-pill px-3 py-1 py-sm-2"
                onclick="changeCardStatus(this, 'ready')">Accept</button>
              <button class="btn btn-decline fw-semibold rounded-pill px-3 py-1 py-sm-2">Decline</button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer - Payment Info -->
      <div class="order-footer mt-2">
        <div class="text-muted small text-start text-md-end">
          Mode of Payment: ${item.paymentMethod || 'Not specified'}
        </div>
        ${item.paymentMethod && item.paymentMethod.toLowerCase() !== 'cash' ?
          `<div class="text-muted small text-start text-md-end">
            Reference Number: ${item.refNumber || 'N/A'}
          </div>` : ''
        }
      </div>
    </div>
  `).join('');
  
  display.innerHTML = productsHTML;
} else {
  display.innerHTML = '<p class="text-muted">No orders found.</p>';
}