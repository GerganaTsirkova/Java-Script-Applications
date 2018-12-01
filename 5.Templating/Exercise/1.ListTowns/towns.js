 function attachEvents() {

     $('#btnLoadTowns').on('click',async function () {
         let str = $('#towns');
         if (str.val() !== '') {
             let towns = str.val().split(', ');
             let template = await $.get('litemplate.hbs');
             let townsTemplate = Handlebars.compile(template);
             let data = {towns : []};
             for (let town of towns) {
                 data.towns.push({town:town})
             }
             let result = townsTemplate(data);
             $('#towns-template').append($('<div id="root"></div>'));
             $('#root').append(result);
             str.val('');
         }
     })
};