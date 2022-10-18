const { developmentChains, VERIFICATION_BLOCK_CONFIRMATIONS } = require("../helper-hardhat-config")
const { network, deployments, deployer, ethers } = require("hardhat")
const { verify } = require("../helper-functions")

async function main() {
    // Upgrade!
    // Not "the hardhat-deploy way"
    const boxV2 = await ethers.getContract("BoxV2")
    const boxProxyAdmin = await ethers.getContract("BoxProxyAdmin")
    const transparentProxy = await ethers.getContract("Box_Proxy") //This is the way hardhat understands it
    const upgradeTx = await boxProxyAdmin.upgrade(transparentProxy.address, boxV2.address)
    //Upgrade function to the transparent, and it will upgrade the boxproxyadmin for us
    await upgradeTx.wait(1)
    const proxyBox = await ethers.getContractAt("BoxV2", transparentProxy.address)
    const version = await proxyBox.version()
    console.log(`Version ${version.toString()}`)
    console.log("----------------------------------------------------")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
