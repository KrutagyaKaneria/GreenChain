// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./GreenHydrogenCredit.sol";

/**
 * @title CreditMarketplace
 * @dev Marketplace for trading Green Hydrogen Credits
 */
contract CreditMarketplace is ReentrancyGuard, Pausable, AccessControl {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // Marketplace fee (in basis points, 100 = 1%)
    uint256 public marketplaceFee = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    // Listing structure
    struct Listing {
        uint256 listingId;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
        uint256 listingTimestamp;
        uint256 expiryTimestamp;
    }

    // Purchase structure
    struct Purchase {
        uint256 purchaseId;
        uint256 listingId;
        uint256 tokenId;
        address buyer;
        address seller;
        uint256 price;
        uint256 purchaseTimestamp;
    }

    // Counters
    Counters.Counter private _listingIds;
    Counters.Counter private _purchaseIds;

    // Mappings
    mapping(uint256 => Listing) public listings;
    mapping(uint256 => Purchase) public purchases;
    mapping(uint256 => bool) public listingExists;

    // Reference to the credit contract
    GreenHydrogenCredit public creditContract;

    // Events
    event ListingCreated(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price,
        uint256 expiryTimestamp
    );

    event ListingUpdated(
        uint256 indexed listingId,
        uint256 newPrice,
        uint256 newExpiryTimestamp
    );

    event ListingCancelled(uint256 indexed listingId, address indexed seller);

    event ListingExpired(uint256 indexed listingId);

    event CreditPurchased(
        uint256 indexed purchaseId,
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address buyer,
        address seller,
        uint256 price
    );

    event MarketplaceFeeUpdated(uint256 oldFee, uint256 newFee);

    // Modifiers
    modifier onlyAdmin() {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not admin");
        _;
    }

    modifier onlyOperator() {
        require(hasRole(OPERATOR_ROLE, msg.sender), "Caller is not operator");
        _;
    }

    modifier listingExists(uint256 listingId) {
        require(listingExists[listingId], "Listing does not exist");
        _;
    }

    modifier listingActive(uint256 listingId) {
        require(listings[listingId].active, "Listing is not active");
        require(block.timestamp < listings[listingId].expiryTimestamp, "Listing has expired");
        _;
    }

    modifier onlySeller(uint256 listingId) {
        require(listings[listingId].seller == msg.sender, "Only seller can perform this action");
        _;
    }

    /**
     * @dev Constructor
     * @param _creditContract Address of the GreenHydrogenCredit contract
     */
    constructor(address _creditContract) {
        require(_creditContract != address(0), "Invalid credit contract address");
        creditContract = GreenHydrogenCredit(_creditContract);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
    }

    /**
     * @dev Create a new listing
     * @param tokenId ID of the credit to list
     * @param price Price in wei
     * @param expiryDays Number of days until listing expires
     */
    function createListing(
        uint256 tokenId,
        uint256 price,
        uint256 expiryDays
    ) external whenNotPaused nonReentrant {
        require(price > 0, "Price must be greater than 0");
        require(expiryDays > 0 && expiryDays <= 365, "Invalid expiry days");
        require(creditContract.ownerOf(tokenId) == msg.sender, "Not the owner of the credit");
        require(!creditContract.creditData(tokenId).retired, "Cannot list retired credit");
        require(creditContract.creditData(tokenId).verified, "Can only list verified credits");

        // Transfer credit to marketplace (escrow)
        creditContract.transferFrom(msg.sender, address(this), tokenId);

        _listingIds.increment();
        uint256 listingId = _listingIds.current();

        Listing memory newListing = Listing({
            listingId: listingId,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            active: true,
            listingTimestamp: block.timestamp,
            expiryTimestamp: block.timestamp + (expiryDays * 1 days)
        });

        listings[listingId] = newListing;
        listingExists[listingId] = true;

        emit ListingCreated(listingId, tokenId, msg.sender, price, newListing.expiryTimestamp);
    }

    /**
     * @dev Update listing price and expiry
     * @param listingId ID of the listing to update
     * @param newPrice New price in wei
     * @param newExpiryDays New expiry days
     */
    function updateListing(
        uint256 listingId,
        uint256 newPrice,
        uint256 newExpiryDays
    ) external listingExists(listingId) listingActive(listingId) onlySeller(listingId) {
        require(newPrice > 0, "Price must be greater than 0");
        require(newExpiryDays > 0 && newExpiryDays <= 365, "Invalid expiry days");

        Listing storage listing = listings[listingId];
        listing.price = newPrice;
        listing.expiryTimestamp = block.timestamp + (newExpiryDays * 1 days);

        emit ListingUpdated(listingId, newPrice, listing.expiryTimestamp);
    }

    /**
     * @dev Cancel a listing
     * @param listingId ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external listingExists(listingId) onlySeller(listingId) {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing is already inactive");

        listing.active = false;

        // Return credit to seller
        creditContract.transferCredit(address(this), listing.seller, listing.tokenId);

        emit ListingCancelled(listingId, listing.seller);
    }

    /**
     * @dev Purchase a credit
     * @param listingId ID of the listing to purchase
     */
    function purchaseCredit(uint256 listingId) external payable listingExists(listingId) listingActive(listingId) nonReentrant {
        Listing storage listing = listings[listingId];
        require(msg.sender != listing.seller, "Seller cannot buy their own listing");
        require(msg.value == listing.price, "Incorrect payment amount");

        // Calculate fees
        uint256 feeAmount = (listing.price * marketplaceFee) / FEE_DENOMINATOR;
        uint256 sellerAmount = listing.price - feeAmount;

        // Mark listing as inactive
        listing.active = false;

        // Transfer credit to buyer
        creditContract.transferCredit(address(this), msg.sender, listing.tokenId);

        // Transfer payment to seller
        payable(listing.seller).transfer(sellerAmount);

        // Keep fee in contract (can be withdrawn by admin)

        // Record purchase
        _purchaseIds.increment();
        uint256 purchaseId = _purchaseIds.current();

        Purchase memory newPurchase = Purchase({
            purchaseId: purchaseId,
            listingId: listingId,
            tokenId: listing.tokenId,
            buyer: msg.sender,
            seller: listing.seller,
            price: listing.price,
            purchaseTimestamp: block.timestamp
        });

        purchases[purchaseId] = newPurchase;

        emit CreditPurchased(purchaseId, listingId, listing.tokenId, msg.sender, listing.seller, listing.price);
    }

    /**
     * @dev Get listing details
     * @param listingId ID of the listing
     * @return Listing struct
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        require(listingExists[listingId], "Listing does not exist");
        return listings[listingId];
    }

    /**
     * @dev Get purchase details
     * @param purchaseId ID of the purchase
     * @return Purchase struct
     */
    function getPurchase(uint256 purchaseId) external view returns (Purchase memory) {
        require(purchaseId > 0 && purchaseId <= _purchaseIds.current(), "Purchase does not exist");
        return purchases[purchaseId];
    }

    /**
     * @dev Get all active listings
     * @return Array of listing IDs
     */
    function getActiveListings() external view returns (uint256[] memory) {
        uint256 totalListings = _listingIds.current();
        uint256[] memory temp = new uint256[](totalListings);
        uint256 count = 0;

        for (uint256 i = 1; i <= totalListings; i++) {
            if (listings[i].active && block.timestamp < listings[i].expiryTimestamp) {
                temp[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    /**
     * @dev Get listings by seller
     * @param seller Address of the seller
     * @return Array of listing IDs
     */
    function getListingsBySeller(address seller) external view returns (uint256[] memory) {
        uint256 totalListings = _listingIds.current();
        uint256[] memory temp = new uint256[](totalListings);
        uint256 count = 0;

        for (uint256 i = 1; i <= totalListings; i++) {
            if (listings[i].seller == seller && listings[i].active) {
                temp[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    /**
     * @dev Get purchases by buyer
     * @param buyer Address of the buyer
     * @return Array of purchase IDs
     */
    function getPurchasesByBuyer(address buyer) external view returns (uint256[] memory) {
        uint256 totalPurchases = _purchaseIds.current();
        uint256[] memory temp = new uint256[](totalPurchases);
        uint256 count = 0;

        for (uint256 i = 1; i <= totalPurchases; i++) {
            if (purchases[i].buyer == buyer) {
                temp[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    /**
     * @dev Update marketplace fee
     * @param newFee New fee in basis points
     */
    function updateMarketplaceFee(uint256 newFee) external onlyAdmin {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        uint256 oldFee = marketplaceFee;
        marketplaceFee = newFee;
        emit MarketplaceFeeUpdated(oldFee, newFee);
    }

    /**
     * @dev Withdraw accumulated fees
     * @param amount Amount to withdraw
     * @param recipient Address to receive the fees
     */
    function withdrawFees(uint256 amount, address payable recipient) external onlyAdmin {
        require(amount <= address(this).balance, "Insufficient balance");
        require(recipient != address(0), "Invalid recipient");
        recipient.transfer(amount);
    }

    /**
     * @dev Pause marketplace
     */
    function pause() external onlyAdmin {
        _pause();
    }

    /**
     * @dev Unpause marketplace
     */
    function unpause() external onlyAdmin {
        _unpause();
    }

    /**
     * @dev Get total number of listings
     * @return Total count
     */
    function getTotalListings() external view returns (uint256) {
        return _listingIds.current();
    }

    /**
     * @dev Get total number of purchases
     * @return Total count
     */
    function getTotalPurchases() external view returns (uint256) {
        return _purchaseIds.current();
    }

    /**
     * @dev Get contract balance
     * @return Balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Emergency functions
    /**
     * @dev Emergency function to return credits to sellers if needed
     * @param listingId ID of the listing
     */
    function emergencyReturnCredit(uint256 listingId) external onlyOperator {
        require(listingExists[listingId], "Listing does not exist");
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing is not active");

        listing.active = false;
        creditContract.transferCredit(address(this), listing.seller, listing.tokenId);
    }

    // Receive function to accept ETH
    receive() external payable {
        // Allow contract to receive ETH
    }
}
