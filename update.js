$('#saveBut').on('click', function(){
  let value = parseInt($('#timenum').val())
  value = $('#timenum').val()
  if (!value) {
    $('#error').text('Please enter a valid number.')
  }
  else {
    let time = (value * 60) * 1000
    chrome.extension.getBackgroundPage().update(time)
    chrome.storage.sync.set({refresh:time})
    $('#time').text('Current Refresh Rate: ' + ((time / 1000) / 60) + ' Minutes')
  }
})

$('#refresh').on('click', function(){
  chrome.extension.getBackgroundPage().getNewNotes()
})

chrome.storage.sync.get('refresh', function(rate){
  $('#time').text('Current Refresh Rate: ' + ((rate.refresh / 1000) / 60) + ' Minutes')
})
