<template>
  <div>
    Source
    <video ref="source" muted>No video available</video>
    Fake
    <video ref="dest" autoplay>No video available</video>
    <button v-on:click="loadRTCs">Load RTC</button>
  </div>
</template>

<script>
export default {
  name: 'rtcCamera',

  data: () => ({
    servers: [
      'stun.l.google.com:19302',
      'stun1.l.google.com:19302',
      'stun2.l.google.com:19302',
      'stun3.l.google.com:19302',
      'stun4.l.google.com:19302',
    ],
    peer1: new RTCPeerConnection(/* {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    } */),
    peer1CandidatesQueue: [],

    peer2: new RTCPeerConnection(/* {
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
      ],
    } */),
    peer2CandidatesQueue: [],
  }),

  async mounted() {
    // eslint-disable-next-line no-empty
    while (this.$refs.source.readyState > 3) {}

    // show users camera in video element
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).then((stream) => {
        this.$refs.source.srcObject = stream;
        this.$refs.source.play();

        stream.getTracks().forEach((track) => {
          this.peer1.addTrack(track, stream);
        });
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
    }

    this.peer1.onicecandidate = (event) => {
      if (!this.peer1 || !this.peer1.remoteDescription || !this.peer1.remoteDescription.type) {
        this.peer1CandidatesQueue.push(event.candidate);
        return;
      }

      this.peer1.addIceCandidate(event.candidate).then(() => {
        // eslint-disable-next-line no-console
        console.log('peer1 added ice candidate');
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
    };

    this.peer2.onicecandidate = (event) => {
      if (!this.peer2 || !this.peer2.remoteDescription || !this.peer2.remoteDescription.type) {
        this.peer2CandidatesQueue.push(event.candidate);
        return;
      }

      this.peer2.addIceCandidate(event.candidate).then(() => {
        // eslint-disable-next-line no-console
        console.log('peer2 added ice candidate');
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
    };

    this.peer2.ontrack = (event) => {
      if (event.streams.length === 0) {
        // eslint-disable-next-line no-console
        console.log('ontrack no stream available');
        // eslint-disable-next-line no-console
        console.log(event);
      } else {
        // eslint-disable-next-line prefer-destructuring
        this.$refs.dest.srcObject = event.streams[0];
        // eslint-disable-next-line no-console
        console.log('stream added');
        // eslint-disable-next-line no-console
        console.log(event.streams[0]);
      }
    };

    setInterval(() => {
      // eslint-disable-next-line no-console
      console.log('peer1', this.peer1.connectionState);
      // eslint-disable-next-line no-console
      console.log('peer2', this.peer2.connectionState);

      // check for candicates in queue and add them to connection
      if (this.peer1.connectionState === 'connecting' && this.peer1CandidatesQueue.length !== 0) {
        this.peer1CandidatesQueue.forEach((candidate) => {
          this.peer1.addIceCandidate(candidate).then(() => {
            // eslint-disable-next-line no-console
            console.log('peer1 added ice candidate on state change');
          }).then(() => {
            this.peer1CandidatesQueue.length = 0;
          }).catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
        });
      }

      if (this.peer2.connectionState === 'connecting' && this.peer2CandidatesQueue.length !== 0) {
        this.peer2CandidatesQueue.forEach((candidate) => {
          this.peer2.addIceCandidate(candidate).then(() => {
            // eslint-disable-next-line no-console
            console.log('peer2 added ice candidate on state change');
          }).then(() => {
            this.peer2CandidatesQueue.length = 0;
          }).catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
        });
      }
    }, 1000);

    this.loadRTCs();
  },

  methods: {
    loadRTCs() {
      this.peer1.createOffer({
        offerToReceiveAudio: 1,
        offerToReceiveVideo: 1,
      }).then((offer) => {
        this.peer1.setLocalDescription(offer);
        this.peer2.setRemoteDescription(this.peer1.localDescription).then(() => {
          this.peer2.createAnswer().then((answer) => {
            this.peer2.setLocalDescription(answer).then(() => {
              this.peer1.setRemoteDescription(this.peer2.localDescription).then(() => {
                // eslint-disable-next-line no-console
                console.log('rtc should be done!!!');
              }).catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
              });
            });
          });
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
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
