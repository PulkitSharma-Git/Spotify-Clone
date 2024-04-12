
let currentSong = new Audio();  //Variable for current song
let songs;  
let currFolder;
let songsUL;

//ChatGPT function to convert seconds into seconds:minutes format
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60); // Extract minutes
    const remainingSeconds = Math.floor(seconds % 60); // Extract remaining seconds

    const formattedMinutes = String(minutes).padStart(2, '0'); // Add leading zero if necessary
    const formattedSeconds = String(remainingSeconds).padStart(2, '0'); // Add leading zero if necessary

    return `${formattedMinutes}:${formattedSeconds}`;
}





//Function to load all the songs into a array named as songs
async function getSongs(folder){
    currFolder= folder;
    let a  = await fetch (`/${folder}/`)
    let response = await a.text()
    let div = document.createElement("div");
    div.innerHTML= response
    let s = div.getElementsByTagName("a")
    songs = []

    for (let i = 0; i < s.length; i++) {
        const element = s[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${folder}/`)[1])
        }   
    }
    //Show all the songs in the playlist
    let songsUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML+ `<li>
        <img src="img/music.svg" alt="">
        <div class="info">
        <div>${song.replace("%20" , " ")}</div>
        <div>Pulkit</div>
        </div>
        <div class="Playnow">
        <img src="img/Playnow.svg" alt="">
        </div>
        
        </li>`
        
    }
    
    //To Play the music when clicked on it in Library
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click" , element => {


            
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            

        })
    })
    return songs
}

const playMusic = (track , pause = false) => {
    currentSong.src = `/${currFolder}/`+track //This updates the source of currentSong
    if(!pause){
        currentSong.play();
        play.src = "img/pause.svg"
    }
    // currentSong.play() //This plays the current song
  
    document.querySelector(".songinfo").innerHTML = track
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
   
}

async function displayAlbums(){
    let a  = await fetch (`/songs/`)
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div");
    div.innerHTML= response;
    
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")

    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
            
        if(e.href.includes("/songs")){
            let folder = e.href.split("/").slice(-2)[0]
            console.log(folder + "<-Ye raha folder")
            
            //Get the meta data of the folder
            let a  = await fetch (`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder = "${folder}" class="card">
            <div  class="play">    
                <img src="img/playsong.svg" alt="">       
                <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 24" width="50px" height="50px" fill="#000000" style="background-color: #1ed760; border-radius: 50%;">
                    <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="transparent" stroke-width="1.5" stroke-linejoin="round" />
                </svg>       -->
            </div>
            <img src= "/songs/${folder}/cover.jpeg" alt="Image">
            
            <h2>${response.title}</h2>
            <p>${response.description}
            </p>
        </div>`

        }
    }

    //Event to load album on clicking the album

    Array.from(document.getElementsByClassName("card")).forEach(e=> {
        console.log(e)
        e.addEventListener("click",async  item=>{
            let songsUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]



            songsUL.innerHTML =""
            console.log(item.target, item.currentTarget.dataset)
            songs = await getSongs(`/songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        
        })
        
    })
}

async function main(){
    //Load the list of the songs
    await getSongs("/songs/ncs");
    playMusic(songs[0] , true)

 
    
    //Display all the albums on the page
    displayAlbums()
     
    //Show all the songs in the playlist
    let songsUL = document.querySelector(".songsList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songsUL.innerHTML = songsUL.innerHTML+ `<li>
        <img src="img/music.svg" alt="">
        <div class="info">
        <div>${song.replace("%20" , " ")}</div>
        <div>Pulkit</div>
        </div>
        <div class="Playnow">
        <img src="img/Playnow.svg" alt="">
        </div>
        
        </li>`
        
    }
    
    //To Play the music when clicked on it in Library
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click" , element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            

        })
    })

    //For changing the play/pause svg on click and play/pause the song
    play.addEventListener("click" , () => {
        if(currentSong.paused){
            currentSong.play();
            play.src = "img/pause.svg"
        }
        else{
            currentSong.pause()
            play.src = "img/playsong.svg"
        }
    })

    //Event to listen the time update
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".songtime").innerHTML =`${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
        document.querySelector(".progress").style.width = (currentSong.currentTime/currentSong.duration)*100 + "%"

    })

   //Add seeking feature to seekbar
    document.querySelector(".seekbar").addEventListener("click" , (e)=>{
        let seek = (e.offsetX/e.target.getBoundingClientRect().width)*100 
        document.querySelector(".circle").style.left = seek + "%";
        document.querySelector(".progress").style.width = seek + "%";
        currentSong.currentTime = ((currentSong.duration)*seek)/100

    })

    //Add Event Listener for hamburger
    document.querySelector(".hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "0"
    })

    //Add Event Listener to close sign
    document.querySelector(".close").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-100% "
    })

    //Add event listener to previous and next button
    previous.addEventListener("click" , ()=>{
     
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if(index-1 >0){
            playMusic(songs[index-1])
        }
    })
    next.addEventListener("click" , ()=>{
    
        let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0])
        if((index+1) < songs.length  ){
            playMusic(songs[index+1])
        }   
    })

    //Add event to volume rocker
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
     
        currentSong.volume = e.target.value/100;
    })

    //To mute when clicked on speaker button
    document.querySelector(".timevol img").addEventListener("click" , (e)=>{
        console.log(e)

        if(e.target.src.includes("img/volume.svg")){
            e.target.src = e.target.src.replace("img/volume.svg" , "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg" , "img/volume.svg")
            currentSong.volume = .10;
            console.log("setting volume to 10")
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
      
    })

    


   

   
}
main()
