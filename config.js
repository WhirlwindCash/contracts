require('dotenv').config()

module.exports = {
  deployments: {
    netId56: {
      bnb: {
        instanceAddress: {
          '100': '0xd53296f4A3cD63163be3d58dEbE109A0B5cF2fa3',
          '10':  '0xA69652C9337A08c53d2DcF4bE9be091168759Ff8',
          '1':   '0x8007ca821Cf5bf055C5B711a3feBAe9b40aeD572',
          '0.1': '0xfEa57d302BC830BF32386d5260c18156e951BDC7'
        },
        symbol: 'BNB',
        decimals: 18
      },

      wind: {
        tokenAddress: '0xcc6af2f60db0cf7cd7b526edd0397ba4ba6e1ce5',
        instanceAddress: {
          '1000': '0x6e45E9cBb1E11FED220bAA90B54A9A36e456eEFc',
          '100':  '0xdbfbC1DdaC7Cd22f3e75BD891f064FBf57c2Eb4C',
          '10':   '0xef25e0324601f5e314a37905560edf8b3654946a',
          '1':    '0xe2121598288176759509d9e2c01577fb7e926419'
        },
        symbol: 'WIND',
        decimals: 18
      }
    },
    netId97: {
      bnb: {
        instanceAddress: {
        },
        symbol: 'BNB',
        decimals: 18
      }
    }
  }
}
