/* ES5 formatting helpers shared by the bill and item screens. */

var LOCALE = 'hr-HR'
var EMPTY_VALUE = '—'

export function formatDate(value) {
  var date = new Date(value)

  if (isNaN(date.getTime())) {
    return EMPTY_VALUE
  }

  return date.toLocaleDateString(LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatMoney(value) {
  var amount = Number(value)

  if (isNaN(amount)) {
    return EMPTY_VALUE
  }

  return amount.toLocaleString(LOCALE, { style: 'currency', currency: 'EUR' })
}

export function sumAmounts(records, key) {
  return records.reduce(function (total, record) {
    return total + Number(record[key] || 0)
  }, 0)
}
