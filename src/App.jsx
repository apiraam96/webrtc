import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {

  let servers = {
    iceServers: [
      {
        urls: ['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
      }
    ]
  }

  const remoteVideoRef = useRef()
  const localVideoRef = useRef()
  const pc = useRef(new RTCPeerConnection(servers))

  const [offer, setOffer] = useState('')
  const [answer, setAnswer] = useState('')
  const [recievedSDP, setRecievedSDP] = useState('')
  

  // useEffect((servers) => {
  //   navigator.mediaDevices.getUserMedia({video: true, audio: false})
  //     .then(stream => {
  //       localVideoRef.current.srcObject = stream

  //       stream.getTracks().forEach(track => {
  //         peerConnection.addTrack(track, stream)
  //       })
  //     })
    
  //   const peerConnection = new RTCPeerConnection(servers)
  //   peerConnection.onicecandidate = (event) => {
  //     if (event.candidate) {
  //       console.log(JSON.stringify(event.candidate))
  //       setOffer(JSON.stringify(peerConnection.localDescription))
  //     }
  //   }

  //   peerConnection.ontrack = (event) => {
  //     remoteVideoRef.current.srcObject = event.streams[0]

  //   }

  //   pc.current = peerConnection

    
  // }, [])

  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(stream => {
      localVideoRef.current.srcObject = stream

      stream.getTracks().forEach(track => {
        pc.current.addTrack(track, stream)
      })
    })


  pc.current.onicecandidate = (event) => {
    if (event.candidate) {
      console.log(JSON.stringify(event.candidate))
      setOffer(JSON.stringify(pc.current.localDescription))
    }
  }

  pc.current.ontrack = (event) => {
    remoteVideoRef.current.srcObject = event.streams[0]

  }


  const createOffer = () => {
    pc.current.createOffer()
      .then(sdp => {
        pc.current.setLocalDescription(sdp)
        setOffer(JSON.stringify(sdp))
      })
  }

  const createAnswer = () => {
    pc.current.createAnswer()
      .then(sdp => {
        pc.current.setLocalDescription(sdp)
        setAnswer(JSON.stringify(sdp))
      })
  }

  const setRemoteDescription = () => {
    const sdp = JSON.parse(recievedSDP)
    pc.current.setRemoteDescription(new RTCSessionDescription(sdp))
  }

  // const addCandidate = () => {
  //   const candidate = JSON.parse(iceCandidate)
  //   console.log('Adding ice candidate...', candidate)

  //   pc.current.addIceCandidate(new RTCIceCandidate(candidate))
  // }



  // async function Stream() {
  //   localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false})

  //   localVideoRef.current.srcObject = localStream
  // }

  // Stream()

  // async function createOffer() {
  //   // Initialzing a peer connection with our STUN servers being passed in as an argument
  //   let peerConnection = new RTCPeerConnection(servers)

  //   // Initializing a remote stream
  //   let remoteStream = new MediaStream()
  //   remoteVideoRef.current.srcObject = remoteStream

  //   // Taking the tracks from the local stream and adding each of them to the peer connection
  //   localStream.getTracks().forEach((track) => {
  //     peerConnection.addTrack(track, localStream)
  //   })

  //   // Getting the tracks from our remote peer and adding each of them to the remote stream that'll be playing on the browser
  //   peerConnection.ontrack = async (event) => {
  //     event.streams[0].getTracks().forEach(track => {
  //       remoteStream.addTrack(track)
  //     })
  //   }

  //   // Adding the ice candidates that are received from the STUN servers to the SDP offer - this gets called each time an ice candidate comes in
  //   peerConnection.onicecandidate = async (event) => {
  //     if (event.candidate) {
  //       // Everytime an ice candidate comes in, the offer gets updated, so here I'm just updating the offer state
  //       setOffer(JSON.stringify(peerConnection.setLocalDescription))
  //     }
  //   }

  //   // Creating the SDP offer
  //   let offer = await peerConnection.createOffer()
  //   await peerConnection.setLocalDescription(offer)

  //   setOffer(JSON.stringify(offer))
  //   setPc(peerConnection)
    
  // }

  // async function createAnswer() {
  //   // Initialzing a peer connection with our STUN servers being passed in as an argument
  //   let peerConnection = new RTCPeerConnection(servers)

  //   // Initializing a remote stream
  //   let remoteStream = new MediaStream()
  //   remoteVideoRef.current.srcObject = remoteStream

  //   // Taking the tracks from the local stream and adding each of them to the peer connection
  //   localStream.getTracks().forEach((track) => {
  //     peerConnection.addTrack(track, localStream)
  //   })

  //   // Getting the tracks from our remote peer and adding each of them to the remote stream that'll be playing on the browser
  //   peerConnection.ontrack = async (event) => {
  //     event.streams[0].getTracks().forEach(track => {
  //       remoteStream.addTrack(track)
  //     })
  //   }

  //   // Adding the ice candidates that are received from the STUN servers to the SDP offer - this gets called each time an ice candidate comes in
  //   peerConnection.onicecandidate = async (event) => {
  //     if (event.candidate) {
  //       // Everytime an ice candidate comes in, the offer gets updated, so here I'm just updating the offer state
  //       setAnswer(JSON.stringify(peerConnection.setLocalDescription))
  //     }
  //   }

  //   // Taking the SDP offer that was given and setting it as the remote description
  //   if (!recievedOffer) {
  //     alert('Paste the recieved offer in the textarea')
  //     return;
  //   }

  //   let sdpOffer = JSON.parse(recievedOffer)
  //   await peerConnection.setRemoteDescription(sdpOffer)

  //   // Setting the local description as the answer
  //   let answer = await peerConnection.createAnswer()
  //   await peerConnection.localDescription(answer)

  //   setAnswer(JSON.stringify(answer))
  //   setPc(peerConnection)
  // }

  // async function addAnswer() {
  //   if (!recievedAnswer) {
  //     alert('Paste the recieved answer in the textarea')
  //     return;
  //   }

  //   let sdpAnswer = JSON.parse(recievedAnswer)
  //   console.log('Peer Connection: ', pc)
    
  //   // This just checks if you don't have a remote description currently
  //   if(!pc.currentRemoteDescription) {
  //     pc.setRemoteDescription(sdpAnswer)
  //   }
  //   else (
  //     alert('There is already a connection')
  //   )
  // }

  return (
    <>
    <h1>WebRTC Tech Talk Demo</h1>
    <div className='page'>
      <div className='videos'>
        <div className="container">
          <label>Local Stream</label>
          <video ref={localVideoRef} className='video-player' autoPlay playsInline ></video>
        </div>
        <div className="container">
          <label>Remote Stream</label>
          <video ref={remoteVideoRef} className='video-player' autoPlay playsInline></video>
        </div>
      </div>
      <label>Generated SDP Offer</label>
        <textarea value={offer} />
        <button onClick={() => createOffer()}>Generate Offer</button>
        <hr></hr>
        <label>Add Remote SDP Offer/Answer Here</label>
        <textarea onChange={(e) => setRecievedSDP(e.target.value)}/>
        <button onClick={() => setRemoteDescription()}>Set Remote Description</button>
        <br></br>
        <br></br>
        <br></br>
        <label>Generated SDP Answer</label>
        <textarea value={answer} />
        <button onClick={() => createAnswer()}>Generate Answer</button>
        {/* <br></br>
        <br></br>
        <label>Add Ice Candidate</label>
        <textarea onChange={(e) => setIceCandidate(e.target.value)}/>
        <button onClick={() => addCandidate()}>Add Ice Candidate</button> */}
    </div>
    </>
  )
}

export default App
