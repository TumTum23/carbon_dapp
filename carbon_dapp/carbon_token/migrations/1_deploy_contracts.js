const Token = artifacts.require("CarbonCred");

module.exports = async function(deployer){

  // deploy legacy Token contract
  await deployer.deploy(Token,"CarbonCred","CRED",100000,100000,"0x5DA5b37d9d0867DF6eb4AB6B469c92Bf3d70803a");
  const TokenContract = await Token.deployed();

  console.log('\n*************************************************************************\n')
  console.log(`Token Contract Address: ${TokenContract.address}`)
  console.log('\n*************************************************************************\n')
  
}





