/* Written in ES5 on purpose: function syntax and map/filter/reduce only. */

var SEARCH_FIELDS = ['name', 'surname', 'email', 'telephone', 'city']
var EMPTY_VALUE = '—'

export function buildCityLookup(cities) {
  return cities.reduce(function (lookup, city) {
    lookup[city.id] = city.name
    return lookup
  }, {})
}

export function attachCityNames(customers, cityLookup) {
  return customers.map(function (customer) {
    var cityName = cityLookup[customer.cityId]

    return {
      id: customer.id,
      name: customer.name,
      surname: customer.surname,
      email: customer.email,
      telephone: customer.telephone,
      city: typeof cityName === 'string' ? cityName : '',
    }
  })
}

export function filterCustomers(customers, term) {
  var needle = String(term).trim().toLowerCase()

  if (needle === '') {
    return customers
  }

  return customers.filter(function (customer) {
    return SEARCH_FIELDS.some(function (field) {
      var value = String(customer[field] || '').toLowerCase()
      return value.indexOf(needle) !== -1
    })
  })
}

export function displayValue(value) {
  return value === '' || value === null || value === undefined ? EMPTY_VALUE : value
}
