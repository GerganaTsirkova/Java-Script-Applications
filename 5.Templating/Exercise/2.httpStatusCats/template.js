$(() => {
    renderCatTemplate();

    function renderCatTemplate() {
        let template = $('#cat-template').html();
        let catsTemplate = Handlebars.compile(template);
        let result = catsTemplate({cats: window.cats});
        $('#allCats').append(result);
        $('.btn-primary').on('click',function () {
            let clickedElement = $(this);
            if(clickedElement.text()==="Show status code"){
                clickedElement.text('Hide status code');
            }
            else {
                clickedElement.text('Show status code')
            }
            clickedElement.next('div').toggle();
        })
    }


















});

