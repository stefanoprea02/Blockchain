// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

import "./PropertyManager.sol";
import "./PriceConverter.sol";

contract RentalManager {
    using PriceConverter for uint256;
    AggregatorV3Interface private s_priceFeed;

    struct Rental {
        address owner;
        address tenant;
        uint256 propertyId;
        uint256 startDate;
        uint256 duration;
        uint256 totalPrice;
        bool isActive;
        bool isWaitingConfirmation;
    }

    mapping(uint256 => Rental) public rentals;
    uint256 public rentalCount;

    modifier onlyPropertyOwner(uint256 _rentalId) {
        require(rentals[_rentalId].owner == msg.sender, "Only property owner can perform this action");
        _;
    }

    modifier waitingConfirmation(uint256 _rentalId) {
        require(rentals[_rentalId].isWaitingConfirmation, "Rental is not waiting for confirmation");
        _;
    }

    PropertyManager public propertyManager;

    event RentalCreated(uint256 indexed id, address indexed tenant, uint256 propertyId, uint256 startDate, uint256 duration, uint256 totalPrice);
    event RentalCompleted(uint256 indexed id, address indexed tenant, uint256 propertyId, uint256 endDate);

    constructor(address _propertyManagerAddress, address priceFeed) {
        propertyManager = PropertyManager(_propertyManagerAddress);
        s_priceFeed = AggregatorV3Interface(priceFeed);
    }

    function rentProperty(uint256 _propertyId, uint256 _duration) external payable {
        (address owner, uint256 pricePerDay, bool isAvailable) = propertyManager.getProperty(_propertyId);
        require(isAvailable, "Property not available for rent");
        require(msg.value >= pricePerDay * 10**18 * _duration, "Insufficient funds sent");
        uint256 totalPrice = pricePerDay * _duration;

        rentals[rentalCount] = Rental(owner, msg.sender, _propertyId, block.timestamp, _duration, totalPrice, false, true);
        rentalCount++;

        payable(owner).transfer(totalPrice);

        emit RentalCreated(rentalCount, msg.sender, _propertyId, block.timestamp, _duration, totalPrice);
    }

    function confirmPropertyRent(uint256 _rentalId) external onlyPropertyOwner(_rentalId) waitingConfirmation(_rentalId) {
        propertyManager.updatePropertyAvailability(_rentalId, false);
        rentals[_rentalId].isWaitingConfirmation = false;
    }

    function rejectPropertyRent(uint256 _rentalId) external onlyPropertyOwner(_rentalId) waitingConfirmation(_rentalId) {
        rentals[_rentalId].isWaitingConfirmation = false;
    }

    function completeRental(uint256 _rentalId) external onlyPropertyOwner(_rentalId) {
        Rental storage rental = rentals[_rentalId];
        require(rental.isActive, "Rental already completed");

        uint256 endDate = rental.startDate + rental.duration * 1 days;
        require(block.timestamp >= endDate, "Rental duration not completed yet");

        rental.isActive = false;
        propertyManager.updatePropertyAvailability(rental.propertyId, true);

        emit RentalCompleted(_rentalId, rental.tenant, rental.propertyId, block.timestamp);
    }

    function getRental(uint256 _rentalId) external view returns (
        address tenant,
        uint256 propertyId,
        uint256 startDate,
        uint256 duration,
        uint256 totalPrice,
        bool isActive
    ) {
        Rental storage rental = rentals[_rentalId];
        return (
            rental.tenant,
            rental.propertyId,
            rental.startDate,
            rental.duration,
            rental.totalPrice,
            rental.isActive
        );
    }

    function calculateTotalPrice(uint256 _pricePerDay, uint256 _duration) public view returns (uint256 _totalEth, uint256 _totalUsd) {
        uint256 totalEth = _pricePerDay * _duration;
        uint256 totalUsd = PriceConverter.getUsdAmount(totalEth, s_priceFeed);
        return (totalEth, totalUsd);
    }
}


