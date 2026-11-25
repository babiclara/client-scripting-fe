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

export function sortCustomers(customers, column, direction) {
  var factor = direction === 'desc' ? -1 : 1
  var copy = customers.slice()

  copy.sort(function (a, b) {
    var left = String(a[column] || '').toLowerCase()
    var right = String(b[column] || '').toLowerCase()

    if (left === right) return 0
    if (left === '') return 1
    if (right === '') return -1

    return left < right ? -factor : factor
  })

  return copy
}

export function paginate(items, page, pageSize) {
  var start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function countPages(total, pageSize) {
  if (pageSize <= 0) {
    return 1
  }
  return Math.max(1, Math.ceil(total / pageSize))
}

export function initials(customer) {
  var letters = [customer.name, customer.surname].map(function (part) {
    return String(part || '').charAt(0).toUpperCase()
  })

  return letters.join('') || '?'
}

export function describeRange(page, pageSize, total) {
  if (total === 0) {
    return 'No results'
  }

  var start = (page - 1) * pageSize + 1
  var end = Math.min(start + pageSize - 1, total)

  return start + '-' + end + ' of ' + total
}

export function displayValue(value) {
  return value === '' || value === null || value === undefined ? EMPTY_VALUE : value
}
