// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title GreenHydrogenCredit
 * @dev ERC-721 NFT contract for Green Hydrogen Credits
 * Each credit represents a verified amount of green hydrogen production
 */
contract GreenHydrogenCredit is ERC721, AccessControl, Pausable {
    using Counters for Counters.Counter;

    // Role definitions
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant REGULATOR_ROLE = keccak256("REGULATOR_ROLE");
    bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");

    // Token counter
    Counters.Counter private _tokenIds;

    // Credit data structure
    struct CreditData {
        uint256 hydrogenAmount;     // kg of H2 produced (scaled by 10^6)
        uint256 carbonIntensity;    // CO2/kg H2 (scaled by 10^3)
        uint256 productionTimestamp;
        address producer;
        bool verified;
        bool retired;
        string ipfsHash;           // IoT data reference
        string verificationNotes;  // Verifier notes
        uint256 verifiedAt;
        address verifier;
    }

    // Mapping from token ID to credit data
    mapping(uint256 => CreditData) public creditData;

    // Events
    event CreditIssued(
        uint256 indexed tokenId,
        address indexed producer,
        uint256 hydrogenAmount,
        uint256 carbonIntensity,
        string ipfsHash
    );

    event CreditVerified(
        uint256 indexed tokenId,
        address indexed verifier,
        string verificationNotes
    );

    event CreditRejected(
        uint256 indexed tokenId,
        address indexed verifier,
        string rejectionReason
    );

    event CreditRetired(
        uint256 indexed tokenId,
        address indexed owner,
        string retirementReason
    );

    event CreditTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to
    );

    // Modifiers
    modifier onlyProducer() {
        require(hasRole(PRODUCER_ROLE, msg.sender), "Caller is not a producer");
        _;
    }

    modifier onlyVerifier() {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Caller is not a verifier");
        _;
    }

    modifier onlyRegulator() {
        require(hasRole(REGULATOR_ROLE, msg.sender), "Caller is not a regulator");
        _;
    }

    modifier onlyMarketplace() {
        require(hasRole(MARKETPLACE_ROLE, msg.sender), "Caller is not marketplace");
        _;
    }

    modifier creditExists(uint256 tokenId) {
        require(_exists(tokenId), "Credit does not exist");
        _;
    }

    modifier notRetired(uint256 tokenId) {
        require(!creditData[tokenId].retired, "Credit is retired");
        _;
    }

    /**
     * @dev Constructor
     * @param name Token name
     * @param symbol Token symbol
     */
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PRODUCER_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(REGULATOR_ROLE, msg.sender);
    }

    /**
     * @dev Issue a new hydrogen credit
     * @param producer Address of the producer
     * @param hydrogenAmount Amount of hydrogen produced (in kg, scaled by 10^6)
     * @param carbonIntensity Carbon intensity (CO2/kg H2, scaled by 10^3)
     * @param ipfsHash IPFS hash of the IoT data
     * @return tokenId The ID of the newly minted token
     */
    function issueCredit(
        address producer,
        uint256 hydrogenAmount,
        uint256 carbonIntensity,
        string memory ipfsHash
    ) external onlyProducer whenNotPaused returns (uint256) {
        require(hydrogenAmount > 0, "Hydrogen amount must be greater than 0");
        require(carbonIntensity >= 0, "Carbon intensity cannot be negative");
        require(bytes(ipfsHash).length > 0, "IPFS hash cannot be empty");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        // Create credit data
        CreditData memory newCredit = CreditData({
            hydrogenAmount: hydrogenAmount,
            carbonIntensity: carbonIntensity,
            productionTimestamp: block.timestamp,
            producer: producer,
            verified: false,
            retired: false,
            ipfsHash: ipfsHash,
            verificationNotes: "",
            verifiedAt: 0,
            verifier: address(0)
        });

        creditData[newTokenId] = newCredit;

        // Mint NFT to producer
        _safeMint(producer, newTokenId);

        emit CreditIssued(newTokenId, producer, hydrogenAmount, carbonIntensity, ipfsHash);

        return newTokenId;
    }

    /**
     * @dev Verify a credit
     * @param tokenId ID of the credit to verify
     * @param verificationNotes Notes from the verifier
     */
    function verifyCredit(
        uint256 tokenId,
        string memory verificationNotes
    ) external onlyVerifier creditExists(tokenId) whenNotPaused {
        CreditData storage credit = creditData[tokenId];
        require(!credit.verified, "Credit is already verified");
        require(!credit.retired, "Cannot verify retired credit");

        credit.verified = true;
        credit.verificationNotes = verificationNotes;
        credit.verifiedAt = block.timestamp;
        credit.verifier = msg.sender;

        emit CreditVerified(tokenId, msg.sender, verificationNotes);
    }

    /**
     * @dev Reject a credit
     * @param tokenId ID of the credit to reject
     * @param rejectionReason Reason for rejection
     */
    function rejectCredit(
        uint256 tokenId,
        string memory rejectionReason
    ) external onlyVerifier creditExists(tokenId) whenNotPaused {
        CreditData storage credit = creditData[tokenId];
        require(!credit.verified, "Credit is already verified");
        require(!credit.retired, "Cannot reject retired credit");

        credit.verificationNotes = rejectionReason;
        credit.verifier = msg.sender;

        emit CreditRejected(tokenId, msg.sender, rejectionReason);
    }

    /**
     * @dev Retire a credit (mark as used for compliance)
     * @param tokenId ID of the credit to retire
     * @param retirementReason Reason for retirement
     */
    function retireCredit(
        uint256 tokenId,
        string memory retirementReason
    ) external creditExists(tokenId) notRetired(tokenId) whenNotPaused {
        require(ownerOf(tokenId) == msg.sender, "Only owner can retire credit");
        require(creditData[tokenId].verified, "Only verified credits can be retired");

        CreditData storage credit = creditData[tokenId];
        credit.retired = true;

        emit CreditRetired(tokenId, msg.sender, retirementReason);
    }

    /**
     * @dev Transfer credit (only marketplace can transfer)
     * @param from Current owner
     * @param to New owner
     * @param tokenId ID of the credit
     */
    function transferCredit(
        address from,
        address to,
        uint256 tokenId
    ) external onlyMarketplace creditExists(tokenId) notRetired(tokenId) {
        require(ownerOf(tokenId) == from, "Transfer from incorrect owner");
        require(to != address(0), "Transfer to zero address");

        _transfer(from, to, tokenId);

        emit CreditTransferred(tokenId, from, to);
    }

    /**
     * @dev Get credit data
     * @param tokenId ID of the credit
     * @return CreditData struct
     */
    function getCreditData(uint256 tokenId) external view returns (CreditData memory) {
        require(_exists(tokenId), "Credit does not exist");
        return creditData[tokenId];
    }

    /**
     * @dev Get total number of credits issued
     * @return Total count
     */
    function getTotalCredits() external view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Get credits by producer
     * @param producer Address of the producer
     * @return Array of token IDs
     */
    function getCreditsByProducer(address producer) external view returns (uint256[] memory) {
        uint256 totalCredits = _tokenIds.current();
        uint256[] memory temp = new uint256[](totalCredits);
        uint256 count = 0;

        for (uint256 i = 1; i <= totalCredits; i++) {
            if (creditData[i].producer == producer) {
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
     * @dev Get verified credits
     * @return Array of verified token IDs
     */
    function getVerifiedCredits() external view returns (uint256[] memory) {
        uint256 totalCredits = _tokenIds.current();
        uint256[] memory temp = new uint256[](totalCredits);
        uint256 count = 0;

        for (uint256 i = 1; i <= totalCredits; i++) {
            if (creditData[i].verified && !creditData[i].retired) {
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
     * @dev Pause contract (emergency stop)
     */
    function pause() external onlyRegulator {
        _pause();
    }

    /**
     * @dev Unpause contract
     */
    function unpause() external onlyRegulator {
        _unpause();
    }

    /**
     * @dev Grant role to address
     * @param role Role to grant
     * @param account Address to grant role to
     */
    function grantRole(bytes32 role, address account) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        super.grantRole(role, account);
    }

    /**
     * @dev Revoke role from address
     * @param role Role to revoke
     * @param account Address to revoke role from
     */
    function revokeRole(bytes32 role, address account) public override onlyRole(DEFAULT_ADMIN_ROLE) {
        super.revokeRole(role, account);
    }

    // Override required functions
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }
}
