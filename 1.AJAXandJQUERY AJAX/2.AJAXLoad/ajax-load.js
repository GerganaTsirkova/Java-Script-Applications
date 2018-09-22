function loadTitle() {
    //$('#text').load('text.html')
    $(document).ajaxError(function(event,req,settings){
        $('#text').text(`Error loading data: ${req.status} (${req.statusText})`)
    })
    $('#text').load('http://dir.bg')
}