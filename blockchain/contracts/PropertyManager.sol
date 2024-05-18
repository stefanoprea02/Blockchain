// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyManager {
    struct Property {
        address owner;
        uint256 pricePerDay;
        bool isAvailable;
    }

    mapping(uint256 => Property) public properties;
    uint256 public propertyCount;

    modifier onlyPropertyOwner(uint256 _propertyId) {
        require(properties[_propertyId].owner == msg.sender, "Only property owner can perform this action");
        _;
    }

    event PropertyListed(uint256 indexed id, address indexed owner, uint256 pricePerDay);
    event Debug(string message);

    function listProperty(uint256 _pricePerDay) external {
        require(_pricePerDay > 0, "Price per day must be greater than zero");

        properties[propertyCount] = Property({
            owner: msg.sender,
            pricePerDay: _pricePerDay,
            isAvailable: true
        });
        propertyCount++;

        emit PropertyListed(propertyCount, msg.sender, _pricePerDay);
    }

    function getProperty(uint256 _propertyId) external view returns (
        address owner,
        uint256 pricePerDay,
        bool isAvailable
    ) {
        Property storage property = properties[_propertyId];
        return (property.owner, property.pricePerDay, property.isAvailable);
    }

    function updatePropertyAvailability(uint256 _propertyId, bool _availability) external onlyPropertyOwner(_propertyId) {
        Property storage property = properties[_propertyId];
        require(property.owner == msg.sender, "Only property owner can update availability");
        property.isAvailable = _availability;
    }
}