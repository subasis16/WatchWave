/**
 * Firebase Services — Direct Firestore operations
 * Replaces Express server API calls so the app can run on Vercel without a backend server.
 */
import { db, auth } from '../firebase';
import {
  collection, doc, setDoc, getDoc, getDocs, addDoc, deleteDoc,
  query, where, orderBy, writeBatch, onSnapshot, updateDoc, serverTimestamp, limit, arrayUnion
} from 'firebase/firestore';


// USER HISTORY
export const addToRecentlyWatched = async (item) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    let history = [];
    if (userSnap.exists()) {
        history = userSnap.data().recentlyWatched || [];
    }

    history = history.filter(v => v.id !== item.id);
    history.unshift({
      id: item.id,
      title: item.title || 'Unknown Title',
      poster: item.poster || item.image || item.backdrop || 'https://via.placeholder.com/200x300',
      timestamp: new Date().toISOString()
    });
    
    // Keep max 20 items
    history = history.slice(0, 20);
    
    await setDoc(userRef, { recentlyWatched: history }, { merge: true });
  } catch (err) {
    console.error('Failed to save to recently watched:', err);
  }
};

// PARTY / WATCH ROOM SERVICES
export const createPartyRoom = async (roomCode, roomPassword = '') => {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');

  const roomRef = doc(db, 'rooms', roomCode);
  const existing = await getDoc(roomRef);
  if (existing.exists()) throw new Error('Room code already taken');

  await setDoc(roomRef, {
    room_password: roomPassword,
    host_id: user.uid,
    created_at: new Date().toISOString(),
    status: 'active',
    participants: [user.uid],
    currentContent: null,
    syncState: { playing: false, progress: 0 },
  });

  return { success: true, room_code: roomCode };
};

export const joinPartyRoom = async (roomCode, password = '') => {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');

  const roomRef = doc(db, 'rooms', roomCode);
  const roomSnap = await getDoc(roomRef);
  if (!roomSnap.exists()) throw new Error('Room not found');

  const roomData = roomSnap.data();
  if (roomData.status !== 'active') throw new Error('Room is no longer active');
  if (roomData.room_password && roomData.room_password !== password) {
    throw new Error('Incorrect room password');
  }

  if (!roomData.participants.includes(user.uid)) {
    await updateDoc(roomRef, {
      participants: arrayUnion(user.uid)
    });
  }

  return { success: true, room_code: roomCode, hostId: roomData.host_id, roomData };
};

export const listenToRoomParticipants = (roomCode, callback) => {
  const roomRef = doc(db, 'rooms', roomCode);
  return onSnapshot(roomRef, async (snap) => {
    if (!snap.exists()) return;
    const participantIds = snap.data().participants || [];
    const participantData = await Promise.all(
      participantIds.map(async (id) => {
        const userDoc = await getDoc(doc(db, 'users', id));
        return { id, ...(userDoc.exists() ? userDoc.data() : { name: 'Unknown User' }) };
      })
    );
    callback(participantData);
  }, (err) => {});
};


// WATCH ROOM REAL-TIME SYNC (replaces Socket.io)


export const updateRoomSync = async (roomCode, syncData) => {
  const roomRef = doc(db, 'rooms', roomCode);
  await updateDoc(roomRef, { syncState: syncData });
};

export const updateRoomContent = async (roomCode, content) => {
  const roomRef = doc(db, 'rooms', roomCode);
  await updateDoc(roomRef, { currentContent: content });
};

export const sendRoomMessage = async (roomCode, message) => {
  const messagesRef = collection(db, 'rooms', roomCode, 'messages');
  await addDoc(messagesRef, {
    ...message,
    timestamp: new Date().toISOString()
  });
};

export const listenToRoomSync = (roomCode, callback) => {
  const roomRef = doc(db, 'rooms', roomCode);
  return onSnapshot(roomRef, (snap) => {
    if (snap.exists()) callback(snap.data());
  }, (err) => {});
};

export const listenToRoomMessages = (roomCode, callback) => {
  const messagesRef = collection(db, 'rooms', roomCode, 'messages');
  const q = query(messagesRef, orderBy('timestamp', 'asc'));
  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(messages);
  }, (err) => {});
};

export const sendReaction = async (roomCode, reaction) => {
  const reactionsRef = collection(db, 'rooms', roomCode, 'reactions');
  await addDoc(reactionsRef, {
    ...reaction,
    timestamp: Date.now(),
    expiry: Date.now() + 3000, // 3 seconds
  });
};

