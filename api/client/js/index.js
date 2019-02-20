const primary = $('#try__req__url__path1');
const secondary = $('#try__req__url__path2');

const goBtn = $('.try__req__go');
const mthdBtn = $('.try__req__method');

populateOptions();
primary.change(() => {
    populateOptions();
});

mthdBtn.click(() => {
    mthdBtn.text().trim() !== 'Get' ? mthdBtn.text('Get') : mthdBtn.text('Post')
});

goBtn.click(() => {
    let method = $('.try__req__method').text().trim();
    console.log(method);
    let primaryOption = `${$( "#try__req__url__path1 option:selected" ).text()}`;
    let secondaryOption =  `${$( "#try__req__url__path2 option:selected" ).text()}`;
    $.ajax({
        type: method,
        url: `/${primaryOption}/${secondaryOption}`,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (res) => {
            console.log("Success!");
            $('.res_image').attr('src', `http://${res.message[0]}`).removeClass('u-hidden');
            $('.payload').text(JSON.stringify(res)).removeClass('u-hidden');
        },
        error: (err) => {
            console.log(`Error: ${JSON.stringify(err)}`);
            $('.payload').text('Error requesting image, check console for details.')
        }
    });
});


function populateOptions() {
    {
        secondary.removeClass('u-hidden');
        secondary.html('');

        if (primary.val() === 'breed') {
            for (let breed of breeds) {
                secondary.append(`<option value='${breed}'>${breed}</option>`);
            }
        }
        /*else if (primary.val() === 'category') {
            for (let category of categories) {
                secondary.append(`<option value='${category}'>${category}</option>`)
            }
        }*/
        else {
            secondary.addClass('u-hidden');
        }
    }
}