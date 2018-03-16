import detectPitch from 'detect-pitch'



export const noteChange = (notes) => {
  return dispatch => {

    dispatch({
      type: 'NOTE_CHANGE',
      payload: notes
    })
  }
}

export const setSongAsProp = (song) => {
  return dispatch => {

    dispatch({
      type: 'SET_SONG_AS_PROP',
      payload: song
    })
  }
}

export const chartSong = (url) => {
  wad(url)
  console.log(url)
  return dispatch => {

    /*dispatch({
      type: 'SET_SONG_AS_PROP',
      payload: song
    })*/
  }
}

function newPitch(){
var NUM_SAMPLES = 4096

var signal = new Float32Array(NUM_SAMPLES)

var audio = new Audio
audio.src = 'https://dl.dropboxusercontent.com/s/8c9m92u1euqnkaz/GershwinWhiteman-RhapsodyInBluePart1.mp3'
audio.loop = true

/*audio.addEventListener('canplay', function() {*/
  var context = new (window.AudioContext || window.webkitAudioContext)
  var stream = context.createMediaElementSource(audio)
  var analyser = context.createAnalyser(audio)

  stream.connect(analyser)
  analyser.connect(context.destination)

  //audio.play()

  function processSection() {
    requestAnimationFrame(processSection)

    analyser.getFloatTimeDomainData(signal)
    var period = detectPitch(signal, 0.2)
    var pitch = -1
    if(period) {
      pitch = Math.round(44100.0 / period)
      console.log(pitch)
    } else {
      console.log( '-' )
    }

  }

  processSection()
}

function wad(url){
  var voice = new Wad({source : url });
  var tuner = new Wad.Poly();
  tuner.add(voice);
  //voice.play();
  setInterval(function(){
    console.log(tuner.pitch, tuner.noteName)
  }, 500);

  tuner.updatePitch() // The tuner is now calculating the pitch and note name of its input 60 times per second. These values are stored in tuner.pitch and tuner.noteName.

  /*var logPitch = function(){
    console.log(tuner.pitch, tuner.noteName)
    requestAnimationFrame(logPitch)
  };
logPitch();*/
}
