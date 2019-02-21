const primary = $('.try__req__url__path1');
const secondary = $('.try__req__url__path2');
const slash = $('.try__req__url__slash');
const domain = $('.try__req__domain');
const upload = $('.try__req__upload');

const goBtn = $('.try__req__go');
const mthdBtn = $('.try__req__method');

const uploadReader = new FileReader();

populateOptions();
primary.change(() => {
    populateOptions();
});

mthdBtn.click(() => {
    if (mthdBtn.text().trim() !== 'Get') {
        mthdBtn.text('Get');
        primary.removeClass('u-hidden');
        secondary.removeClass('u-hidden');
        slash.removeClass('u-hidden');
        upload.addClass('u-hidden');
        domain.text('https://samoyeds.cc/');
        $('.try__req').css( "grid-template-columns", "1fr 2fr 6fr 0 1fr");
    } else {
        upload.removeClass('u-hidden');
        mthdBtn.text('Post');
        primary.addClass('u-hidden');
        secondary.addClass('u-hidden');
        slash.addClass('u-hidden');
        domain.text('https://samoyeds.cc/upload');
        $('.try__req').css( "grid-template-columns", "1fr 2fr 0 4fr 1fr");
    }
});

goBtn.click(() => {
    if (mthdBtn.text().trim() === 'Get') {
        let method = $('.try__req__method').text().trim();
        console.log(method);
        let primaryOption = `${$(".try__req__url__path1 option:selected").text()}`;
        let secondaryOption = `${$(".try__req__url__path2 option:selected").text()}`;
        $.ajax({
            type: method,
            url: `/${primaryOption}/${secondaryOption}`,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            success: (res) => {
                console.log("Success!");
                $('.res_image').attr('src', `http://${res.message[0]}`).removeClass('u-hidden');
                $('.payload').text(JSON.stringify(res, undefined, 4)).removeClass('u-hidden');
            },
            error: (err) => {
                console.log(`Error: ${JSON.stringify(err)}`);
                $('.payload').text('Error requesting image, check console for details.')
            }
        });
    } else {
        if (uploadReader.result) {
            console.log(uploadReader);
            $.ajax({
                type: 'POST',
                url: '/upload',
                //contentType: "application/json; charset=UTF-8",
                processData: false,
                dataType: 'json',
                data: {'photo': uploadReader.result},
                contentType: false,
                success: (res) => {
                    console.log("Success!");
                    console.log(res.message[0]);
                    //$('.res_image').attr('src', `http://${res.message[0]}`).removeClass('u-hidden');
                    $('.payload').text(JSON.stringify(res)).removeClass('u-hidden');
                },
                error: (err) => {
                    console.log(`Error: ${JSON.stringify(err)}`);
                    $('.payload').text('Error requesting image, check console for details.').removeClass('u-hidden');
                }
            });
        }
    }
});


function populateOptions() {
    {
        secondary.removeClass('u-hidden');
        secondary.html('');

        if (primary.val() === 'breed') {
            for (let breed of breeds) {
                secondary.append(`<option value='${breed}'>${breed}</option>`);
            }
            secondary.val("samoyed");
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

uploadReader.onload = function (e) {
    $('.res_image').attr('src', e.target.result).removeClass('u-hidden');
};

function readURL(input) {
    if (input.files && input.files[0]) {
        uploadReader.readAsDataURL(input.files[0]);
    }
}

$(".try__req__upload__file").change(function(){
    readURL(this);
});

