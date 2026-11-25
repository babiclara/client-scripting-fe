/* Written in ES5 on purpose: function syntax and map/filter/reduce only. */

export function buildProductLookup(products) {
  return products.reduce(function (lookup, product) {
    lookup[product.id] = product
    return lookup
  }, {})
}

export function attachProductDetails(items, productLookup) {
  return items.map(function (item) {
    var product = productLookup[item.productId]

    return {
      id: item.id,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
      productName: product ? product.name : '',
      productNumber: product ? product.productNumber : '',
    }
  })
}

export function countUnits(items) {
  return items.reduce(function (total, item) {
    return total + Number(item.quantity || 0)
  }, 0)
}

export function describeProduct(product) {
  return product.name + ' (' + product.productNumber + ')'
}

export function filterProducts(products, term, limit) {
  var needle = String(term).trim().toLowerCase()

  var matches = products.filter(function (product) {
    if (needle === '') {
      return true
    }
    return describeProduct(product).toLowerCase().indexOf(needle) !== -1
  })

  return matches.slice(0, limit)
}
