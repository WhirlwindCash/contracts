/* global artifacts */
require('dotenv').config({ path: '../.env' })
const ERC20Whirlwind = artifacts.require('ERC20Whirlwind')
const Verifier = artifacts.require('Verifier')
const hasherContract = artifacts.require('Hasher')
const WIND = artifacts.require('WIND')
const ERC20Mock = artifacts.require('ERC20Mock')


module.exports = function(deployer, network, accounts) {
  return deployer.then(async () => {
    const { MERKLE_TREE_HEIGHT, ERC20_TOKEN, TOKEN_AMOUNT, TOKEN_SCORE } = process.env
    const verifier = await Verifier.deployed()
    const hasherInstance = await hasherContract.deployed()
    await ERC20Whirlwind.link(hasherContract, hasherInstance.address)
    let token = ERC20_TOKEN
    if(token === '') {
      const tokenInstance = await deployer.deploy(ERC20Mock)
      token = tokenInstance.address
    }
    const whirlwind = await deployer.deploy(
      ERC20Whirlwind,
      verifier.address,
      TOKEN_AMOUNT,
      MERKLE_TREE_HEIGHT,
      accounts[0],
      token,
      WIND.address
    )
    await (await WIND.deployed()).addWhirlwind(whirlwind.address, TOKEN_SCORE)
    console.log('ERC20Whirlwind\'s address ', whirlwind.address)
  })
}
