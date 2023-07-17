const ss = SpreadsheetApp.getActiveSpreadsheet();
const keyedDataMap = new Map();

/**
 * When the dropdowns are changed, update that sheet with the new data.
 */
function onEdit(e){
  // test for Bed Search
  if (ss.getActiveSheet().getSheetId() == ss.getSheetByName('Bed Search').getSheetId() ) {
    let cellAddressToTestFor = 'B1';
    if ( e.range.getA1Notation() === cellAddressToTestFor) {
      printHistoryByBed( e.range.getValues() );
      ss.toast('Bed Search updated!');
    };

  // test for Crop Search
  } else if (ss.getActiveSheet().getSheetId() == ss.getSheetByName('Crop Search').getSheetId() ) {

    let cellAddressToTestFor = 'B1';
    if ( e.range.getA1Notation() === cellAddressToTestFor) {
      printHistoryByCrop( e.range.getValues() );
      ss.toast('Crop Search updated!');
    };

  // test for Harvest By Crop
  } else if ( ss.getActiveSheet().getSheetId() == ss.getSheetByName('Harvest By Crop').getSheetId() ) {

    let cellAddressToTestFor = 'B1';
    if ( e.range.getA1Notation() === cellAddressToTestFor) {
      printHarvestByCrop( e.range.getValues() );
      ss.toast('Crop Search updated!');
    };
  }
}

function onOpen(e) {
  buildHarvestByCropDropdown();
}
