const url = window.location.origin
const baseUrl = url.endsWith('/') ? url.substr(0, url.lastIndexOf('/')) : url;
const source = document.querySelector('#source');
const titleHead = document.querySelector('#title');
const videoPlayer = document.querySelector('#videoPlayer');
const thumbnailList = document.querySelector('#videoList');
const dropContainer = document.querySelector('#drop-container');

// File Drop config goes here
dropContainer.addEventListener('dragover', (evt) => {
    evt.preventDefault();
    dropContainer.classList.add('hover');
});

dropContainer.addEventListener('dragleave', (evt) => {
    evt.preventDefault();
    dropContainer.classList.remove('hover');
});

dropContainer.addEventListener('drop', (evt) => {
    evt.preventDefault();

    const dataTransfer = new DataTransfer();
    for (const file of evt.dataTransfer.files) {
        if (file.type === 'video/mp4') {
            dataTransfer.items.add(file);
        }
    }

    if (dataTransfer.items.length > 0) {
        uploadFiles(dataTransfer);
    }

});

function uploadFiles(dataTransfer) {

    const fd = new FormData();
    fd.append('file1', dataTransfer.files[0]);
    
    fetch(`${baseUrl}/upload`, { method: 'post', body: fd})
    .then(res => {
        if (res.ok) {
            alert('File uploaded successfully!');
        } else {
            alert('Unable to upload the files.' + res.status);
        }
        dropContainer.classList.remove('hover');
        refreshVideosList();
    })
    .catch(err => console.log(err));

};

function refreshVideosList() {
    fetch(`${baseUrl}/videos`)
    .then(res => {
        if (res.ok) {
            return res.json().then(data => data)
        }
        return [];
    })
    .then(videoMetadata => {
        if (videoMetadata.length > 0) {
            removeChilds(thumbnailList);
            videoMetadata.forEach(({title, thumbnail, url}) => {
                addVideo(title, `${baseUrl}${thumbnail}`, `${baseUrl}${url}`);
            });
            addEvents();
        }
    })
    .catch(err => console.error(err))
}

function addEvents() {
    [...document.getElementsByClassName('video-item')].forEach(elem => {
        elem.addEventListener('click', (evt) => {

            const target = evt.target;

            const title = target.getAttribute('data-title');
            const url = target.getAttribute('data-video');

            titleHead.innerHTML = title;
            
            videoPlayer.pause();
            source.src = url;
            videoPlayer.load();
            videoPlayer.play();

        });
    });
}

function addVideo(title, thumbnail, video) {
    const item = document.createElement('li');

    const image = document.createElement('img');
    image.setAttribute('width', '150');
    image.setAttribute('height', '100');
    image.setAttribute('src', thumbnail);
    image.setAttribute('alt', 'thumbnail');
    image.classList.add('video-item');
    image.dataset.video = video;
    image.dataset.title = title;

    item.appendChild(image);

    thumbnailList.appendChild(item);
}

function removeChilds(parent) {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};