export const listenToReactions = (roomCode, callback) => {
  const reactionsRef = collection(db, 'rooms', roomCode, 'reactions');
  const q = query(reactionsRef, orderBy('timestamp', 'desc'), limit(10));
  return onSnapshot(q, (snap) => {
    const reactions = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(r => r.expiry > Date.now());
    callback(reactions);
  }, (err) => {});
};

// ==========================================
// FRIENDS SERVICES
// ==========================================

export const sendFriendRequest = async (targetUid) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');
  if (user.uid === targetUid) throw new Error('Cannot send request to yourself');

  // Check if already friends
  const friendDoc = await getDoc(doc(db, 'users', targetUid, 'friends', user.uid));
  if (friendDoc.exists()) throw new Error('Already friends');

  // Check if request already sent
  const existingReq = await getDoc(doc(db, 'users', targetUid, 'friendRequests', user.uid));
  if (existingReq.exists()) throw new Error('Friend request already sent');

  // Get sender info
  const senderDoc = await getDoc(doc(db, 'users', user.uid));
  const senderData = senderDoc.data() || {};

  await setDoc(doc(db, 'users', targetUid, 'friendRequests', user.uid), {
    from: user.uid,
    fromName: senderData.name || 'Unknown',
    fromAvatar: senderData.avatar || null,
    status: 'pending',
    timestamp: new Date().toISOString(),
  });

  // Send notification
  await addDoc(collection(db, 'users', targetUid, 'notifications'), {
    message: `${senderData.name || 'Someone'} sent you a friend request!`,
    type: 'friend_request',
    avatar: senderData.avatar || null,
    fromUid: user.uid,
    read: false,
    createdAt: new Date().toISOString(),
  });

  return { success: true };
};

export const getFriendsList = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const snapshot = await getDocs(
      query(collection(db, 'users', user.uid, 'friends'), orderBy('addedAt', 'desc'))
    );
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("Firestore Permission/Fetch error [Friends]:", error);
    return [];
  }
};

export const getAllUsers = async () => {
  try {
    const user = auth.currentUser;
    if (!user) return [];

    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs
      .filter(d => d.id !== user.uid)
      .map(d => ({
        id: d.id,
        name: d.data().name || 'User',
        avatar: d.data().avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(d.data().name || 'User')}&background=random`,
        isOnline: d.data().isOnline || false,
      }));
  } catch (error) {
    console.error("Firestore Permission/Fetch error [AllUsers]:", error);
    return [];
  }
};

// ==========================================
// FEEDBACK / REPORT SERVICES
// ==========================================

export const submitReport = async (roomCode, reason) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');

  await addDoc(collection(db, 'reports'), {
    roomCode: roomCode || 'unknown',
    reason: reason || 'Violation of Community Guidelines',
    reportedBy: user.uid,
    createdAt: new Date().toISOString(),
  });

  return { success: true };
};

// ==========================================
// NOTIFICATIONS
// ==========================================

export const listenToNotifications = (uid, callback) => {
  const q = query(
    collection(db, 'users', uid, 'notifications'),
    orderBy('createdAt', 'desc'),
    limit(20)
  );
  return onSnapshot(q, (snap) => {
    const notifs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(notifs);
  }, (err) => {});
};

// ==========================================
// CONTENT SERVICES
// ==========================================

export const getContentByType = async (type) => {
  try {
    const q = query(collection(db, 'content'), where('type', '==', type), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    return [];
  }
};

export const getAllContent = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'content'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    return [];
  }
};

export const searchContentDirectly = async (searchQuery) => {
  if (!searchQuery) return [];
  try {
    const q = query(
        collection(db, 'content'),
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff'),
        limit(10)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    return [];
  }
};

// ==========================================
// CLIPS SERVICES
// ==========================================

export const saveClip = async (clipData) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');

  const docRef = await addDoc(collection(db, 'clips'), {
    ...clipData,
    userId: user.uid,
    userName: user.displayName || 'Cinema Fan',
    timestamp: new Date().toISOString(),
    views: 0,
    likes: 0
  });
  return { id: docRef.id };
};

export const getClips = async () => {
  try {
    const q = query(collection(db, 'clips'), orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    return [];
  }
};

// ==========================================
// SUBSCRIPTION & CREDITS
// ==========================================

export const updateSubscription = async (planId) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');

  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    subscription: {
      planId,
      status: 'active',
      startDate: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    }
  });
  return { success: true };
};

export const addCredits = async (amount) => {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');

  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const currentCredits = userSnap.exists() ? (userSnap.data().credits || 0) : 0;

  await updateDoc(userRef, {
    credits: currentCredits + amount
  });
  return { success: true, newTotal: currentCredits + amount };
};
