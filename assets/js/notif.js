
// Your existing offcanvas and fetch code remains unchanged
document.addEventListener("DOMContentLoaded", function () {
  const offcanvasElement = document.getElementById("offcanvasSidebar");
  const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
  if (window.innerWidth < 768) {
    bsOffcanvas.show();
  }
});

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

// Initialize order management when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeOrderManagement);

// Global functions accessible from HTML
function acceptOrder(button) {
  changeCardStatus(button, 'preparing');
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

function changeCardStatus(button, newStatus) {
  const card = button.closest('.card');
  const select = card.querySelector('.status-selector');
  const actionButtons = card.querySelector('.action-buttons');

  card.setAttribute('data-status', newStatus);
  
  if (select) select.value = newStatus;

  if (actionButtons) {
    actionButtons.style.display = (newStatus === 'preparing') ? 'flex' : 'none';
  }

  updateOrderStatusInStorage(card, newStatus);

  if (newStatus === 'completed') {
    card.classList.add('border-success');
    const badge = document.createElement('span');
    badge.className = 'badge bg-success ms-2';
    badge.textContent = 'Completed';
    card.querySelector('h5').appendChild(badge);
    
    const controls = card.querySelector('.d-flex.justify-content-end');
    if (controls) controls.remove();
  }
}

function updateOrderStatusInStorage(card, newStatus) {
  const orderIndex = card.dataset.orderIndex;
  const isCompleted = card.dataset.orderSource === 'completed';
  const storageKey = isCompleted ? 'completedOrders' : 'orderData';
  
  try {
    const orders = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (orders[orderIndex]) {
      orders[orderIndex].status = newStatus;
      localStorage.setItem(storageKey, JSON.stringify(orders));
      
      if (newStatus === 'completed') {
        moveToCompletedOrders(orderIndex);
      }
    }
  } catch (e) {
    console.error("Error updating order status:", e);
  }
}

function moveToCompletedOrders(index) {
  try {
    const activeOrders = JSON.parse(localStorage.getItem('orderData')) || [];
    const completedOrders = JSON.parse(localStorage.getItem('completedOrders')) || [];
    
    if (activeOrders[index]) {
      completedOrders.push(activeOrders[index]);
      activeOrders.splice(index, 1);
      
      localStorage.setItem('orderData', JSON.stringify(activeOrders));
      localStorage.setItem('completedOrders', JSON.stringify(completedOrders));
    }
  } catch (e) {
    console.error("Error moving order to completed:", e);
  }
}

// Order management initialization
function initializeOrderManagement() {
  const getLocalStorageData = (key) => {
    try {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : [];
    } catch (e) {
      console.error(`Error parsing ${key}:`, e);
      return [];
    }
  };

  const orderData = getLocalStorageData('orderData');
  const completedOrders = getLocalStorageData('completedOrders');
  const allOrders = [...orderData, ...completedOrders].filter(order =>
    order.items && Array.isArray(order.items) && order.items.length > 0
  );

  const display = document.getElementById('orderCardsContainer');
  if (!display) {
    console.error("Display container not found");
    return;
  }

  if (allOrders.length === 0) {
    display.innerHTML = '<div class="alert alert-info">No orders found</div>';
    return;
  }

  display.innerHTML = allOrders.map((order, index) => {
    const orderTime = order.timestamp
      ? new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '--:--';

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
           data-status="${order.status || 'pending'}" 
           data-order-index="${index}" 
           data-order-source="${isCompleted ? 'completed' : 'active'}">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h5 class="mb-0 fs-6 fs-sm-5 d-inline">Order #${index + 1}</h5>
            ${isCompleted ? '<span class="badge bg-success ms-2">Completed</span>' : ''}
          </div>
          <small class="text-muted">${orderTime}</small>
        </div>
        
        <div class="order-items mb-3">
          ${itemsHtml}
        </div>
        
        <div class="d-flex justify-content-between align-items-center border-top pt-2">
          <div>
            <strong class="fs-6">Total:</strong>
            <small class="text-muted d-block">${order.paymentMode || 'Cash'} payment</small>
          </div>
          <h5 class="mb-0 fs-6 fs-sm-5">₱${order.total || '0.00'}</h5>
        </div>
        
        ${!isCompleted ? `
        <div class="d-flex justify-content-end gap-2 mt-3">
          <div class="status-selector-container">
            <select class="form-select status-selector icon-select">
              <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>🟡 Pending</option>
              <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>🟠 Preparing</option>
              <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>🟢 Ready</option>
              <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>✅ Completed</option>
            </select>
          </div>
          
          <div class="action-buttons d-flex gap-2" style="display: ${order.status === 'preparing' ? 'flex' : 'none'}">
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
        ` : ''}
      </div>
    `;
  }).join('');

  // Initialize event listeners
  document.querySelectorAll('.status-selector').forEach(select => {
    select.addEventListener('change', function() {
      changeCardStatus(this, this.value);
    });
  });

  document.querySelectorAll('.categorybtn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.categorybtn').forEach(b => {
        b.classList.remove('categorybtn-active');
      });
      this.classList.add('categorybtn-active');
      
      const selectedCategory = this.getAttribute('data-category');
      
      document.querySelectorAll('.card[data-status]').forEach(card => {
        const cardStatus = card.getAttribute('data-status');
        card.style.display = (selectedCategory === 'all' || cardStatus === selectedCategory) 
          ? 'block' 
          : 'none';
      });
    });
  });
}
