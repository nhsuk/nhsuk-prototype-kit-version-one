const https = require('https')

// this is a free key for getAddress.io which expires after 30 days
// generate a new one and set it below
const API_KEY = 'UP4kJ2IYtkafb2bmyoYFdw10997'

module.exports = function postcodeSearch (input, req) {
  input.title = 'Postcode Search'
  input.results = null
  input.error = {
    badFormat: false,
    connectionFailure: false,
    unknownAddress: false
  }

  if (req.method === 'POST') {
    input.validated = input.validated || {}

    // validate postcode
    if (input.postcode) {
      if (!isPostcodeFormatValid(input.postcode)) {
        input.error.badFormat = true
      } else {
        // cache the results of the most recent postcode search, using the
        // cached results if the postcode hasn't changed
        const pc = normalisePostcode(input.postcode)
        if (pc !== input.validated.postcode) {
          req.session.addresses = []

          // returns a promise which resolves to the input to the template only when
          // the postcode search has completed
          return fetchAddressesForPostcode(input.postcode)
            .then(response => {
              if (Array.isArray(response.addresses) && response.addresses.length) {
                // the search returned results - tidy up the addresses and store them in
                // session for later use
                req.session.addresses = response.addresses.map(addr => addr.replace(/(, )+/g, ', '))
                input.validated.postcode = pc
                req.session.validated = Object.assign({}, req.session.validated, {postcode: input.validated.postcode})
                input.results = req.session.addresses
              }
              return input
            })
            .catch(_ => {
              input.error.connectionFailure = true
              return input
            })
        } else {
          input.results = req.session.addresses || []
        }
      }
    }

    if (input.address) {
      // validate the selected address against the stored addresses and, if found, store the
      // chosen address in session for use by the template
      if (req.session.addresses && input.address in req.session.addresses) {
        input.validated.address = req.session.addresses[input.address]
        req.session.validated = Object.assign({}, req.session.validated, {address: input.validated.address})
        input.redirect = 'postcode-search'
      } else {
        input.error.unknownAddress = true
      }
    }
  }

  return input
}

function isPostcodeFormatValid (postcode) {
  return /^([A-Z][A-Z0-9]?[A-Z0-9]?[A-Z0-9]? {0,2}[0-9][A-Z0-9]{2})$/i.test(postcode)
}

function normalisePostcode (postcode) {
  return postcode.replace(' ', '').toUpperCase()
}

function fetchAddressesForPostcode (postcode) {
  return new Promise(function (resolve, reject) {
    https.get(`https://api.getAddress.io/find/${postcode}?api-key=${API_KEY}`,
      function (response) {
        // Continuously update stream with data
        let body = ''
        response.on('data', d => { body += d })
          .on('end', () => resolve(JSON.parse(body)))
          .on('error', reject)
      }
    )
  })
}
