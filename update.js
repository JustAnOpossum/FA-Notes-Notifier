browser.storage.local.get().then(item => {
  updateInfo((item.refresh || 5))
})

document.getElementById("saveButton").onclick = function () {
  let newRefrehTime = document.getElementById("timenum").value
  let convertNumber = parseInt(newRefrehTime)
  if (isNaN(convertNumber) || convertNumber === 0) { //If they did not enter number then do nothing
    return
  }
  browser.storage.local.set({ refresh: convertNumber })
  updateInfo(convertNumber)
}

function updateInfo(newUpdateTime) {
  document.getElementById("time").innerHTML = "Current Refresh Time is: " + newUpdateTime + " Minutes"
}