const { network } = require("hardhat")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("----------------------------------------------------")
    log("Deploying PropertyManager and waiting for confirmations...")
    const propertyManager = await deploy("PropertyManager", {
        from: deployer,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`PropertyManager deployed at ${propertyManager.address}`)
}

module.exports.tags = ["all", "propertyManager"]