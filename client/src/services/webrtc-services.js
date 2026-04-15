import { db, auth } from '../firebase';
import { collection, doc, setDoc, onSnapshot, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

export class WebRTCManager {
  constructor(roomCode, onTrackAdded) {
    this.roomCode = roomCode;
    this.onTrackAdded = onTrackAdded;
    this.localStream = null;
    this.peerConnections = {}; // Map of uid -> RTCPeerConnection
    this.unsubscribes = [];
  }

  async startLocalAudio() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      return true;
    } catch (e) {
      console.error('Microphone access denied or error:', e);
      return false;
    }
  }

  stopLocalAudio() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    // Close all peer connections
    Object.values(this.peerConnections).forEach(pc => pc.close());
    this.peerConnections = {};
    this.unsubscribes.forEach(unsub => unsub());
  }

  toggleMicrophone() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }
}
