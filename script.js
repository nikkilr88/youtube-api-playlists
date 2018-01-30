const $videos = $('.videos');
const $loadBtn = $('.loadMore');
const $closeBtn = $('#close');

let pageToken;

// GET DATA
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

$closeBtn.on('click', () => {
    $('.embed').fadeOut();
    $('.overlay').fadeOut();
    $('#vidDisplay').attr('src', '');
;});

$videos.on('click', '.watch', (e) => {
    let $this = $(e.currentTarget);
    showIframe($this.data('url'));
})

// SHOW VIDEO DIVS
function displayData(data) {
    pageToken = data.nextPageToken;
    let divs = createVideo(data).join('');
    $videos.append(divs);
}

// SHOW IFRAME
function showIframe(url) {
   $('#vidDisplay').attr('src', url);
   $('.embed').fadeIn();
   $('.overlay').fadeIn()
;}

// CREATE VIDEO DIVS
function createVideo(data) {
    return data.items.map(item => {
        let url = `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`;
        return `
            <div class="video">
                <img src="${item.snippet.thumbnails.medium.url}">
                <section class="vidInfo">
                    <h3>${item.snippet.title}</h3>
                    <p>${item.snippet.description.substring(0,100)}...</p>
                    <button data-url="${url}" class="watch">Watch</button>
                </section>
            </div>
        `;
    })
}

// LOAD MORE VIDEO DIVS
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