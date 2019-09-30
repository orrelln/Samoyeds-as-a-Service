const $primary = $('.try__req__url__path1');
const $secondary = $('.try__req__url__path2');
const $slash = $('.try__req__url__slash');
const $domain = $('.try__req__url__domain');
const $upload = $('.try__req__upload');

const $imgContainer = $('.try__img');
const $loader = $('.bouncing-loader');
const $jsonContainer = $('.try__json');
const $jsonPayload = $('.payload');

const $goBtn = $('.try__req__go');
const $mthdBtn = $('.try__req__method');

const uploadReader = new FileReader();
let file;

function stringify(text) {
    return JSON.stringify(text, undefined, 4);
}

populateOptions();

$primary.change(() => {
    populateOptions();
});

$mthdBtn.click(() => {
    $('.res_image').attr('src', '');
    $imgContainer.addClass('u-remove');
    $jsonPayload.text('');
    $jsonContainer.addClass('u-remove');

    if ($mthdBtn.text().trim() !== 'GET') {
        $mthdBtn.text('GET');
        $primary.removeClass('u-remove');
        $secondary.removeClass('u-remove');
        $slash.removeClass('u-remove');
        $upload.addClass('u-shrink');
        $domain.text('https://samoyeds.cc/');
        $goBtn.removeClass('btn--disabled');
    }
    else {
        $mthdBtn.text('POST');
        $primary.addClass('u-remove');
        $secondary.addClass('u-remove');
        $slash.addClass('u-remove');
        $upload.removeClass('u-shrink');
        $domain.text('https://samoyeds.cc/upload');
        $goBtn.addClass('btn--disabled');
    }
});

$goBtn.click(() => {
    if ($mthdBtn.text().trim() === 'GET') {

        let primaryOption = `${$(".try__req__url__path1 option:selected").text()}`;
        let secondaryOption = `${$(".try__req__url__path2 option:selected").text()}`;

        getImage(primaryOption, secondaryOption);

    }
    else if(uploadReader.result) {

        let fd = new FormData();
        fd.append('photo', file, file.name);

        $loader.removeClass('u-remove');
        $imgContainer.addClass('u-remove');
        $goBtn.addClass('btn--disabled');

        postImage(fd);
        file = null;
    }

});


function populateOptions() {
    {
        $secondary.removeClass('u-hidden');
        $secondary.html('');

        if ($primary.val() === 'breed') {
            for (let breed of breeds) {
                $secondary.append(`<option value='${breed}'>${breed}</option>`);
            }
            $secondary.val("samoyed");
        }
        else if ($primary.val() === 'category') {
            for (let category of categories) {
                $secondary.append(`<option value='${category}'>${category}</option>`)
            }
        }
        else {
            $secondary.addClass('u-hidden');
        }
    }
}

function copy_into_clipboard() {
    let modal = $('.modal');
    let $temp = $("<input readonly=\"true\">");

    modal.removeClass('modal--animate');
    $("body").append($temp);
    $temp.val($('.u-copy').text());

    // Detects mobile Apple devices and copies to clipboard correctly if so
    const isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
    if (isiOSDevice) {
        let el = $temp.get(0);
		let editable = el.contentEditable;
		el.contentEditable = true;

		let range = document.createRange();
		range.selectNodeContents(el);

		let selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);

		el.setSelectionRange(0, 999999);
		el.contentEditable = editable;
	}
	else {
	 	$temp.select();
	}

    document.execCommand("copy");
    $temp.remove();
    modal.addClass('modal--animate');
}

uploadReader.onload = function (e) {
    $('.res_image').attr('src', e.target.result);
    $imgContainer.removeClass('u-remove');
    $goBtn.removeClass('btn--disabled');
};

function readURL(input) {
    if (input.files && input.files[0]) {
        file = input.files[0];
        uploadReader.readAsDataURL(input.files[0]);
    }
}

$(".try__req__upload__file").change(function(){
    readURL(this);
    $imgContainer.removeClass('u-remove');
    $jsonContainer.addClass('u-remove');
});


function getStatus(url) {
     $.ajax({
        type: 'GET',
        url: url,
        success: (res) => {
            let status = res.message.processing_status;
            if(status==='processing') {
                setTimeout(getStatus(url), 1000);
            }
            else if(status==='rejected') {
                $loader.addClass('u-remove');
                let render = stringify(res);
                $jsonPayload.html(render);
                $jsonContainer.removeClass('u-remove');
            }
            else {
                getImage('id', res.message.id);
                $loader.addClass('u-remove');
            }

        },
        error: (err) => {
            console.log(`Error: ${stringify(err)}`);
            $jsonPayload.text('Error requesting status, check console for details.');
            $jsonContainer.removeClass('u-remove');
        }
    });
}


function getImage(primaryOption, secondaryOption) {
     $.ajax({
        type: 'GET',
        url: `/${primaryOption}/${secondaryOption}`,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        success: (res) => {
            res.message[0].link = res.message[0].link.replace("http://", "");
            res.message[0].link = res.messahe[0].link.replace("www.", "");
            let cleanedResponse = stringify(res);
            $('.res_image').attr('src', `https://${res.message[0].link}`);
            cleanedResponse = cleanedResponse.replace(
                `"${res.message[0].link}"`,
                `"<span class='u-copy' onclick="copy_into_clipboard()">${res.message[0].link}</span>"`
            );
            $jsonPayload.html(cleanedResponse);
            $imgContainer.removeClass('u-remove');
        },
        error: (err) => {
            console.log(`Error: ${stringify(err)}`);
            $jsonPayload.text('Error requesting image, check console for details.');
        },
        complete:  () => {
            $jsonContainer.removeClass('u-remove');
            $loader.addClass('u-remove');
        }
    });
}

function postImage(fd) {
    $.ajax({
        type: 'POST',
        url: '/upload',
        processData: false,
        dataType: 'json',
        data: fd,
        contentType: false,
        success: (res) => {
            let render = stringify(res);
            $jsonPayload.html(render);
            $jsonContainer.removeClass('u-remove');
            getStatus(res.message.link);
        },
        error: (err) => {
            console.log(`Error: ${stringify(err)}`);
            let render = stringify(err.responseJSON);
            $jsonPayload.html(render);
            $loader.addClass('u-remove');
            $jsonContainer.removeClass('u-remove');
        }
    });
}

$(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 500);
});
