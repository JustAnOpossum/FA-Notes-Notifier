$('#saveBut').on('click', function(){
  let value = parseInt($('#timenum').val())
  if (!value) {
    $('#error').text('Please enter a valid number.')
  }
  else {
    console.log(value, typeof value)
    chrome.extension.getBackgroundPage().update(value)
    chrome.storage.sync.set({refresh:value})
    $('#time').text(`Current Refresh Rate: ${value} Minutes`)
  }
})

$('#refresh').on('click', function(){
  chrome.extension.getBackgroundPage().getNewNotes()
})

chrome.storage.sync.get('refresh', function(rate){
  $('#time').text(`Current Refresh Rate: ${rate.refresh} Minutes`)
})
