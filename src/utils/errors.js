export function describeError(error) {
  let message = error.message
  const fromServer = error.response?.data?.message

  if (fromServer) {
    message = fromServer
  }

  return message
}
