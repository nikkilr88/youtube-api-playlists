const $videos = $('.videos');
const $loadBtn = $('.loadMore');

let pageToken;

axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: {
            key: keys.youtube,
            part: 'snippet',
            playlistId: 'PL4cUxeGkcC9i9Ae2D9Ee1RvylH38dKuET',
            maxResults: 10
        }
    })
    .then(res => res.data)
    .then(displayData)

$loadBtn.on('click', () => {
    loadMore(pageToken)
})

function displayData(data) {
    pageToken = data.nextPageToken;
    let divs = createVideo(data).join('');
    $videos.append(divs);
}

function createVideo(data) {
    return data.items.map(item => {
        let url = `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`;
        return `
            <div class="video">
                <img src="${item.snippet.thumbnails.medium.url}">
                <section class="vidInfo">
                    <h3>${item.snippet.title}</h3>
                    <p>${item.snippet.description.substring(0,100)}...</p>
                    <a href="${url}">Watch</a>
                </section>
            </div>
        `;
    })
}

function loadMore(token) {
    if (pageToken) {
        axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
                params: {
                    key: keys.youtube,
                    part: 'snippet',
                    playlistId: 'PL4cUxeGkcC9i9Ae2D9Ee1RvylH38dKuET',
                    maxResults: 10,
                    pageToken: token
                }
            })
            .then(res => res.data)
            .then(data => {
                displayData(data);
                pageToken = data.nextPageToken;
            })
            .catch(error => console.log(error))
    } else {
        $loadBtn.text('All Loaded');
    }

}