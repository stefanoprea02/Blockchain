const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("RentalManager", function () {
  let rentalManager, propertyManager, priceFeedMock;
  let owner, tenant;

  before(async function () {
    [owner, tenant] = await ethers.getSigners();

    deployer = (await getNamedAccounts()).deployer
    await deployments.fixture(["all"])

    propertyManager = await ethers.getContract("PropertyManager");
    priceFeedMock = await ethers.getContract(
      "MockV3Aggregator",
      deployer
    )
    rentalManager = await ethers.getContract("RentalManager");
  });

  it("should allow renting a property", async function () {
    const initialBalanceOwner = await ethers.provider.getBalance(owner.address);
    const initialBalanceRenter = await ethers.provider.getBalance(tenant.address);
  
    await propertyManager.connect(owner).listProperty(1);
  
    const propertyId = 0;
    const duration = 1;
    const pricePerDay = 1;
    const totalPrice = pricePerDay * duration * 10^18;

    const tx = await rentalManager.connect(tenant).rentProperty(propertyId, duration, { value: totalPrice });
  
    await expect(tx).to.emit(rentalManager, "RentalCreated").withArgs(0, owner.address, tenant.address, propertyId, ethers.BigNumber.from(tx.timestamp), duration, totalPrice);
  
    const rental = await rentalManager.getRental(0);
    expect(rental.owner).to.equal(owner.address);
    expect(rental.renter).to.equal(tenant.address);
    expect(rental.propertyId).to.equal(propertyId);
    expect(rental.duration).to.equal(duration);
    expect(rental.totalPrice).to.equal(totalPrice);
    expect(rental.completed).to.equal(false);
    expect(rental.active).to.equal(true);
  
    const finalBalanceOwner = await ethers.provider.getBalance(owner.address);
    const finalBalanceRenter = await ethers.provider.getBalance(tenant.address);
  
    expect(finalBalanceOwner).to.equal(initialBalanceOwner.add(totalPrice), "Owner balance should increase by rental amount");
    expect(finalBalanceRenter).to.equal(initialBalanceRenter.sub(totalPrice), "Renter balance should decrease by rental amount");
  });
  
  it("should revert if non-owner tries to complete the rental", async function () {
    await expect(
      rentalManager.connect(tenant).completeRental(0)
    ).to.be.revertedWith("Only property owner can perform this action");
  });
});
