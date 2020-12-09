<template>
  <div class="row">
    <div class="col">
      <div class="card mb-3">
        <video ref="camera" autoplay>No video available</video>
        <div class="card-body">
          <h5 class="card-title">{{ isFirst ? firstJoinedUser : user }}</h5>
        </div>
      </div>
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

    // 'offer' | 'answer'
    /** @type {string} */
    'rtcType',

    // someone has to be first so other users have someone to connect to
    /** @type {boolean} */
    'isFirst',
  ],

  data: () => ({
    /**
     * Data format send thru websocket to establish RTC connection
     * {
     *   from: string - caller,
     *   to: string - called,
     *   type: 'answer',
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
            'stun:stun4.l.google.com:19302',
          ],
        },
      ],
    }),

    // sometimes RTC try to add Ice Candidates before remote user is set
    // this triggers error in Chrome, so we queue those candidates and add then later
    // when remote user is set
    rtcPeerCandidatesQueue: [],

    ws: new WebSocket(process.env.VUE_APP_CONFERENCE_WS_URL),

    // username of second person to join the conference, we get it later because first user
    // does not know remote users name so add it after connection
    // this is only used if isFirst == true
    /** @type {string} */
    firstJoinedUser: '',
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
      // first user have to check in so other have someone to connect to
      if (this.isFirst) {
        this.ws.send(JSON.stringify({
          from: this.you,
          type: 'first-in',
        }));
      } else {
        // start connection with remote user
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

      // first user in conference does not have remote user name and please don't try
      // to establish RTC connection with yourself
      if (this.you !== this.user) {
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
            type: 'answer',
            description: answer,
          }));

          // first user in conference does not know remote users name so add it here
          // eslint-disable-next-line vue/no-mutating-props
          if (this.isFirst) this.firstJoinedUser = data.from;

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
  border-radius: 1px;
  width: 100%;
  height: auto;
}
</style>
