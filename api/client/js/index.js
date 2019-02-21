const primary = $('.try__req__url__path1');
const secondary = $('.try__req__url__path2');
const slash = $('.try__req__url__slash');
const domain = $('.try__req__domain');
const upload = $('.try__req__upload');

const goBtn = $('.try__req__go');
const mthdBtn = $('.try__req__method');

const uploadReader = new FileReader();
let file;

function stringify(text) {
    return JSON.stringify(text, undefined, 4);
}

populateOptions();
primary.change(() => {
    populateOptions();
});

mthdBtn.click(() => {
    if (mthdBtn.text().trim() !== 'GET') {
        mthdBtn.text('GET');
        primary.removeClass('u-remove');
        secondary.removeClass('u-remove');
        slash.removeClass('u-remove');
        upload.addClass('u-remove');
        domain.text('https://samoyeds.cc/');
        $('.try__req').css( "grid-template-columns", "1fr 2fr 6fr 0 1fr");
    } else {
        upload.removeClass('u-remove');
        mthdBtn.text('POST');
        primary.addClass('u-remove');
        secondary.addClass('u-remove');
        slash.addClass('u-remove');
        domain.text('https://samoyeds.cc/upload');
        $('.try__req').css( "grid-template-columns", "1fr 2fr 0 4fr 1fr");
    }
});

goBtn.click(() => {
    if (mthdBtn.text().trim() === 'GET') {
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
                $('.payload').text(stringify(res)).removeClass('u-hidden');
            },
            error: (err) => {
                console.log(`Error: ${stringify(err)}`);
                $('.payload').text('Error requesting image, check console for details.')
            }
        });
    } else {
        if (uploadReader.result) {
            let fd = new FormData();
            fd.append('photo', file, file.name);
            console.log(uploadReader);
            let url;
            $.ajax({
                type: 'POST',
                url: '/upload',
                //contentType: "application/json; charset=UTF-8",
                processData: false,
                dataType: 'json',
                data: fd,
                contentType: false,
                success: (res) => {
                    console.log("Success!");
                    url = res.message.link;
                    //$('.res_image').attr('src', `http://${res.message[0]}`).removeClass('u-hidden');
                    $('.payload').text(stringify(res)).removeClass('u-hidden');
                    setTimeout(function () {ajaxRepeat(url);}, 500);

                },
                error: (err) => {
                    console.log(`Error: ${stringify(err)}`);
                    $('.payload').text('Error requesting image, check console for details.').removeClass('u-hidden');
                }
            });
        }
        file = null;
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

function ajaxRepeat(url) {
    $.ajax({
        type: 'GET',
        url: url,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (res) => {
            $('.payload').text(stringify(res)).removeClass('u-hidden');
            if (res.message.processing_status === 'processing' ||
                res.message.processing_status === 'approved') {
                setTimeout(function () {ajaxRepeat(url);}, 500);
            }
        },
        error: (err) => {
            console.log(`Error: ${stringify(err)}`);
            $('.payload').text('Error requesting image, check console for details.').removeClass('u-hidden');
        }
    });
}

uploadReader.onload = function (e) {
    $('.res_image').attr('src', e.target.result).removeClass('u-hidden');
};

function readURL(input) {
    if (input.files && input.files[0]) {
        file = input.files[0];
        uploadReader.readAsDataURL(input.files[0]);
    }
}

$(".try__req__upload__file").change(function(){
    readURL(this);
});

