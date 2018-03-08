import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  noteChange
} from '../../actions/chartActions'
window.AudioContext = window.AudioContext || window.webkitAudioContext;

var audioContext = null;
var isPlaying = false;
var sourceNode = null;
var analyser = null;
var theBuffer = null;
var DEBUGCANVAS = null;
var mediaStreamSource = null;
var playing = false;
var detectorElem,
starter,
canvasElem,
waveCanvas,
pitchElem,
noteElem,
detuneElem,
MAX_SIZE,
pitch,
isLiveInput,
detuneAmount;

class Pitch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    notes : [],
    pieNotes: []
    };
    this.togglePlayback = this.togglePlayback.bind(this);
    this.changeNotes = this.changeNotes.bind(this);
  }
  /*componentDidMount() {
    let juicy = 'http://kolber.github.io/audiojs/demos/mp3/02-juicy-r.mp3'
    let island = 'http://kolber.github.io/audiojs/demos/mp3/04-islands-is-the-limit.mp3'
    let songsArray =[juicy, island]
    //this.pickSong(island);
  }*/

pickSong(url) {
  console.log(url, this.props);
  url = this.props.song.track.preview_url
  audioContext = new AudioContext();
  MAX_SIZE = Math.max(4,Math.floor(audioContext.sampleRate/5000));	// corresponds to a 5kHz signal
  var request = new XMLHttpRequest();
  //request.open("GET", 'https://dl.dropboxusercontent.com/s/8c9m92u1euqnkaz/GershwinWhiteman-RhapsodyInBluePart1.mp3', true);
  request.open("GET", url, true);
  request.responseType = "arraybuffer";
  request.onload = function() {
    audioContext.decodeAudioData(request.response).then(function(buffer) {
      theBuffer = buffer;
    })

  }
  request.send();

  detectorElem = document.getElementById( "detector" );
  canvasElem = document.getElementById( "output" );
  DEBUGCANVAS = document.getElementById( "waveform" );
  if (DEBUGCANVAS) {
    waveCanvas = DEBUGCANVAS.getContext("2d");
    waveCanvas.strokeStyle = "black";
    waveCanvas.lineWidth = 1;
  }
  pitchElem = document.getElementById( "pitch" );
  noteElem = document.getElementById( "note" );
  detuneElem = document.getElementById( "detune" );
  detuneAmount = document.getElementById( "detune_amt" );

  detectorElem.ondragenter = function () {
    this.classList.add("droptarget");
    return false; };
    detectorElem.ondragleave = function () { this.classList.remove("droptarget"); return false; };
    detectorElem.ondrop = function (e) {
      this.classList.remove("droptarget");
      e.preventDefault();
      theBuffer = null;

      var reader = new FileReader();
      reader.onload = function (event) {
        audioContext.decodeAudioData( event.target.result, function(buffer) {
          theBuffer = buffer;
        }, function(){alert("error loading!");} );

      };
      reader.onerror = function (event) {
        alert("Error: " + reader.error );
      };
      reader.readAsArrayBuffer(e.dataTransfer.files[0]);
      return false;
    };
}


      togglePlayback(state) {
        console.log(isPlaying)
        if (isPlaying) {
          //stop playing and return
          sourceNode.stop( 0 );
          sourceNode = null;
          analyser = null;
          isPlaying = false;
          if (!window.cancelAnimationFrame)
          window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
          window.cancelAnimationFrame( rafID );
          clearInterval(starter)
          return "start";
        }

        sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = theBuffer;
        sourceNode.loop = true;

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        sourceNode.connect( analyser );
        analyser.connect( audioContext.destination );
        sourceNode.start( 0 );
        isPlaying = true;
        isLiveInput = false;
        updatePitch();

        let pieNotes = this.state.pieNotes;
        for (let i=0; i < pieNotes.length; i++) {
          let note = noteFromPitch( pitch ) || 0
          if  (!(note in pieNotes)) {
            pieNotes.push({note: note});
            console.log(pieNotes);
          }
          else {
            console.log(pieNotes);
          }
        }



        let notes = this.state.notes;
        let time = 0;
        starter = setInterval(function(){
          //this.setState({notes: notes});
          var note =  noteFromPitch( pitch ) || 0
          ////console.log(notes);
          time += 50;

          notes.push({time: time/100, note: note})
          this.changeNotes(notes);
          this.props.noteChange(notes);
          //this.props.pieChange(noteStrings[note%12]);
          }.bind(this),
           50);
        return "stop";

      }

      changeNotes(notes) {
        this.setState({notes: notes});
      }

      toggleLiveInput() {
        if (isPlaying) {
          //stop playing and return
          sourceNode.stop( 0 );
          sourceNode = null;
          analyser = null;
          isPlaying = false;
          if (!window.cancelAnimationFrame)
          window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
          window.cancelAnimationFrame( rafID );
          //stop playing and return
          clearInterval(starter)
          return "start";
        }

        let notes = this.state.notes;
        let time = 0;
        starter = setInterval(function(){
          //this.setState({notes: notes});
          var note =  noteFromPitch( pitch ) || 0
          ////console.log(notes);
          time += 50;

          notes.push({time: time/100, note: note})
          this.changeNotes(notes);
          this.props.noteChange(notes);
          }.bind(this),
           50);

        getUserMedia(
          {
            "audio": {
              "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false"
              },
              "optional": []
            },
          }, gotStream);

          return "stop";
        }

        toggleOscillator() {
          if (isPlaying) {
            //stop playing and return
            sourceNode.stop( 0 );
            sourceNode = null;
            analyser = null;
            isPlaying = false;
            if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = window.webkitCancelAnimationFrame;
            window.cancelAnimationFrame( rafID );
            return "play oscillator";
          }
          sourceNode = audioContext.createOscillator();

          analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
          sourceNode.connect( analyser );
          analyser.connect( audioContext.destination );
          sourceNode.start(0);
          isPlaying = true;
          isLiveInput = false;
          updatePitch();

          return "stop";
        }


        render(){
          return(
            <div>
            <p>
            <button onClick={() => this.togglePlayback()}>use demo audio</button>

            </p>

            <p>
            {/*<button onClick={() => this.pickSong('https://p.scdn.co/mp3-preview/d53d5678b946219bd6df0b3d04ce0b3554f167d4?cid=6f53ccc304f94146bac62a8114fd06f6')}>Juicy</button>
            <button onClick={() => this.pickSong('http://kolber.github.io/audiojs/demos/mp3/04-islands-is-the-limit.mp3')}>Island</button>*/}
            <button style={{color: 'white'}} onClick={() => this.pickSong('https://dl.dropboxusercontent.com/s/8c9m92u1euqnkaz/GershwinWhiteman-RhapsodyInBluePart1.mp3')}>Old Timey</button>
            </p>

            <div id="detector" className="vague">
            <div className="pitch"><span id="pitch">--</span>Hz</div>
            <div className="note"><span id="note">--</span></div>
            <canvas id="output" width={300} height={42}></canvas>
            <div id="detune"><span id="detune_amt">--</span><span id="flat">cents &#9837;</span><span id="sharp">cents &#9839;</span></div>
            </div>
            </div>
          )
        }

    }

    const mapStateToProps = state => ({
    })

    const mapDispatchToProps = dispatch => bindActionCreators({
      noteChange,
      //pieChange
    }, dispatch)

    export default connect(
      mapStateToProps,
      mapDispatchToProps
    )(Pitch)




























































































    window.onload = function() {

      }

      function error() {
        alert('Stream generation failed.');
      }

      function getUserMedia(dictionary, callback) {
        try {
          navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia;
          navigator.getUserMedia(dictionary, callback, error);
        } catch (e) {
          alert('getUserMedia threw exception :' + e);
        }
      }

      function gotStream(stream) {
        // Create an AudioNode from the stream.
        mediaStreamSource = audioContext.createMediaStreamSource(stream);

        // Connect it to the destination.
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        mediaStreamSource.connect( analyser );
        updatePitch();
      }

        var rafID = null;
        var tracks = null;
        var buflen = 1024;
        var buf = new Float32Array( buflen );

        var noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

        function noteFromPitch( frequency ) {
          var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
          return Math.round( noteNum ) + 69;
        }

        function frequencyFromNoteNumber( note ) {
          return 440 * Math.pow(2,(note-69)/12);
        }

        function centsOffFromPitch( frequency, note ) {
          return Math.floor( 1200 * Math.log( frequency / frequencyFromNoteNumber( note ))/Math.log(2) );
        }


        var MIN_SAMPLES = 0;  // will be initialized when AudioContext is created.
        var GOOD_ENOUGH_CORRELATION = 0.9; // this is the "bar" for how close a correlation needs to be

        function autoCorrelate( buf, sampleRate ) {
          var SIZE = buf.length;
          var MAX_SAMPLES = Math.floor(SIZE/2);
          var best_offset = -1;
          var best_correlation = 0;
          var rms = 0;
          var foundGoodCorrelation = false;
          var correlations = new Array(MAX_SAMPLES);

          for (var i=0;i<SIZE;i++) {
            var val = buf[i];
            rms += val*val;
          }
          rms = Math.sqrt(rms/SIZE);
          if (rms<0.01) // not enough signal
          return -1;

          var lastCorrelation=1;
          for (var offset = MIN_SAMPLES; offset < MAX_SAMPLES; offset++) {
            var correlation = 0;

            for (var i=0; i<MAX_SAMPLES; i++) {
              correlation += Math.abs((buf[i])-(buf[i+offset]));
            }
            correlation = 1 - (correlation/MAX_SAMPLES);
            correlations[offset] = correlation; // store it, for the tweaking we need to do below.
            if ((correlation>GOOD_ENOUGH_CORRELATION) && (correlation > lastCorrelation)) {
              foundGoodCorrelation = true;
              if (correlation > best_correlation) {
                best_correlation = correlation;
                best_offset = offset;
              }
            } else if (foundGoodCorrelation) {
              // short-circuit - we found a good correlation, then a bad one, so we'd just be seeing copies from here.
              // Now we need to tweak the offset - by interpolating between the values to the left and right of the
              // best offset, and shifting it a bit.  This is complex, and HACKY in this code (happy to take PRs!) -
              // we need to do a curve fit on correlations[] around best_offset in order to better determine precise
              // (anti-aliased) offset.

              // we know best_offset >=1,
              // since foundGoodCorrelation cannot go to true until the second pass (offset=1), and
              // we can't drop into this clause until the following pass (else if).
              var shift = (correlations[best_offset+1] - correlations[best_offset-1])/correlations[best_offset];
              return sampleRate/(best_offset+(8*shift));
            }
            lastCorrelation = correlation;
          }
          if (best_correlation > 0.01) {
            // //console.log("f = " + sampleRate/best_offset + "Hz (rms: " + rms + " confidence: " + best_correlation + ")")
            return sampleRate/best_offset;
          }
          return -1;
          //	var best_frequency = sampleRate/best_offset;
        }

        function updatePitch( time ) {
          var cycles = [];
          analyser.getFloatTimeDomainData( buf );
          var ac = autoCorrelate( buf, audioContext.sampleRate );
          // TODO: Paint confidence meter on canvasElem here.

          if (DEBUGCANVAS) {  // This draws the current waveform, useful for debugging
            waveCanvas.clearRect(0,0,512,256);
            waveCanvas.strokeStyle = "red";
            waveCanvas.beginPath();
            waveCanvas.moveTo(0,0);
            waveCanvas.lineTo(0,256);
            waveCanvas.moveTo(128,0);
            waveCanvas.lineTo(128,256);
            waveCanvas.moveTo(256,0);
            waveCanvas.lineTo(256,256);
            waveCanvas.moveTo(384,0);
            waveCanvas.lineTo(384,256);
            waveCanvas.moveTo(512,0);
            waveCanvas.lineTo(512,256);
            waveCanvas.stroke();
            waveCanvas.strokeStyle = "black";
            waveCanvas.beginPath();
            waveCanvas.moveTo(0,buf[0]);
            for (var i=1;i<512;i++) {
              waveCanvas.lineTo(i,128+(buf[i]*128));
            }
            waveCanvas.stroke();
          }

          if (ac === -1) {
            detectorElem.className = "vague";
            pitchElem.innerText = "--";
            noteElem.innerText = "-";
            detuneElem.className = "";
            detuneAmount.innerText = "--";
          } else {
            detectorElem.className = "confident";
            pitch = ac;
            pitchElem.innerText = Math.round( pitch ) ;
            var note =  noteFromPitch( pitch );
            noteElem.innerHTML = noteStrings[note%12];
            var detune = centsOffFromPitch( pitch, note );
            if (detune === 0 ) {
              detuneElem.className = "";
              detuneAmount.innerHTML = "--";
            } else {
              if (detune < 0)
              detuneElem.className = "flat";
              else
              detuneElem.className = "sharp";
              detuneAmount.innerHTML = Math.abs( detune );
            }
          }

          if (!window.requestAnimationFrame)
          window.requestAnimationFrame = window.webkitRequestAnimationFrame;
          rafID = window.requestAnimationFrame( updatePitch );
        }
