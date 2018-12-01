(async () => {
    let data = await $.get('./data.json'); //here we extract the outside data
    let template = await $.get('./templates/contact.hbs'); //this is the string
    let contactsTemplate = Handlebars.compile(template);
    let finalData = {contact: data};
    let result = contactsTemplate(finalData);
    $('#list').append(result);
    //now we have to register the partials:
    let firstDivInfo = await $.get('./templates/partials/firstDivInfo.hbs');
    let secondDivInfo = await $.get('./templates/partials/secondDivInfo.hbs');
    let details = await $.get('./templates/detailsContact.hbs');
    Handlebars.registerPartial('firstDivInfo',firstDivInfo);
    Handlebars.registerPartial('secondDivInfo',secondDivInfo);
    let detailsTemplate = Handlebars.compile(details);
    //and the click event:
    $('.contact').on('click',function () {
        $('#details').empty();
        let index = $(this).attr('data-id');
        let resultt = detailsTemplate(data[index]);
        $('#details').append(resultt);
    })
})();
