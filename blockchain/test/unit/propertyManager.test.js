const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("PropertyManager", function () {
  let propertyManager;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    await deployments.fixture(["all"])

    propertyManager = await ethers.getContract("PropertyManager");
  });

  it("should list a property", async function () {
    await propertyManager.connect(owner).listProperty(1000);
    const property = await propertyManager.getProperty(0);

    expect(property.owner).to.equal(owner.address);
    expect(property.pricePerDay.toString()).to.be.equal(ethers.BigNumber.from(1000).toString());
    expect(property.isAvailable).to.equal(true);
  });

  it("should update property availability", async function () {
    await propertyManager.connect(owner).listProperty(1000);
    await propertyManager.connect(owner).updatePropertyAvailability(0, false);

    const property = await propertyManager.getProperty(0);
    expect(property.isAvailable).to.equal(false);
  });

  it("should revert if non-owner tries to update availability", async function () {
    await propertyManager.connect(owner).listProperty(1000);
    await expect(
      propertyManager.connect(addr1).updatePropertyAvailability(0, false)
    ).to.be.revertedWith("Only property owner can perform this action");
  });
});
