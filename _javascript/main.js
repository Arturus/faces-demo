
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize,
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation
);
// FilePond.parse(document.body);
// const host = window.location.hostname;
// const api_url = host === 'localhost' || host === '127.0.0.1' ? 'http://127.0.0.1:5000' : 'http://42.42.42.42:5000';

// http://127.0.0.1:5000

FilePond.setOptions({
    allowRevert: true,
    dropOnPage: true,
    maxFileSize:'10Mb',
    acceptedFileTypes:['image/png', 'image/jpeg'],
    server:{
        url: process.env.API_URL,
        process: '/upload',
        revert: null,
        restore: null,
        load: null,
        fetch: '/fetch/'
    }
});

// get a reference to the input element
const inputElement = document.querySelector('input[type="file"]');

// create a FilePond instance at the input element location
const pond = FilePond.create( inputElement, {'labelTapToUndo':'Tap ⓧ to upload new photo',
    'labelIdle':'Drag & Drop person photo or <span class="filepond--label-action"> Browse </span>'});
window.pond = pond;

const pond_root = document.querySelector('.filepond--root');
const intro = document.getElementById('intro');
const good_result = document.getElementById('good_result');
const bad_result = document.getElementById('bad_result');
const error_msg = document.getElementById('error_msg');
const gender_text = document.getElementById('gender');
const gender_pr_text = document.getElementById('gender_proba');
const age_text = document.getElementById('age');




pond.on('processfileundo', (file) => {
    intro.style.display = 'block';
    good_result.style.display = 'none';
    bad_result.style.display = 'none';
});

pond.on('removefile', (file) => {
    intro.style.display = 'block';
    good_result.style.display = 'none';
    bad_result.style.display = 'none';
});


pond.on('processfile', (error, file) => {
//pond_root.addEventListener('FilePond:processfile', e => {
    const result = JSON.parse(file.serverId);
    // console.log('File processed', result);
    intro.style.display = 'none';
    if ('error' in result) {
        good_result.style.display = 'none';
        error_msg.innerText = result['error'];
        bad_result.style.display = 'block';
    } else {
        good_result.style.display = 'block';
        const gender_pr = result['gender'].toFixed(2) * 100;
        if (gender_pr > 50) {
            gender_text.innerHTML = '👨 Male';
            gender_pr_text.innerText = gender_pr;
        } else {
            gender_text.innerHTML = '👩 Female';
            gender_pr_text.innerText = (100-gender_pr);
        }

        age_text.innerHTML = result['age'].toFixed(1);
        bad_result.style.display = 'none';
    }
});


