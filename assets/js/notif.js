

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

document.addEventListener('DOMContentLoaded', function() {
  // Function to safely get and parse data from localStorage
  const getLocalStorageData = (key) => {
    try {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : [];
    } catch (e) {
      console.error(`Error parsing ${key}:`, e);
      return [];
    }
  };

  // Get data from both locations
  const orderData = getLocalStorageData('orderData');
  const completedOrders = getLocalStorageData('completedOrders');

  // Combine and filter valid orders from both sources
  const allOrders = [...orderData, ...completedOrders].filter(order => 
    order.items && Array.isArray(order.items) && order.items.length > 0
  );

  const display = document.getElementById('orderCardsContainer');
  if (!display) {
    console.error("Display container not found");
    return;
  }

  if (allOrders.length === 0) {
    display.innerHTML = '<div class="alert alert-info">No orders yet.</div>';
    return;
  }

  // Generate HTML for each order with source indicator
  display.innerHTML = allOrders.map((order, index) => {
    const orderTime = order.timestamp 
      ? new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '--:--';

    // Determine order source for styling
    const isCompleted = completedOrders.some(completedOrder => 
      completedOrder.timestamp === order.timestamp
    );

    const itemsHtml = order.items.map(item => `
      <div class="order-item d-flex justify-content-between align-items-center py-2 border-bottom">
        <div class="d-flex flex-wrap align-items-center">
          <strong class="me-2">${item.quantity || 1}x</strong>
          <span class="me-2">${item.name || 'Unnamed item'}</span>
          ${item.sugarLevel ? `<small class="text-muted me-2">(${item.sugarLevel}% sugar)</small>` : ''}
          ${item.iceLevel ? `<small class="text-muted">(${item.iceLevel})</small>` : ''}
        </div>
        <div class="text-end">
          <span>₱${item.totalPrice || (item.price * (item.quantity || 1)).toFixed(2)}</span>
          ${item.category ? `<div class="text-muted small">${item.category}</div>` : ''}
        </div>
      </div>
    `).join('');

    return `
      <div class="card rounded-4 p-3 mb-3 ${isCompleted ? 'border-success' : ''}" 
           data-order-index="${index}" 
           data-order-source="${isCompleted ? 'completed' : 'active'}">
        <!-- Header row with source indicator -->
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h5 class="mb-0 fs-6 fs-sm-5 d-inline">Order #${index + 1}</h5>
            ${isCompleted ? '<span class="badge bg-success ms-2">Completed</span>' : ''}
          </div>
          <small class="text-muted">${orderTime}</small>
        </div>
        
        <!-- Items list -->
        <div class="order-items mb-3">
          ${itemsHtml}
        </div>
        
        <!-- Total row -->
        <div class="d-flex justify-content-between align-items-center border-top pt-2">
          <div>
            <strong class="fs-6">Total:</strong>
            <small class="text-muted d-block">${order.paymentMode || 'Cash'} payment</small>
          </div>
          <h5 class="mb-0 fs-6 fs-sm-5">₱${order.total || '0.00'}</h5>
        </div>
        
        <!-- Controls - Only show for active orders -->
        ${!isCompleted ? `
        <div class="d-flex justify-content-end gap-2 mt-3">
          <div class="d-flex flex-column flex-sm-row align-items-end align-items-sm-center gap-2">
            <select class="form-select status-selector icon-select" style="min-width: 150px;">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>🟡 Pending</option>
              <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>🟠 Preparing</option>
              <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>🟢 Ready</option>
              <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>✅ Completed</option>
            </select>
            
            <div class="d-flex gap-2">
              <button class="btn btn-accept text-white fw-semibold rounded-pill px-3 py-1 py-sm-2"
                onclick="acceptOrder(this)">
                Accept
              </button>
              <button class="btn btn-decline fw-semibold rounded-pill px-3 py-1 py-sm-2"
                onclick="declineOrder(this)">
                Decline
              </button>
            </div>
          </div>
        </div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Initialize status selectors
  initializeStatusSelectors();
});

// Initialize status selectors with event listeners
function initializeStatusSelectors() {
  document.querySelectorAll('.status-selector').forEach(selector => {
    const card = selector.closest('.card');
    selector.addEventListener('change', function() {
      updateOrderStatus(card, this.value);
    });
  });
}

// Update order status in localStorage
function updateOrderStatus(card, status) {
  const orderIndex = card.dataset.orderIndex;
  const isCompleted = card.dataset.orderSource === 'completed';
  const storageKey = isCompleted ? 'completedOrders' : 'orderData';
  
  try {
    const orders = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (orders[orderIndex]) {
      orders[orderIndex].status = status;
      localStorage.setItem(storageKey, JSON.stringify(orders));
      
      // Visual feedback
      card.classList.remove('border-warning', 'border-primary', 'border-success');
      if (status === 'completed') {
        card.classList.add('border-success');
        card.dataset.orderSource = 'completed';
        // Move to completed orders
        moveToCompletedOrders(orderIndex);
      } else if (status === 'preparing') {
        card.classList.add('border-primary');
      } else if (status === 'ready') {
        card.classList.add('border-success');
      } else {
        card.classList.add('border-warning');
      }
    }
  } catch (e) {
    console.error("Error updating order status:", e);
  }
}

// Move order to completedOrders
function moveToCompletedOrders(index) {
  try {
    const activeOrders = JSON.parse(localStorage.getItem('orderData')) || [];
    const completedOrders = JSON.parse(localStorage.getItem('completedOrders')) || [];
    
    if (activeOrders[index]) {
      // Add to completed
      completedOrders.push(activeOrders[index]);
      // Remove from active
      activeOrders.splice(index, 1);
      
      // Update localStorage
      localStorage.setItem('orderData', JSON.stringify(activeOrders));
      localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
    }
  } catch (e) {
    console.error("Error moving order to completed:", e);
  }
}

// Global functions for button actions
function acceptOrder(button) {
  const card = button.closest('.card');
  const selector = card.querySelector('.status-selector');
  selector.value = 'preparing';
  selector.dispatchEvent(new Event('change'));
}

function declineOrder(button) {
  const card = button.closest('.card');
  const orderIndex = card.dataset.orderIndex;
  
  try {
    let activeOrders = JSON.parse(localStorage.getItem('orderData')) || [];
    activeOrders.splice(orderIndex, 1);
    localStorage.setItem('orderData', JSON.stringify(activeOrders));
    card.remove();
  } catch (e) {
    console.error("Error declining order:", e);
  }
}