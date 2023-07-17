/**
 * @function printHistoryByCrop
 * When passed a crop, print out the history (seeding, transplanting, fertilizing) into the sheet
 */
function printHistoryByCrop(crop) {
  let thisSheet = ss.getSheetByName('Crop Search');
  let rows = new Array();

  rows.push([
    "Date",
    "Name",
    "Task",
    "Variety",
    "Location",
    "Task Notes",
    "Other Notes"
  ]);

  buildKeyedDataTable(crop_col);
  if (!keyedDataMap.has(crop)) {
    return
  }
  let entries = keyedDataMap.get(crop);

  for (const cropRow of entries) {
    let taskNotesStr = new String();
    let taskNotes = cropRow.get("Task Notes")

    let taskEntries = taskNotes.entries();
    let taskResult = taskEntries.next()
    while (!taskResult.done) {
       taskNotesStr += taskResult.value[0] + ": " + taskResult.value[1] + "\n" ;
       taskResult = taskEntries.next();
    }
    rows.push( [ 
       cropRow.get("Date"), cropRow.get("Name"), cropRow.get("Task"), cropRow.get("Variety"), cropRow.get("Location"), taskNotesStr, cropRow.get("Notes"),
     ] )

  }

  // sort based on actual date
  rows.sort( function(a,b)  {
    return b[0] - a[0];
  });

  return rows
    
   thisSheet.getRange(2, 1, 1000, 8).clearContent();
  let range = thisSheet.getRange(2, 1, rows.length, 7)
  range.setValues(rows);
}

/**
 * @function printHistoryByBed
 * When passed a bed, print out the history (seeding, transplanting, fertilizing) into the sheet
 */
function printHistoryByBed(loc) {
  let thisSheet = ss.getSheetByName('Bed Search');
  let rows = new Array();

  rows.push([
    "Date",
    "Name",
    "Task",
    "Variety",
    "Location",
    "Task Notes",
    "Other Notes"
  ]);

  if (loc != "Greenhouse") {
    buildKeyedDataTable(loc_col);
    if (!keyedDataMap.has(loc)) {
      return
    }  
  } else {
      buildKeyedDataTable(greenhouse_col);
  }
  
  let entries = keyedDataMap.get(loc);

  for (const locRow of entries) {
    let taskNotesStr = new String();
    let taskNotes = locRow.get("Task Notes")

    let taskEntries = taskNotes.entries();
    let taskResult = taskEntries.next()
    while (!taskResult.done) {
       taskNotesStr += taskResult.value[0] + ": " + taskResult.value[1] + "\n" ;
       taskResult = taskEntries.next();
    }
    rows.push( [ 
       locRow.get("Date"), locRow.get("Name"), locRow.get("Task"), locRow.get("Variety"), locRow.get("Location"), taskNotesStr, locRow.get("Notes"),
     ] )

  }

  // sort based on actual date
  rows.sort( function(a,b)  {
    return b[0] - a[0];
  });

    return rows
    
   thisSheet.getRange(2, 1, 1000, 8).clearContent();
  let range = thisSheet.getRange(2, 1, rows.length, 7)
  range.setValues(rows);
}

/**
 * @function printHarvestByCrop()
 * Present harvest data in a consumable way
 * 
 */
function printHarvestByCrop(crop, sd, ed) {
  let thisSheet = ss.getSheetByName('Harvest By Crop');

  let weightcell = thisSheet.getRange(3, 5);
  let countcell = thisSheet.getRange(3, 6);
  let totalWeight = 0;
  let totalCount = 0;

  let rows = new Array();

  rows.push([
    "Date",
    "Name",
    "Task",
    "Variety",
    "Location",
    "Task Notes",
    "Other Notes"
  ]);

  buildKeyedDataTable(crop_col, task = "Harvesting");
  if (!keyedDataMap.has(crop)) {
    return
  }
  let entries = keyedDataMap.get(crop);
  
  for (const cropRow of entries) {
    let taskNotesStr = new String();
    let taskNotes = cropRow.get("Task Notes")

    if (taskNotes.get("Weight (lbs)") !== undefined) {
      totalWeight += Number(taskNotes.get("Weight (lbs)"));
    }
    if (taskNotes.get("Bunches / Baskets / Count") !== undefined) {
      totalCount += Number(taskNotes.get("Bunches / Baskets / Count"));
    }

    let taskEntries = taskNotes.entries();
    let taskResult = taskEntries.next()

    while (!taskResult.done) {
       taskNotesStr += taskResult.value[0] + ": " + taskResult.value[1] + "\n" ;
       taskResult = taskEntries.next();
    }
    rows.push( [ 
       cropRow.get("Date"), cropRow.get("Name"), cropRow.get("Task"), cropRow.get("Variety"), cropRow.get("Location"), taskNotesStr, cropRow.get("Notes"),
     ] )
  }

  // sort based on actual date
  rows.sort( function(a,b)  {
    return b[0] - a[0];
  });

  return [rows, totalCount, totalWeight]
}
