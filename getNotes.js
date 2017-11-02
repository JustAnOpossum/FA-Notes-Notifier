let ids = {} //Object with ids for notification
let objnotes = {} //Global so chrome can clear local storage

chrome.storage.sync.get('refresh', function(value) { //Gets user save value
   if (jQuery.isEmptyObject(value)) {
      chrome.storage.sync.set({ refresh: 3 })
   }
})

function getNewNotes() {
   $('body').load('https://www.furaffinity.net/msg/pms/', function() {
      let arrUnread = $('.note-unread').toArray()
      let arrRead = $('.note-read').toArray()
      if (arrUnread.length > 0) {
         notes(arrUnread, arrRead, false)
      }

      function notes(unread, read) {
        for (let x = 0; x < read.length; x++) { //Clears messages from storage that have been read
          let note = $(read[x]).attr('href')
           chrome.storage.local.get(note, function(item) {
              if (!jQuery.isEmptyObject(item)) {
                 chrome.storage.local.remove(note)
              }
           })
        }
         for (let x = 0; x < unread.length; x++) {
            let note = $(unread[x]).attr('href')
            let user = $(unread[x]).parent().parent().find('.col-from').children().text()
            let title = $(unread[x]).text()
            chrome.storage.local.get(note, function(item) { //Looks for note in local to make sure notification was not sent.
               if (jQuery.isEmptyObject(item)) {
                  let json = new Object()
                  json[note] = true
                  chrome.storage.local.set(json)
                  $('body').load('https://www.furaffinity.net/user/' + user, function() { //Gets user profile picture for notification
                     let notificationOpts = {
                        type: 'basic',
                        iconUrl: ($('.avatar').first().attr('src')).replace('//', 'https://'),
                        title: title,
                        message: 'New message from ' + user,
                        requireInteraction: true,
                        isClickable: true
                     }
                     chrome.notifications.create(notificationOpts, function(id) {
                        ids[id] = 'https://www.furaffinity.net' + note
                        objnotes[id] = note
                     })
                  })
               }
            })
         }
      }
   })
}

chrome.notifications.onClicked.addListener(function(clicked) {
   chrome.tabs.create({ url: ids[clicked] })
   chrome.notifications.clear(clicked)
   delete ids[clicked]
   chrome.storage.local.remove(objnotes[clicked])
})

function start() {
  getNewNotes()
   chrome.storage.sync.get('refresh', function(value) { //Gets user save value
      chrome.alarms.create('updateNotes', {periodInMinutes: value.refresh})
   })
}

chrome.alarms.onAlarm.addListener(() => {
  getNewNotes()
})

function update(val) {
   chrome.alarms.clear('updateNotes', () => {
    chrome.alarms.create('updateNotes', {periodInMinutes: val})
   })
}

start()
