module.exports = async (time) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, time)
  })
}
