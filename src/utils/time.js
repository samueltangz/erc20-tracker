const getTimezonedDate = (timestamp) => {
  const date = timestamp ? new Date(timestamp) : new Date()
  const offset = date.getTimezoneOffset() * 60000
  const timezonedDate = new Date(date.getTime() - offset).toISOString()
  return `${timezonedDate.slice(0, 10)} ${timezonedDate.slice(11, 19)}`
}

export {
  getTimezonedDate
}
