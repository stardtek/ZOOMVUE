<template>
  <div>
    <video ref="camera">No video available</video>
  </div>
</template>

<script>
export default {
  name: 'rtcCamera',

  props: [
    /** @type {string} */
    'you',

    /** @type {string} */
    'user',

    /** @type {MediaStream} */
    'cameraStream',

    // 'offer' | 'answer'
    /** @type {string} */
    'rtcType',

    /** @type {boolean} */
    'isFirst',
  ],

  data: () => ({
    servers: [
      'stun.l.google.com:19302',
      'stun1.l.google.com:19302',
      'stun2.l.google.com:19302',
      'stun3.l.google.com:19302',
      'stun4.l.google.com:19302',
    ],
    rtcPeer: new RTCPeerConnection({
      iceServers: [{
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      }],
    }),
    rtcPeerCandidatesQueue: [],

    // peer2: new RTCPeerConnection(/* {
    //   iceServers: [
    //     {
    //       urls: 'stun:stun.l.google.com:19302',
    //     },
    //   ],
    // } */),
    // peer2CandidatesQueue: [],

    ws: new WebSocket(process.env.VUE_APP_CONFERENCE_WS_URL),
  }),

  // FIXME rtcPeer iceConnectionState is stuck in "checking"
  // TODO try adding this to config https://hub.docker.com/r/instrumentisto/coturn
  mounted() {
    // eslint-disable-next-line no-console
    console.log(this.rtcPeer);

    // we have to wait for camera to be defined before we can add stream
    new Promise((resolve) => {
      const timeout = setTimeout(() => {
        if (this.cameraStream !== null) {
          clearTimeout(timeout);
          resolve();
        }
      }, 100);
    }).then(() => {
      this.cameraStream.getTracks().forEach((track) => {
        this.rtcPeer.addTrack(track, this.cameraStream);
      });
    });

    this.ws.onopen = () => {
      if (this.isFirst) {
        this.ws.send(JSON.stringify({
          from: this.you,
          type: 'first-in',
        }));
      } else {
        this.rtcPeer.createOffer({
          offerToReceiveAudio: 1,
          offerToReceiveVideo: 1,
        }).then((offer) => {
          this.rtcPeer.setLocalDescription(offer).then(() => {
            this.sendOffer();
          }).catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
        });
      }
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'offer':
          // eslint-disable-next-line no-console
          console.log(data.description);
          this.rtcPeer.setRemoteDescription(data.description).then(() => {
            this.rtcPeer.createAnswer().then((answer) => {
              this.rtcPeer.setLocalDescription(answer).then(() => {
                this.ws.send(JSON.stringify({
                  from: this.you,
                  to: data.from,
                  type: 'answer',
                  description: answer,
                }));

                // eslint-disable-next-line no-console
                console.log('rtc answer sent');
              });
            });
          });
          break;

        case 'answer':
          this.rtcPeer.setRemoteDescription(data.description).then(() => {
            // eslint-disable-next-line no-console
            console.log('rtc should be done!!!');
            // eslint-disable-next-line no-console
            console.log(data.description);
          }).catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
          break;

        default:
          break;
      }
    };

    this.rtcPeer.onicecandidate = (event) => {
      if (!this.rtcPeer || !this.rtcPeer.remoteDescription
        || !this.rtcPeer.remoteDescription.type) {
        this.rtcPeerCandidatesQueue.push(event.candidate);
        return;
      }

      this.rtcPeer.addIceCandidate(event.candidate).then(() => {
        // eslint-disable-next-line no-console
        console.log('rtcPeer added ice candidate');
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
    };

    this.rtcPeer.ontrack = (event) => {
      if (event.streams.length === 0) {
        // eslint-disable-next-line no-console
        console.log('ontrack no stream available');
        return;
      }

      // eslint-disable-next-line prefer-destructuring
      this.$refs.camera.srcObject = event.streams[0];
    };

    setInterval(() => {
      // eslint-disable-next-line no-console
      console.log('rtcPeer', this.rtcPeer.connectionState);
      // eslint-disable-next-line no-console
      console.log('ice state', this.rtcPeer.iceConnectionState);

      // check for candidates in queue and add them to connection
      if ((this.rtcPeer.connectionState === 'new' || this.rtcPeer.connectionState === 'connecting')
        && this.rtcPeerCandidatesQueue.length !== 0) {
        this.rtcPeerCandidatesQueue.forEach((candidate) => {
          this.rtcPeer.addIceCandidate(candidate).then(() => {
            // eslint-disable-next-line no-console
            console.log('rtcPeer added ice candidate on state change');
          }).then(() => {
            this.rtcPeerCandidatesQueue.length = 0;
          }).catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
        });
      }

      if (this.rtcPeer.connectionState !== 'connected' && this.you !== this.user) {
        this.sendOffer();
      }
    }, 1000);
  },

  methods: {
    sendOffer() {
      this.ws.send(JSON.stringify({
        from: this.you,
        to: this.user,
        type: 'offer',
        description: this.rtcPeer.localDescription,
      }));
      // eslint-disable-next-line no-console
      console.log('rtc offer sent');
      // eslint-disable-next-line no-console
      console.log(this.rtcPeer.localDescription);
    },
  },
};
</script>

<style scoped>
video {
  border-radius: 1px;
  width: 100%;
  height: auto;
}
</style>
