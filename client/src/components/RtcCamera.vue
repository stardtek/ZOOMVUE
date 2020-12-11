<template>
  <div class="card m-1">
    <video  class="card-img-top" ref="camera" autoplay>
      No video available
    </video>
    <div class="card-body">
      <h5 class="card-title">{{ user }}</h5>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rtcCamera',

  props: [
    // your username
    /** @type {string} */
    'you',

    // remote users username
    /** @type {string} */
    'user',

    // group ID
    /** @type {string} */
    'group',

    // Should this RTC peer send offer or receive offer from other side?
    /** @type {boolean} */
    'shouldOffer',
  ],

  data: () => ({
    /**
     * Data format send thru websocket to establish RTC connection
     * {
     *   from: string - caller,
     *   to: string - called,
     *   group: string - group id,
     *   type: 'offer | answer | video-ready',
     *   description: RTC localDescription
     * }
     */

    rtcPeer: new RTCPeerConnection({
      iceServers: [
        {
          // STUN servers are needed to establish connection via public IPs
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
            'stun:stun3.l.google.com:19302',
          ],
        },
      ],
    }),

    // sometimes RTC try to add Ice Candidates before remote user is set
    // this triggers error in Chrome, so we queue those candidates and add then later
    // when remote user is set
    rtcPeerCandidatesQueue: [],

    ws: new WebSocket(process.env.VUE_APP_CONFERENCE_WS_URL),
  }),

  mounted() {
    // eslint-disable-next-line no-console
    console.log(this.rtcPeer);

    // Get access to the camera!
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).then((stream) => {
        stream.getTracks().forEach((track) => {
          this.rtcPeer.addTrack(track, stream);
          // eslint-disable-next-line no-console
          console.log(stream);
        });
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
    }

    this.ws.onopen = () => {
      // every pair of users in chat have peer-to-peer connection between them
      this.ws.send(JSON.stringify({
        username: this.you,
        connectTo: this.user,
        group: this.group,
        type: 'video-ready',
      }));

      if (this.shouldOffer) {
        this.sendOffer();
      }
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        // offer came from remote user, send back RTC answer
        case 'offer':
          // eslint-disable-next-line no-console
          console.log(data.description);
          this.rtcPeer.setRemoteDescription(data.description).then(() => {
            this.sendAnswer(data);
          }).catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
          break;

        // answer came from remote user, confirm connection with remote user
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
      // this needs to wait for remote user to be set before you add candidates
      // otherwise Chrome throw errors
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

    // we got video/audio from remote user
    this.rtcPeer.ontrack = (event) => {
      if (event.streams.length === 0) {
        // eslint-disable-next-line no-console
        console.log('ontrack no stream available');
        return;
      }

      // eslint-disable-next-line prefer-destructuring
      this.$refs.camera.srcObject = event.streams[0];
    };

    // TODO this interval should be stopped when camera connection succeeds
    setInterval(() => {
      // eslint-disable-next-line no-console
      console.log('rtcPeer', this.rtcPeer.connectionState);
      // eslint-disable-next-line no-console
      console.log('ice state', this.rtcPeer.iceConnectionState);

      // check for Ice Candidates in queue and add them to connection
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

      if (this.shouldOffer) {
        // for whatever reason offer <-> answer needs to happen a few times...
        this.sendOffer();
      }
    }, 5000);
  },

  methods: {
    /**
     * Send RTC offer to remote user
     */
    sendOffer() {
      this.rtcPeer.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      }).then((offer) => {
        this.rtcPeer.setLocalDescription(offer).then(() => {
          // eslint-disable-next-line no-console
          console.log(this.rtcPeer.localDescription);
          this.ws.send(JSON.stringify({
            from: this.you,
            to: this.user,
            group: this.group,
            type: 'offer',
            description: this.rtcPeer.localDescription,
          }));
          // eslint-disable-next-line no-console
          console.log('rtc offer sent');
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
      });
    },

    /**
     * Send RTC answer to remote user
     * @param data JSON data from remote user
     */
    sendAnswer(data) {
      this.rtcPeer.createAnswer().then((answer) => {
        this.rtcPeer.setLocalDescription(answer).then(() => {
          this.ws.send(JSON.stringify({
            from: this.you,
            to: data.from,
            group: this.group,
            type: 'answer',
            description: answer,
          }));

          // eslint-disable-next-line no-console
          console.log('rtc answer sent');
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
    },
  },
};
</script>

<style scoped>
video {
  width: 100%;
  height: auto;
}
</style>
