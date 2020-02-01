browser.storage.local.get().then(query => {
  if (query.refresh === undefined) {
    browser.storage.local.set({ refresh: 5 })
    browser.storage.local.set({ sent: [] })
  }
  browser.alarms.create("updateNotes", { periodInMinutes: query.refresh || 5, when: 1000 })
})

browser.alarms.onAlarm.addListener(handleAlarm)

function handleAlarm(alarmInfo) {
  switch (alarmInfo.name) {
    case "updateNotes":
      getNewNotes()
      break;
    default:
  }
}

async function getNewNotes() { //Called first starts events to get new notes.
  let response = await fetch("https://www.furaffinity.net/msg/pms/")
  let text = await response.text()
  let notesDOM = new DOMParser().parseFromString(text, "text/html")
  let unreadNotes = notesDOM.getElementsByClassName("notelinknote-unread")
  for (i = 0; i <= unreadNotes.length - 1; i++) {
    await handleUnreadNote(unreadNotes[i])
  }
}

async function handleUnreadNote(inputNote) { //Called each time for a new note.
  let parentNote = inputNote.parentElement.parentElement.parentElement.parentElement //The parent root element for the notes container
  let senderName = parentNote.getElementsByClassName("note-list-sender")[0].getElementsByTagName("a")[0].text
  let noteURL = parentNote.getElementsByClassName("notelinknote-unread")[0].pathname

  let query = await browser.storage.local.get()
  let sentArray = query.sent
  if (sentArray.includes(noteURL)) {
    return
  }
  sentArray.push(noteURL)
  browser.storage.local.set({ sent: sentArray })

  let profilePictureURL = await getProfileURL(senderName)
  let finalNoteURL = "https://furaffinity.net" + noteURL

  sendNotification(finalNoteURL, profilePictureURL, senderName)
  return
}

function sendNotification(noteURL, profilePictureURL, senderName) { //Sends the notification
  let notification = browser.notifications.create({
    "type": "basic",
    "title": "FA Notes Notifier",
    "message": "New note from " + senderName,
    "iconUrl": profilePictureURL,
  })
}

async function getProfileURL(username) { //Gets profile picture from the FA page.
  let response = await fetch("https://furaffinity.net/user/" + username)
  let text = await response.text()
  let profilePageDOM = new DOMParser().parseFromString(text, "text/html")

  let profilePicture = "http://" + profilePageDOM.getElementsByClassName("user-nav-avatar")[0].src.split("//")[1]
  return profilePicture
}

