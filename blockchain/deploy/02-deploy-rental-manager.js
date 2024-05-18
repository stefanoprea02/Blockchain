const { network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    const propertyManager = await deployments.get("PropertyManager")

    log("----------------------------------------------------")
    log("Deploying RentalManager and waiting for confirmations...")
    const rentalManager = await deploy("RentalManager", {
        from: deployer,
        args: [propertyManager.address, ethUsdPriceFeedAddress],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`RentalManager deployed at ${rentalManager.address}`)
}

module.exports.tags = ["all", "rentalManager"]