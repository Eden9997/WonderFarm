// Hệ thống xã hội - Bạn bè, Quà tặng và Chợ trao đổi
import { gameState } from './gameState.js';
import { showGameMessage } from './uiSystem.js';

// Dữ liệu mẫu cho bạn bè, quà tặng và mặt hàng chợ
const mockFriends = [
    { id: 1, name: "Anna", level: 15, lastActive: "Hôm nay", avatar: "img/Character/Character_base.png", online: true },
    { id: 2, name: "Tom", level: 8, lastActive: "2 giờ trước", avatar: "img/Character/Character_base.png", online: true },
    { id: 3, name: "Linda", level: 22, lastActive: "Vừa mới", avatar: "img/Character/Character_base.png", online: true },
    { id: 4, name: "Mike", level: 5, lastActive: "2 ngày trước", avatar: "img/Character/Character_base.png", online: false },
    { id: 5, name: "Sarah", level: 18, lastActive: "1 tuần trước", avatar: "img/Character/Character_base.png", online: false }
];

const mockGifts = {
    sent: [
        { id: 1, type: "seed", name: "Hạt giống táo", receiverId: 2, receiverName: "Tom", sentTime: "Hôm nay" },
        { id: 2, type: "fertilizer", name: "Phân bón cao cấp", receiverId: 3, receiverName: "Linda", sentTime: "Hôm qua" }
    ],
    received: [
        { id: 3, type: "water", name: "Nước ma thuật", senderId: 1, senderName: "Anna", sentTime: "Hôm nay", claimed: false },
        { id: 4, type: "seed", name: "Hạt giống dưa hấu", senderId: 3, senderName: "Linda", sentTime: "2 ngày trước", claimed: true }
    ]
};

const mockMarketItems = [
    { id: 1, type: "seed", name: "Hạt giống dưa hấu", price: 50, quantity: 10, sellerId: 2, sellerName: "Tom", listedTime: "30 phút trước" },
    { id: 2, type: "fertilizer", name: "Phân bón cao cấp", price: 100, quantity: 5, sellerId: 1, sellerName: "Anna", listedTime: "2 giờ trước" },
    { id: 3, type: "water", name: "Nước ma thuật", price: 75, quantity: 8, sellerId: 3, sellerName: "Linda", listedTime: "1 ngày trước" }
];

const playerInventory = [
    { id: 1, type: "seed", name: "Hạt giống dâu tây", quantity: 15 },
    { id: 2, type: "seed", name: "Hạt giống bí ngô", quantity: 8 },
    { id: 3, type: "fertilizer", name: "Phân bón thường", quantity: 20 },
    { id: 4, type: "fertilizer", name: "Phân bón cao cấp", quantity: 5 },
    { id: 5, type: "water", name: "Nước ma thuật", quantity: 12 }
];

// Khởi tạo hệ thống xã hội
export function initSocialSystem() {
    console.log('Initializing social system...');
    
    // Tạo HTML cho các panel xã hội
    createSocialPanelsHTML();
    
    // Thiết lập sự kiện cho các panel
    setupSocialPanelEvents();
    
    // Lắng nghe các sự kiện kết nối từ máy chủ (mô phỏng)
    setupMockNotifications();
}

