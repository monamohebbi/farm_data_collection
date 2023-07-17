const task_col = [3]
const crop_col = [4, 20, 26, 35, 49]
const loc_col = [14, 29, 38, 46, 52, 54]
const greenhouse_col = [10]

/**
 * @function buildDataTable()
 * The spreadsheet is flat and difficult to pull data out of. This function
 * transforms the spreadsheet into a data structure that is more usable.
 */
function buildDataTable(data) {
  for (var i = 1; i < data.length; i++) {
    if ( data[i][0]) {
      createMapEntryFromRow(data[i], dataMap)
    }
  }
}

//todo condense these

/**
 * @function buildCropDataTable()
 * This function creates a map keyed by crop so that we can easily show data per crop in later functions.
 * keyedDataMap: a map of data entries stored by key that is optimal for later functioning 
 * i.e if the function is meant to print out data based on if it matches a crop - we can key data by crop so that we can filter quickly and optimally later
 * keys: list of columns that could store the key based on the type of data you are keying 
 * i.e the crop will be stored in column for for a seeding action, but it will be stored in column 20 for an uppotting due to the way branching in the questions in the form stores the data
 * task: optional parameter to filter based on task 
 */
function buildKeyedDataTable(keys, task = null) {
  data = ss.getSheetByName('Form Responses (DO NOT EDIT)').getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    // since task is the first question that leads to branching, we only need to check one location to filter
    if ( data[i][task_col] && (task == null || task == data[i][task_col])) {
      // over here what is the value of keys?
      createMapEntryForKey(keys, data[i], keyedDataMap)
    }
  }
}

/**
 * @function createMapEntryFromRow()
 * Helper function to build existing data stored in datamap or add a new key, called on each row
 * 
 */
function createMapEntryForKey(col_list, row, dataMap) {
  //for some reason col_list = "arugula"
  var keys = ""
  
  // there are several columns that can contain the key value depending on which task, due to branching in the google form. Only one of these columns should be filled out and could hold the key - depending on which list is past in/which value is desired as the key.
  for (var i = 0; i < col_list.length; i++) {
    if (row[col_list[i]] != "") {
      keys = row[col_list[i]]
    }
  }

  // Sometimes, a column may contain a comma separated list
  keys = keys.split(",").map(function (value) { return value.trim(); });
  var value = createEntryFromRow(row)
  
  for (var key of keys) {
    if (dataMap.has(key)) {
      var entries = dataMap.get(key)
      entries.push(value);
      dataMap.set(key, entries)
    } else {
      dataMap.set(key, [value])
    }
  }
}
 
 /**
 * @function createMapEntryFromRow()
 * Helper function that creates in memory representation of row to make data quick and easy to manipulate
 * 
 */
function createEntryFromRow(row) {
  let metadata = new Map();
  metadata.set("Task Notes", new Map() );
  let taskNotes = metadata.get("Task Notes");

  // set day (whether it's today or manually entered)
  if (row[2]) {
    metadata.set('Date', new Date(row[2].toString()) )
  } else {
    metadata.set('Date', new Date(row[0].toString()) )
  }

  // sometimes volunteers enter the date as "0022" instead of "2022" -- check for that and fix if needed
  // NOTE this isn't perfect; if you see incorrect dates in the form responses sheet, it's ok to edit directly
  if ( metadata.get('Date').getFullYear() < 2020 ) {
    let oldYear = metadata.get('Date').getFullYear();
    metadata.get('Date').setFullYear( oldYear + 2000 );
  }

  

  // set name and task
  metadata.set("Name",row[1] );
  metadata.set("Task", row[3]);

  // set Crop, OtherCrop, Variety, Location, Task Notes

  // Seeding
  if (metadata.get("Task") == "Seeding") {

    // if Crop is set to "Other," use the OtherCrop value
    if( row[4] == 'Other / Multiple (list crop in next question)' ) {
      metadata.set("Crop", row[5] );
    } else {
      metadata.set("Crop", row[4] );
    }
    metadata.set("OtherCrop", row[5]);
    metadata.set("Variety", row[6]);
    
    if (row[10] == "Greenhouse" ) {
      metadata.set("Location",row[10] )
    } else {
      metadata.set("Location",row[14] );
    }
    metadata.set("OtherLocation",row[15] );

    taskNotes.set("Seed Company",row[7] );
    taskNotes.set("Packed For",row[8] );
    taskNotes.set("Days to Maturity",row[9] );
    if (row[10] == "Greenhouse") {
      taskNotes.set("Tray", row[11]);
      taskNotes.set("Cells Seeded", row[12]);
      taskNotes.set("Seeds per Cell", row[13] );
    } else {
      taskNotes.set("Rows Seeded", row[16]);
      taskNotes.set("More than one variety?", row[17]);
      taskNotes.set("Seed spacing (inches)", row[18]);
      taskNotes.set("Seeds per hole", row[19]);
    }
  
  // Up-potting
  } else if (metadata.get("Task") == "Up-potting") {
    metadata.set("Crop", row[20] );
    metadata.set("OtherCrop", row[21]);
    metadata.set("Variety", row[22])

    taskNotes.set("Date Seeded", row[23] );
    taskNotes.set("Number of Plants", row[24] );
    taskNotes.set("Timing", row[25] )
  
  // Transplanting
  } else if (metadata.get("Task") == "Transplanting") {
    metadata.set("Crop", row[26] );
    metadata.set("OtherCrop", row[27]);
    metadata.set("Variety", row[28])
    metadata.set("Location",row[29] );
    metadata.set("OtherLocation",row[30] );

    taskNotes.set("Date Seeded", row[31])
    taskNotes.set("Number of Plants", row[32] );
    taskNotes.set("Timing", row[33] )
    taskNotes.set("Fertilizer", row[34])
  
  // Harvesting
  } else if (metadata.get("Task") == "Harvesting") {
    metadata.set("Crop", row[35] );
    metadata.set("OtherCrop", row[36]);
    metadata.set("Variety", row[37]);
    metadata.set("Location",row[38] );
    metadata.set("OtherLocation",row[39] );

    taskNotes.set("Weight (lbs)", row[40]);
    taskNotes.set("Bunches / Baskets / Count", row[41] );
    taskNotes.set("Timing", row[42] );
    taskNotes.set("Overall", row[43])
    taskNotes.set("Destination",row[44] )

  // Fertilizing
  } else if (metadata.get("Task") == "Fertilizing") {
    metadata.set("Location",row[46] );
    metadata.set("OtherLocation",row[47] );
    taskNotes.set("Fertilizer", row[45]);

    // put it in taskNotes AND the primary map
    metadata.set("Fertilizer",row[45] );

  // Observations
  } else if (metadata.get("Task") == "Observations") {
    metadata.set("Crop", row[49] );
    metadata.set("OtherCrop", row[50]);
    metadata.set("Variety", row[51])
    metadata.set("Location",row[52] );
    metadata.set("OtherLocation",row[53] );

    taskNotes.set("Observation", row[48])
  }

  return metadata
}

function buildHarvestByCropDropdown() {
  let cropvals = ss.getRange("FormData!C2:C98").getValues();
  cropvals.unshift(["ALL"]);

  let ddcell = ss.getRange("Harvest By Crop!B1");
  let rule = SpreadsheetApp.newDataValidation().requireValueInList(cropvals, true).build(); 
  ddcell.setDataValidation(rule);
}

