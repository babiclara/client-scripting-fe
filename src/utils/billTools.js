/* Written in ES5 on purpose: function syntax and ES5 built-ins only. */

export function describeSeller(seller) {
  return seller.name + ' ' + seller.surname
}

export function describeCard(card) {
  var digits = String(card.cardNumber || '').replace(/\D/g, '')
  var last4 = digits.slice(-4)

  return card.type + ' ' + '•••• ' + last4
}

export function filterCards(cards, term, limit) {
  var needle = String(term).trim().toLowerCase()

  var matches = cards.filter(function (card) {
    if (needle === '') {
      return true
    }
    return describeCard(card).toLowerCase().indexOf(needle) !== -1
  })

  return matches.slice(0, limit)
}
