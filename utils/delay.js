module.exports = async (time) => {
  return new Promise((resolve) => {
    const id = setTimeout(() => resolve(id), time)
  }).then(clearTimeout)
}
