/* Written in ES5 on purpose: function syntax and ES5 built-ins only. */

var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function textOf(value) {
  return String(value === null || value === undefined ? '' : value).trim()
}

export function validateCustomer(values) {
  var errors = {}

  if (textOf(values.name) === '') {
    errors.name = 'Name is required.'
  }

  if (textOf(values.surname) === '') {
    errors.surname = 'Surname is required.'
  }

  var email = textOf(values.email)

  if (email === '') {
    errors.email = 'Email is required.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

export function validateBill(values) {
  var errors = {}

  if (textOf(values.billNumber) === '') {
    errors.billNumber = 'Bill number is required.'
  }

  if (textOf(values.date) === '') {
    errors.date = 'Date is required.'
  } else if (isNaN(new Date(values.date).getTime())) {
    errors.date = 'Enter a valid date.'
  }

  var total = textOf(values.total)

  if (total === '') {
    errors.total = 'Total is required.'
  } else if (isNaN(Number(total))) {
    errors.total = 'Total must be a number.'
  } else if (Number(total) < 0) {
    errors.total = 'Total cannot be negative.'
  }

  return errors
}

export function validateItem(values) {
  var errors = {}

  if (textOf(values.productId) === '') {
    errors.productId = 'Product is required.'
  }

  var quantity = textOf(values.quantity)

  if (quantity === '') {
    errors.quantity = 'Quantity is required.'
  } else if (isNaN(Number(quantity))) {
    errors.quantity = 'Quantity must be a number.'
  } else if (Number(quantity) < 1) {
    errors.quantity = 'Quantity must be at least 1.'
  } else if (Number(quantity) % 1 !== 0) {
    errors.quantity = 'Quantity must be a whole number.'
  }

  var totalPrice = textOf(values.totalPrice)

  if (totalPrice === '') {
    errors.totalPrice = 'Total price is required.'
  } else if (isNaN(Number(totalPrice))) {
    errors.totalPrice = 'Total price must be a number.'
  } else if (Number(totalPrice) < 0) {
    errors.totalPrice = 'Total price cannot be negative.'
  }

  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
