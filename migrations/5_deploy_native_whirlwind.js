/* global artifacts */
require('dotenv').config({ path: '../.env' })
const NativeWhirlwind = artifacts.require('NativeWhirlwind')
const Verifier = artifacts.require('Verifier')
const hasherContract = artifacts.require('Hasher')
const WIND = artifacts.require('WIND')


module.exports = function(deployer, network, accounts) {
  return deployer.then(async () => {
    const { MERKLE_TREE_HEIGHT, NATIVE_AMOUNT, NATIVE_SCORE } = process.env
    const verifier = await Verifier.deployed()
    const hasherInstance = await hasherContract.deployed()
    await NativeWhirlwind.link(hasherContract, hasherInstance.address)
    const whirlwind = await deployer.deploy(
      NativeWhirlwind,
      verifier.address,
      NATIVE_AMOUNT,
      MERKLE_TREE_HEIGHT,
      accounts[0],
      WIND.address
    )
    await (await WIND.deployed()).addWhirlwind(whirlwind.address, NATIVE_SCORE)
    console.log('NativeWhirlwind\'s address ', whirlwind.address)
  })
}