// Tạo HTML cho các panel xã hội
function createSocialPanelsHTML() {
    const socialPanelsHTML = `
        <!-- Panel bạn bè -->
        <div id="friends-panel" class="game-panel hidden">
            <div class="panel-header">
                <h2>Bạn bè</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="panel-content friends-content">
                <div class="friends-filter">
                    <input type="text" placeholder="Tìm kiếm bạn bè..." id="friends-search">
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all">Tất cả</button>
                        <button class="filter-btn" data-filter="online">Đang online</button>
                        <button class="filter-btn" data-filter="recent">Hoạt động gần đây</button>
                    </div>
                </div>
                
                <div class="friends-list">
                    <!-- Danh sách bạn bè sẽ được thêm vào đây -->
                </div>
                
                <div class="friends-actions">
                    <button class="primary-btn" id="add-friend-btn">+ Thêm bạn mới</button>
                </div>
            </div>
        </div>
        
        <!-- Panel quà tặng -->
        <div id="gifts-panel" class="game-panel hidden">
            <div class="panel-header">
                <h2>Quà tặng</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="panel-content gifts-content">
                <div class="gifts-tabs">
                    <div class="gift-tab active" data-tab="send-gift">Gửi quà</div>
                    <div class="gift-tab" data-tab="received-gift">Quà nhận được</div>
                </div>
                
                <div class="gift-tab-content active" id="send-gift">
                    <div class="gift-selection">
                        <div class="gift-type selected" data-gift="seed">
                            <div class="gift-icon">🌱</div>
                            <div class="gift-name">Hạt giống</div>
                        </div>
                        <div class="gift-type" data-gift="water">
                            <div class="gift-icon">💧</div>
                            <div class="gift-name">Nước</div>
                        </div>
                        <div class="gift-type" data-gift="fertilizer">
                            <div class="gift-icon">🧪</div>
                            <div class="gift-name">Phân bón</div>
                        </div>
                    </div>
                    
                    <h3>Chọn người nhận</h3>
                    <div class="gift-recipients">
                        <!-- Danh sách người nhận sẽ được thêm vào đây -->
                    </div>
                </div>
                
                <div class="gift-tab-content" id="received-gift">
                    <div class="gifts-received">
                        <!-- Danh sách quà nhận được sẽ được thêm vào đây -->
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Panel chợ trao đổi -->
        <div id="market-panel" class="game-panel hidden">
            <div class="panel-header">
                <h2>Chợ trao đổi</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="panel-content market-content">
                <div class="market-tabs">
                    <div class="market-tab active" data-tab="browse-market">Mua sắm</div>
                    <div class="market-tab" data-tab="my-listings">Mặt hàng của tôi</div>
                    <div class="market-tab" data-tab="sell-items">Bán hàng</div>
                </div>
                
                <div class="market-tab-content active" id="browse-market">
                    <div class="market-search">
                        <input type="text" placeholder="Tìm kiếm mặt hàng..." id="market-search">
                        <select id="market-filter">
                            <option value="all">Tất cả</option>
                            <option value="seed">Hạt giống</option>
                            <option value="fertilizer">Phân bón</option>
                            <option value="water">Nước</option>
                        </select>
                    </div>
                    
                    <div class="market-items">
                        <!-- Danh sách mặt hàng sẽ được thêm vào đây -->
                    </div>
                </div>
                
                <div class="market-tab-content" id="my-listings">
                    <div class="my-market-items">
                        <!-- Danh sách mặt hàng của người chơi sẽ được thêm vào đây -->
                        <div class="empty-message">Bạn chưa có mặt hàng nào đang bán</div>
                    </div>
                </div>
                
                <div class="market-tab-content" id="sell-items">
                    <h3>Chọn vật phẩm để bán</h3>
                    <div class="inventory-grid">
                        <!-- Danh sách vật phẩm trong kho sẽ được thêm vào đây -->
                    </div>
                    
                    <div class="listing-form">
                        <div class="form-group">
                            <label>Số lượng:</label>
                            <input type="number" id="sell-quantity" min="1" value="1">
                        </div>
                        <div class="form-group">
                            <label>Giá bán:</label>
                            <div class="price-input">
                                <input type="number" id="sell-price" min="1" value="10">
                                <div class="coin-icon">🪙</div>
                            </div>
                        </div>
                        <button class="primary-btn" id="list-item-btn" disabled>Đăng bán</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Thêm các panel vào body
    document.body.insertAdjacentHTML('beforeend', socialPanelsHTML);
}

// Thiết lập sự kiện cho các panel
function setupSocialPanelEvents() {
    // Sự kiện cho các nút đóng panel
    document.querySelectorAll('.close-btn').forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.closest('.game-panel');
            if (panel) {
                panel.classList.add('hidden');
            }
        });
    });
    
    // =========== Sự kiện cho panel bạn bè ===========
    // Tải danh sách bạn bè
    loadFriendsList(mockFriends);
    
    // Sự kiện tìm kiếm bạn bè
    const friendsSearch = document.getElementById('friends-search');
    if (friendsSearch) {
        friendsSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const filteredFriends = mockFriends.filter(friend => 
                friend.name.toLowerCase().includes(searchTerm)
            );
            loadFriendsList(filteredFriends);
        });
    }
    
    // Sự kiện cho các nút lọc bạn bè
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Bỏ trạng thái active của tất cả các nút
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Thêm trạng thái active cho nút được nhấp
            this.classList.add('active');
            
            // Lọc bạn bè dựa trên bộ lọc
            const filter = this.getAttribute('data-filter');
            let filteredFriends;
            
            switch (filter) {
                case 'online':
                    filteredFriends = mockFriends.filter(friend => friend.online);
                    break;
                case 'recent':
                    filteredFriends = mockFriends.filter(friend => 
                        friend.lastActive.includes('Hôm nay') || 
                        friend.lastActive.includes('Vừa mới') || 
                        friend.lastActive.includes('giờ') || 
                        friend.lastActive.includes('phút')
                    );
                    break;
                default:
                    filteredFriends = [...mockFriends];
            }
            
            // Hiển thị bạn bè đã được lọc
            loadFriendsList(filteredFriends);
        });
    });
    
    // Sự kiện cho nút thêm bạn mới
    const addFriendBtn = document.getElementById('add-friend-btn');
    if (addFriendBtn) {
        addFriendBtn.addEventListener('click', function() {
            showGameMessage('Tính năng thêm bạn sẽ sớm được cập nhật!');
        });
    }
    
    // =========== Sự kiện cho panel quà tặng ===========
    // Sự kiện chuyển tab quà tặng
    document.querySelectorAll('.gift-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Bỏ active tất cả các tab
            document.querySelectorAll('.gift-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Bỏ active tất cả các tab content
            document.querySelectorAll('.gift-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Thêm active cho tab được chọn
            this.classList.add('active');
            
            // Hiển thị tab content tương ứng
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Tải dữ liệu cho tab
            if (tabId === 'send-gift') {
                loadGiftRecipients();
            } else if (tabId === 'received-gift') {
                loadReceivedGifts();
            }
        });
    });
    
    // Sự kiện chọn loại quà tặng
    document.querySelectorAll('.gift-type').forEach(type => {
        type.addEventListener('click', function() {
            // Bỏ selected tất cả các loại quà
            document.querySelectorAll('.gift-type').forEach(t => {
                t.classList.remove('selected');
            });
            
            // Thêm selected cho loại quà được chọn
            this.classList.add('selected');
            
            // Cập nhật danh sách người nhận dựa trên quà được chọn
            loadGiftRecipients();
        });
    });
    
    // Tải dữ liệu ban đầu cho panel quà tặng
    loadGiftRecipients();
    
    // =========== Sự kiện cho panel chợ trao đổi ===========
    // Sự kiện chuyển tab chợ
    document.querySelectorAll('.market-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Bỏ active tất cả các tab
            document.querySelectorAll('.market-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Bỏ active tất cả các tab content
            document.querySelectorAll('.market-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Thêm active cho tab được chọn
            this.classList.add('active');
            
            // Hiển thị tab content tương ứng
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Tải dữ liệu cho tab
            if (tabId === 'browse-market') {
                loadMarketItems(mockMarketItems);
            } else if (tabId === 'sell-items') {
                loadInventoryItems();
            }
        });
    });
    
    // Sự kiện tìm kiếm và lọc mặt hàng chợ
    const marketSearch = document.getElementById('market-search');
    const marketFilter = document.getElementById('market-filter');
    
    if (marketSearch && marketFilter) {
        const updateMarketItems = () => {
            const searchTerm = marketSearch.value.toLowerCase();
            const filterValue = marketFilter.value;
            
            const filteredItems = mockMarketItems.filter(item => {
                const matchesSearch = item.name.toLowerCase().includes(searchTerm);
                const matchesFilter = filterValue === 'all' || item.type === filterValue;
                
                return matchesSearch && matchesFilter;
            });
            
            loadMarketItems(filteredItems);
        };
        
        marketSearch.addEventListener('input', updateMarketItems);
        marketFilter.addEventListener('change', updateMarketItems);
    }
    
    // Tải dữ liệu ban đầu cho panel chợ
    loadMarketItems(mockMarketItems);
    loadInventoryItems();
}

// Tải danh sách bạn bè
function loadFriendsList(friends) {
    const friendsList = document.querySelector('.friends-list');
    if (!friendsList) return;
    
    // Xóa danh sách hiện tại
    friendsList.innerHTML = '';
    
    if (friends.length === 0) {
        friendsList.innerHTML = '<div class="empty-message">Không tìm thấy bạn bè</div>';
        return;
    }
    
    // Thêm từng bạn bè vào danh sách
    friends.forEach(friend => {
        const friendHTML = `
            <div class="friend-item" data-id="${friend.id}">
                <div class="friend-avatar">
                    <img src="${friend.avatar}" alt="${friend.name}">
                    <div class="status-dot ${friend.online ? 'online' : 'offline'}"></div>
                </div>
                <div class="friend-info">
                    <div class="friend-name">${friend.name}</div>
                    <div class="friend-level">Cấp ${friend.level}</div>
                    <div class="friend-last-active">${friend.online ? 'Đang online' : `Hoạt động: ${friend.lastActive}`}</div>
                </div>
                <div class="friend-actions">
                    <div class="action-btn" data-action="visit">
                        <div class="action-icon">🏡</div>
                        <div class="action-text">Thăm</div>
                    </div>
                    <div class="action-btn" data-action="gift">
                        <div class="action-icon">🎁</div>
                        <div class="action-text">Tặng</div>
                    </div>
                </div>
            </div>
        `;
        
        friendsList.insertAdjacentHTML('beforeend', friendHTML);
    });
    
    // Thiết lập sự kiện cho các nút hành động bạn bè
    friendsList.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const friendId = this.closest('.friend-item').getAttribute('data-id');
            const friend = friends.find(f => f.id === parseInt(friendId));
            
            if (action === 'visit') {
                showGameMessage(`Đang ghé thăm nông trại của ${friend.name}...`);
                // TODO: Thêm logic để ghé thăm nông trại bạn bè
            } else if (action === 'gift') {
                showGiftsPanel();
                // TODO: Chuyển trực tiếp đến tab gửi quà và chọn sẵn người bạn này
            }
        });
    });
}

// Tải danh sách người nhận quà
function loadGiftRecipients() {
    const recipientsContainer = document.querySelector('.gift-recipients');
    if (!recipientsContainer) return;
    
    // Xóa danh sách hiện tại
    recipientsContainer.innerHTML = '';
    
    // Thêm từng người nhận vào danh sách
    mockFriends.forEach(friend => {
        const recipientHTML = `
            <div class="gift-recipient" data-id="${friend.id}">
                <div class="recipient-avatar">
                    <img src="${friend.avatar}" alt="${friend.name}">
                </div>
                <div class="recipient-name">${friend.name}</div>
                <button class="send-gift-btn">Tặng quà</button>
            </div>
        `;
        
        recipientsContainer.insertAdjacentHTML('beforeend', recipientHTML);
    });
    
    // Thiết lập sự kiện cho các nút gửi quà
    recipientsContainer.querySelectorAll('.send-gift-btn').forEach(button => {
        button.addEventListener('click', function() {
            const recipientId = this.closest('.gift-recipient').getAttribute('data-id');
            const recipient = mockFriends.find(f => f.id === parseInt(recipientId));
            
            const selectedGift = document.querySelector('.gift-type.selected');
            const giftType = selectedGift ? selectedGift.getAttribute('data-gift') : null;
            
            if (recipient && giftType) {
                sendGift(recipient, giftType);
            }
        });
    });
}

// Tải danh sách quà đã nhận
function loadReceivedGifts() {
    const giftsContainer = document.querySelector('.gifts-received');
    if (!giftsContainer) return;
    
    // Xóa danh sách hiện tại
    giftsContainer.innerHTML = '';
    
    if (mockGifts.received.length === 0) {
        giftsContainer.innerHTML = '<div class="empty-message">Bạn chưa nhận được quà nào</div>';
        return;
    }
    
    // Thêm từng quà đã nhận vào danh sách
    mockGifts.received.forEach(gift => {
        const giftHTML = `
            <div class="gift-item ${gift.claimed ? 'claimed' : ''}" data-id="${gift.id}">
                <div class="gift-icon">${getGiftIcon(gift.type)}</div>
                <div class="gift-info">
                    <div class="gift-name">${gift.name}</div>
                    <div class="gift-sender">Từ: ${gift.senderName}</div>
                    <div class="gift-time">Nhận: ${gift.sentTime}</div>
                </div>
                <button class="claim-gift-btn" ${gift.claimed ? 'disabled' : ''}>
                    ${gift.claimed ? 'Đã nhận' : 'Nhận quà'}
                </button>
            </div>
        `;
        
        giftsContainer.insertAdjacentHTML('beforeend', giftHTML);
    });
    
    // Thiết lập sự kiện cho các nút nhận quà
    giftsContainer.querySelectorAll('.claim-gift-btn:not([disabled])').forEach(button => {
        button.addEventListener('click', function() {
            const giftId = this.closest('.gift-item').getAttribute('data-id');
            const gift = mockGifts.received.find(g => g.id === parseInt(giftId));
            
            if (gift) {
                claimGift(gift);
                
                // Cập nhật UI
                const giftItem = this.closest('.gift-item');
                giftItem.classList.add('claimed');
                this.disabled = true;
                this.textContent = 'Đã nhận';
            }
        });
    });
}

// Tải danh sách mặt hàng trong chợ
function loadMarketItems(items) {
    const marketItemsContainer = document.querySelector('.market-items');
    if (!marketItemsContainer) return;
    
    // Xóa danh sách hiện tại
    marketItemsContainer.innerHTML = '';
    
    if (items.length === 0) {
        marketItemsContainer.innerHTML = '<div class="empty-message">Không có mặt hàng nào</div>';
        return;
    }
    
    // Thêm từng mặt hàng vào danh sách
    items.forEach(item => {
        const itemHTML = `
            <div class="market-item" data-id="${item.id}">
                <div class="market-item-icon">${getGiftIcon(item.type)}</div>
                <div class="market-item-info">
                    <div class="market-item-name">${item.name}</div>
                    <div class="market-item-seller">Người bán: ${item.sellerName}</div>
                    <div class="market-item-time">Đăng: ${item.listedTime}</div>
                </div>
                <div class="market-item-details">
                    <div class="market-item-quantity">SL: ${item.quantity}</div>
                    <div class="market-item-price">
                        ${item.price} <span>🪙</span>
                    </div>
                    <button class="buy-item-btn">Mua</button>
                </div>
            </div>
        `;
        
        marketItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
    });
    
    // Thiết lập sự kiện cho các nút mua hàng
    marketItemsContainer.querySelectorAll('.buy-item-btn').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = this.closest('.market-item').getAttribute('data-id');
            const item = mockMarketItems.find(i => i.id === parseInt(itemId));
            
            if (item) {
                buyMarketItem(item);
            }
        });
    });
}

// Tải danh sách vật phẩm trong kho đồ
function loadInventoryItems() {
    const inventoryGrid = document.querySelector('.inventory-grid');
    if (!inventoryGrid) return;
    
    // Xóa danh sách hiện tại
    inventoryGrid.innerHTML = '';
    
    if (playerInventory.length === 0) {
        inventoryGrid.innerHTML = '<div class="empty-message">Kho đồ trống</div>';
        return;
    }
    
    // Thêm từng vật phẩm vào lưới
    playerInventory.forEach(item => {
        const itemHTML = `
            <div class="inventory-item" data-id="${item.id}">
                <div class="item-icon">${getGiftIcon(item.type)}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-quantity">Số lượng: ${item.quantity}</div>
            </div>
        `;
        
        inventoryGrid.insertAdjacentHTML('beforeend', itemHTML);
    });
    
    // Thiết lập sự kiện cho các vật phẩm trong kho
    inventoryGrid.querySelectorAll('.inventory-item').forEach(itemElement => {
        itemElement.addEventListener('click', function() {
            // Bỏ selected cho tất cả các item
            document.querySelectorAll('.inventory-item').forEach(item => {
                item.classList.remove('selected');
            });
            
            // Thêm selected cho item được chọn
            this.classList.add('selected');
            
            // Kích hoạt nút đăng bán
            const listItemBtn = document.getElementById('list-item-btn');
            if (listItemBtn) {
                listItemBtn.disabled = false;
            }
            
            // Thiết lập số lượng tối đa
            const itemId = this.getAttribute('data-id');
            const item = playerInventory.find(i => i.id === parseInt(itemId));
            
            const sellQuantity = document.getElementById('sell-quantity');
            if (sellQuantity && item) {
                sellQuantity.max = item.quantity;
            }
        });
    });
    
    // Thiết lập sự kiện cho nút đăng bán
    const listItemBtn = document.getElementById('list-item-btn');
    if (listItemBtn) {
        listItemBtn.addEventListener('click', function() {
            const selectedItem = document.querySelector('.inventory-item.selected');
            
            if (!selectedItem) {
                showGameMessage('Vui lòng chọn vật phẩm để bán!');
                return;
            }
            
            const itemId = selectedItem.getAttribute('data-id');
            const item = playerInventory.find(i => i.id === parseInt(itemId));
            
            const quantity = parseInt(document.getElementById('sell-quantity').value);
            const price = parseInt(document.getElementById('sell-price').value);
            
            if (item && quantity > 0 && quantity <= item.quantity && price > 0) {
                listItemForSale(item, quantity, price);
            } else {
                showGameMessage('Vui lòng nhập số lượng và giá hợp lệ!');
            }
        });
    }
}

// Gửi quà cho bạn bè
function sendGift(recipient, giftType) {
    // TODO: Gửi yêu cầu tới máy chủ để gửi quà
    
    // Mô phỏng: Thêm vào danh sách quà đã gửi
    const gift = {
        id: mockGifts.sent.length + mockGifts.received.length + 1,
        type: giftType,
        name: getGiftName(giftType),
        receiverId: recipient.id,
        receiverName: recipient.name,
        sentTime: "Hôm nay"
    };
    
    mockGifts.sent.push(gift);
    
    showGameMessage(`Đã gửi ${gift.name} cho ${recipient.name}!`);
}

// Nhận quà
function claimGift(gift) {
    // TODO: Gửi yêu cầu tới máy chủ để nhận quà
    
    // Mô phỏng: Đánh dấu quà đã được nhận
    gift.claimed = true;
    
    // Thêm vật phẩm vào kho đồ người chơi
    const inventoryItem = playerInventory.find(item => 
        item.type === gift.type && item.name === gift.name
    );
    
    if (inventoryItem) {
        inventoryItem.quantity += 1;
    } else {
        playerInventory.push({
            id: playerInventory.length + 1,
            type: gift.type,
            name: gift.name,
            quantity: 1
        });
    }
    
    showGameMessage(`Bạn đã nhận được ${gift.name} từ ${gift.senderName}!`);
}

// Mua mặt hàng từ chợ
function buyMarketItem(item) {
    // TODO: Gửi yêu cầu tới máy chủ để mua mặt hàng
    
    // Mô phỏng: Kiểm tra tiền của người chơi
    if ((gameState.money || 1250) < item.price) {
        showGameMessage('Không đủ tiền để mua vật phẩm này!');
        return;
    }
    
    // Trừ tiền
    gameState.money = (gameState.money || 1250) - item.price;
    
    // Thêm vật phẩm vào kho đồ
    const inventoryItem = playerInventory.find(i => 
        i.type === item.type && i.name === item.name
    );
    
    if (inventoryItem) {
        inventoryItem.quantity += 1;
    } else {
        playerInventory.push({
            id: playerInventory.length + 1,
            type: item.type,
            name: item.name,
            quantity: 1
        });
    }
    
    // Giảm số lượng mặt hàng trong chợ
    item.quantity -= 1;
    
    // Nếu số lượng bằng 0, xóa mặt hàng khỏi chợ
    if (item.quantity <= 0) {
        const itemIndex = mockMarketItems.findIndex(i => i.id === item.id);
        if (itemIndex !== -1) {
            mockMarketItems.splice(itemIndex, 1);
        }
    }
    
    showGameMessage(`Bạn đã mua ${item.name} với giá ${item.price} xu!`);
    
    // Cập nhật lại danh sách mặt hàng
    loadMarketItems(mockMarketItems);
}

// Đăng bán vật phẩm
function listItemForSale(item, quantity, price) {
    // TODO: Gửi yêu cầu tới máy chủ để đăng bán
    
    // Mô phỏng: Thêm vào danh sách mặt hàng
    const marketItem = {
        id: mockMarketItems.length + 1,
        type: item.type,
        name: item.name,
        price: price,
        quantity: quantity,
        sellerId: 0, // ID của người chơi
        sellerName: "Bạn",
        listedTime: "Vừa đăng"
    };
    
    mockMarketItems.push(marketItem);
    
    // Giảm số lượng trong kho đồ
    item.quantity -= quantity;
    
    // Nếu số lượng bằng 0, xóa khỏi kho đồ
    if (item.quantity <= 0) {
        const itemIndex = playerInventory.findIndex(i => i.id === item.id);
        if (itemIndex !== -1) {
            playerInventory.splice(itemIndex, 1);
        }
    }
    
    showGameMessage(`Đã đăng bán ${quantity} ${item.name} với giá ${price} xu/vật phẩm!`);
    
    // Cập nhật lại danh sách vật phẩm trong kho và thị trường
    loadInventoryItems();
    
    // Chuyển sang tab mua sắm
    document.querySelector('.market-tab[data-tab="browse-market"]').click();
}

// Lấy icon cho loại quà tặng
function getGiftIcon(type) {
    switch (type) {
        case 'seed':
            return '🌱';
        case 'water':
            return '💧';
        case 'fertilizer':
            return '🧪';
        default:
            return '🎁';
    }
}

// Lấy tên cho loại quà tặng
function getGiftName(type) {
    switch (type) {
        case 'seed':
            return 'Hạt giống';
        case 'water':
            return 'Nước ma thuật';
        case 'fertilizer':
            return 'Phân bón';
        default:
            return 'Quà tặng';
    }
}

// Thiết lập thông báo mô phỏng
function setupMockNotifications() {
    // Mô phỏng một số thông báo sau một khoảng thời gian
    setTimeout(() => {
        showGameMessage('Bạn nhận được một món quà từ Tom!');
        
        // Cập nhật badge trên nút quà tặng trong thanh công cụ
        const giftsBadge = document.querySelector('.toolbar-item[data-tool="gifts"] .tool-badge');
        if (giftsBadge) {
            giftsBadge.textContent = parseInt(giftsBadge.textContent) + 1;
            giftsBadge.classList.add('alert');
        }
    }, 60000); // 1 phút
    
    setTimeout(() => {
        showGameMessage('Anna đã thăm nông trại của bạn!');
    }, 120000); // 2 phút
}

// Hiển thị panel bạn bè
export function showFriendsPanel() {
    // Ẩn tất cả các panel khác
    document.querySelectorAll('.game-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    // Hiển thị panel bạn bè
    const friendsPanel = document.getElementById('friends-panel');
    if (friendsPanel) {
        friendsPanel.classList.remove('hidden');
        
        // Tải lại danh sách bạn bè
        loadFriendsList(mockFriends);
    }
}

// Hiển thị panel quà tặng
export function showGiftsPanel() {
    // Ẩn tất cả các panel khác
    document.querySelectorAll('.game-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    // Hiển thị panel quà tặng
    const giftsPanel = document.getElementById('gifts-panel');
    if (giftsPanel) {
        giftsPanel.classList.remove('hidden');
        
        // Tải lại dữ liệu quà tặng
        loadGiftRecipients();
        
        // Xóa badge trên nút quà tặng trong thanh công cụ
        const giftsBadge = document.querySelector('.toolbar-item[data-tool="gifts"] .tool-badge');
        if (giftsBadge) {
            giftsBadge.textContent = '0';
            giftsBadge.classList.remove('alert');
        }
    }
}

// Hiển thị panel chợ trao đổi
export function showMarketPanel() {
    // Ẩn tất cả các panel khác
    document.querySelectorAll('.game-panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    // Hiển thị panel chợ trao đổi
    const marketPanel = document.getElementById('market-panel');
    if (marketPanel) {
        marketPanel.classList.remove('hidden');
        
        // Tải lại dữ liệu chợ
        loadMarketItems(mockMarketItems);
    }
}