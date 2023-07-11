jQuery(document).ready(function() {
    function sortTable() {
        var table = jQuery('#DataTables_Table_0');
        var rows = table.find('tbody > tr');
        if (rows.length == 0) {
            setTimeout(sortTable, 100);
            return;
        }
        rows = rows.get();
        // process the unprocessed rows
        //if a row contains a td with the text "JAH YIH ENTERPRISE CO., LTD" then delete the row from the table
        if (jQuery(this).text().indexOf("JAH YIH ENTERPRISE CO., LTD") >= 0) {
            jQuery(this).hide();
        }
        jQuery.each(rows, function(index, row) {
            if (!jQuery(row).data('processed')) {
                // process the row here (e.g. replace certain values)
                //console.log("Processing row:", jQuery(row).text());
                jQuery(row).data('processed', true);
            }
        })
        // sort the processed rows alphabetically by the first column
        rows.sort(function(a, b) {
            var A = jQuery(a).children('td').eq(0).text().toUpperCase();
            var B = jQuery(b).children('td').eq(0).text().toUpperCase();
            if(A < B) {
                return -1;
            }
            if(A > B) {
                return 1;
            }
            return 0;
        });
        // append the processed rows to the table
        jQuery.each(rows, function(index, row) {
            table.children('tbody').append(row);
        })
    }
    sortTable();
    
});

