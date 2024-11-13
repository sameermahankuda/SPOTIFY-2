console.log('Lets write javasceipt');
let currentsong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return` ${ formattedMinutes }:${ formattedSeconds }`;
}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
        let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
  // Show all songs in the library
let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
songul.innerHTML = ""; // Clear the existing content

// Build HTML for all songs at once
let songsHtml = '';
for (const song of songs) {
    songsHtml += `<li>
                    <img src="./assets/logo/music.svg" alt="">
                    <div class="info">
                        <div>${song.replaceAll("%20", ' ')}</div>
                        <div>Sam</div>
                    </div>
                    <div class="play-now">
                        <span>Play Now</span>
                        <img class="invert" src="./assets/logo/play1.svg" alt="">
                    </div>
                  </li>`;
}

// Set the generated HTML at once
songul.innerHTML = songsHtml;

    // Attach an addEventListener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })
    return songs;
    
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentsong.play()
        play.src = "./assets/logo/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track) 
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbums() {
    let a = await fetch("http://127.0.0.1:5501/songs")
        let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs/")) {
            console.log(e.href);
            let folder = (e.href.split("/").slice(-1)[0]);
            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:5501/songs/${folder}/info.json`)
                let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="svg"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                            <circle cx="12" cy="12" r="10" stroke-width="1.5" />
                            <path d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z" fill="#000" />
                        </svg></div>
                        <img src="/songs/${folder}/cover.JFIF" alt="">
                        <h4>${response.title}</h4>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    

    // Load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener('click', async items => {
            // console.log(items,items.currentTarget.dataset)
            songs = await getSongs(`songs/${items.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
            
        });
    });
}



async function main() {
    // get list of all songs
    await getSongs("songs/KK")
    // console.log(songs);
    playMusic(songs[0], true)

    // Display all the albums on the page
    displayAlbums()

    // Attach an addEventListener to play , next and previous buttons
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "./assets/logo/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "./assets/logo/play.svg"
        }
    })

    // Listner for timeupdate Event
    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = ` ${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })

    // add addEventListener to seekbar
    document.querySelector(".seekbar").addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;

    })
    // Add event listener to the hamburger icon
    document.querySelector(".hamburger").addEventListener('click', () => {
        document.querySelector(".left").style.left = "0";
    });

    // Add event listener to the close icon
    document.querySelector(".close").addEventListener('click', () => {
        document.querySelector(".left").style.left = "-200%";
    });

    // Add event listener to previous icon 
    previous.addEventListener('click', () => {
        // console.log("previous clicked");
        console.log(songs);

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    // Add event listener to next icon 
    next.addEventListener('click', () => {
        // console.log("next clicked");
        // console.log(songs);

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1]);
        }
    });
    // Add event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener('change', (e) => {
        // console.log("Setting volume to", e.target.value/100);
        currentsong.volume = parseInt(e.target.value) / 100;
    });
    // Add event listener to mute the volume
    document.querySelector(".volume>img").addEventListener('click', (e) => {
        // console.log(e.target);
        // console.log('changing', e.target.src);
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentsong.volume = 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    });


// Set up the AudioContext and Canvas for the visualizer
let audioContext;
let analyser;
let dataArray;
let bufferLength;
let canvas = document.getElementById('visualizer');
let canvasCtx = canvas.getContext('2d');

// Initialize AudioContext and analyser on song play
function initializeVisualizer() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.AudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        // Connect currentsong to the analyser
        const source = audioContext.createMediaElementSource(currentsong);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }
}

// Visualizer rendering function
function drawVisualizer() {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    analyser.getByteFrequencyData(dataArray);

    // Visualize as bars
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
        const r = 250 - (barHeight / 255) * 50;
        const g = 50 + (barHeight / 255) * 200;
        const b = 150;

        canvasCtx.fillStyle = `rgb(${r},${g},${b})`;
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
    }

    requestAnimationFrame(drawVisualizer);
}

// Start visualizer when music starts
currentsong.addEventListener('play', () => {
    initializeVisualizer();
    drawVisualizer();
});

// Stop visualizer when music pauses
currentsong.addEventListener('pause', () => {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
});

// Playback Mode Variables
let isShuffle = false;
let isRepeat = false;

// Shuffle and Repeat Button Event Listeners
document.getElementById('shuffle').addEventListener('click', () => {
    isShuffle = !isShuffle;
    document.getElementById('shuffle').classList.toggle('active', isShuffle);
    console.log('Shuffle mode:', isShuffle);
});

document.getElementById('repeat').addEventListener('click', () => {
    isRepeat = !isRepeat;
    document.getElementById('repeat').classList.toggle('active', isRepeat);
    console.log('Repeat mode:', isRepeat);
});

// Function to get a random song index for shuffle mode
function getRandomSongIndex() {
    return Math.floor(Math.random() * songs.length);
}

// Play the next song with shuffle and repeat modes
currentsong.addEventListener('ended', () => {
    if (isRepeat) {
        currentsong.currentTime = 0;
        currentsong.play();
    } else if (isShuffle) {
        let nextSongIndex = getRandomSongIndex();
        playMusic(songs[nextSongIndex]);
    } else {
        // Normal mode: go to the next song
        let currentIndex = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if (currentIndex + 1 < songs.length) {
            playMusic(songs[currentIndex + 1]);
        } else {
            // If it's the last song, go back to the first song
            playMusic(songs[0]);
        }
    }
});
document.getElementById('shuffle').addEventListener('click', () => {
    isShuffle = !isShuffle;
    document.getElementById('shuffle').classList.toggle('active', isShuffle);
    console.log('Shuffle mode:', isShuffle);
});

document.getElementById('repeat').addEventListener('click', () => {
    isRepeat = !isRepeat;
    document.getElementById('repeat').classList.toggle('active', isRepeat);
    console.log('Repeat mode:', isRepeat);
});

// Event listener for song search
document.getElementById('song-search').addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase();
    const songListItems = document.querySelectorAll('.songlist ul li');

    songListItems.forEach(item => {
        const songName = item.querySelector('.info div').textContent.toLowerCase();
        
        // Show or hide the item based on search match
        if (songName.includes(searchQuery)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});
// Event listener for album search
document.getElementById('album-search').addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase();
    const albumCards = document.querySelectorAll('.cardContainer .card');

    albumCards.forEach(card => {
        const albumTitle = card.querySelector('h4').textContent.toLowerCase();
        
        // Show or hide the card based on search match
        if (albumTitle.includes(searchQuery)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});






}
main()