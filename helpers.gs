/** @function formatTaskNotes
 * Takes a taskNotes map, and returns the content in nicer formatting
 */
function formatTaskNotes(taskNotes) {
  let taskNotesStr = new String();
  if (!taskNotes) { return };

  let taskEntries = taskNotes.entries();
  let taskResult = taskEntries.next()
  while (!taskResult.done) {
      taskNotesStr += taskResult.value[0] + ": " + taskResult.value[1] + "\n" ;
      taskResult = taskEntries.next();
    }
    return taskNotesStr;
}

/** @function setExpectedHarvestDate(entry)
 * Takes a dataMap entry, and returns the weather the line item some task notes have timing 
 * Takes seeding - a map of dataMap entries for things that have been seeded in the greenhouse keyed by date
 */
function setExpectedHarvestDate(entry, greenhouseEntries) {
  if ( entry.value[1].get("Task") == "Transplanting" ) {
    let dateSeeded = entry.value[1].get("Task Notes").get("Date Seeded")
    if (dateSeeded) {
      if ( greenhouseEntries.get(dateSeeded) ) {
        entry.value[1].set("Expected Harvest", new Date(dateSeeded + greenhouseEntries.get(dateSeeded).get("Date to maturity")))
      }
    } else {
      entry.value[1].set("Expected Harvest", "")
    }
  } else if ( entry.value[1].get("Task") == "Seeding" ) {
    daysToMaturity = entry.value[1].get("Task Notes").get("Days to Maturity")
    if (daysToMaturity) {
      entry.value[1].set("Expected Harvest", addDays(entry.value[1].get("Date"), daysToMaturity))
    } else {
      entry.value[1].set("Expected Harvest", "")
    }
  }
}

function addDays(date, days) {
  const dateCopy = new Date(date);
  dateCopy.setDate(date.getDate() + days);
  return dateCopy;
}
