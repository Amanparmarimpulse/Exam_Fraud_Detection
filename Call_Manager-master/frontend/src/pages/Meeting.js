import { ZoomMtg } from '@zoomus/websdk';
import '../App.css'
// import ZoomMtg from '@zoomus/websdk'

// ZoomMtg.setZoomJSLib('https://source.zoom.us/2.10.1/lib', '/av');
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();
// // loads language files, also passes any error messages to the ui
// ZoomMtg.i18n.load('en-US');
// ZoomMtg.i18n.reload('en-US');

export default function Meeting() {

  // setup your Meeting SDK auth endpoint here: https://github.com/zoom/meetingsdk-sample-signature-node.js
  var authEndpoint = 'http://localhost:4000'
  // This sample app has been updated to use Meeting SDK credentials https://marketplace.zoom.us/docs/guides/build/sdk-app
  var sdkKey = 'Q76NcnY5TXmSyBwodgWuyQ'
  var meetingNumber = '81782964667'
  var passWord = 'X72Qmc'
  var role = 0
  var userName = 'Sparsh'
  var userEmail = 'sparshprojects12@gmail.com'
  // pass in the registrant's token if your meeting or webinar requires registration. More info here:
  // Meetings: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/meetings#join-registered
  // Webinars: https://marketplace.zoom.us/docs/sdk/native-sdks/web/client-view/webinars#join-registered
  var registrantToken = ''
  var zakToken = ''
  var leaveUrl = 'http://localhost:3000'

  function getSignature(e) {
    e.preventDefault();

    fetch(authEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        meetingNumber: meetingNumber,
        role: role
      })
    }).then(res => res.json())
    .then(response => {
      console.log(response.signature)
      startMeeting(response.signature)
    }).catch(error => {
      console.error(error)
    })
  }

  function startMeeting(signature) {
    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      leaveUrl: leaveUrl,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          sdkKey: sdkKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          userName: userName,
          userEmail: userEmail,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  return (
    <div >
      <main>
        <h1>Zoom Meeting SDK Sample React</h1>

        <button onClick={getSignature}>Join Meeting</button>
      </main>
    </div>
  );
}


// function MeetingView() {
//     // ZoomMtg.setZoomJSLib('https://source.zoom.us/2.10.1/lib', '/av');
//     // ZoomMtg.preLoadWasm();
//     // ZoomMtg.prepareWebSDK();
//     // // loads language files, also passes any error messages to the ui
//     // ZoomMtg.i18n.load('en-US');
//     // ZoomMtg.i18n.reload('en-US');
//     return (
//         <div>Meeting</div>
//     )
// }

// export default MeetingView