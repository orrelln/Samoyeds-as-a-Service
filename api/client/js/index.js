const primary = $('#try__url__primary');
const secondary = $('#try__url__secondary');
const goBtn = $('.try__btn');

populateOptions();

primary.change(() => {
    populateOptions();
});

goBtn.click(() => {
    let primaryOption = `${$( "#try__url__primary option:selected" ).text()}`;
    let secondaryOption =  `${$( "#try__url__secondary option:selected" ).text()}`;
    $.ajax({
        type: 'GET',
        url: `/${primaryOption}/${secondaryOption}`,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (res) => {
            console.log("Success!");
            $('.res_image').attr('src', res.message[0]).removeClass('u-hidden');
            $('.payload').text(res).removeClass('u-hidden');
        },
        error: (err) => {
            console.log(err);
            $('.payload').text('Error requesting image, check console for details.')
        }
    });
});


function populateOptions() {
    {
        console.log('uhh');
        secondary.removeClass('u-hidden');
        secondary.html('');

        if (primary.val() === 'breed') {
            for (let breed of breeds) {
                secondary.append(`<option value='${breed}'>${breed}</option>`);
            }
        }
        else if (primary.val() === 'category') {
            for (let category of categories) {
                secondary.append(`<option value='${category}'>${category}</option>`)
            }
        }
        else {
            secondary.addClass('u-hidden');
        }
    }
}