# 🔥 Firebase Setup Guide

## ✅ Firebase Configuration Complete!

Your Firebase project **canvus-f9ada** has been configured in the application.

---

## 📋 Configuration Details

```javascript
Project ID: canvus-f9ada
API Key: AIzaSyD117yLxim90JzPd3Nxoj90nsfY82lvbJU
Auth Domain: canvus-f9ada.firebaseapp.com
Storage Bucket: canvus-f9ada.firebasestorage.app
Messaging Sender ID: 395519302240
App ID: 1:395519302240:web:b133c2607a910c819b4105
Measurement ID: G-Z0ERZE6KL9
```

---

## 🚀 Installation Steps

### 1. Install Firebase SDK

```bash
npm install firebase
```

### 2. Copy Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The Firebase keys are already configured in `.env.example`!

### 3. Verify Firebase File

Firebase configuration is in: `src/utils/firebase.ts`

---

## 📁 Firebase Services Enabled

The configuration includes:

- **🔐 Authentication** - User login/signup
- **💾 Firestore Database** - Store generated images
- **📦 Cloud Storage** - Store AI artwork files
- **📊 Analytics** - Track app usage (optional)

---

## 🔧 Usage in Your App

### Import Firebase services:

```typescript
import { db, storage, auth } from '@/utils/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Example: Save image to Firestore
const saveToFirebase = async (imageData) => {
  const docRef = await addDoc(collection(db, 'artworks'), {
    prompt: imageData.prompt,
    imageUrl: imageData.imageUrl,
    timestamp: new Date(),
    userId: auth.currentUser?.uid
  });
  console.log('Saved with ID:', docRef.id);
};

// Example: Upload image to Storage
const uploadImage = async (file) => {
  const storageRef = ref(storage, `artworks/${Date.now()}.png`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
```

---

## 🔒 Firebase Security Rules

### Firestore Rules (Database):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /artworks/{artworkId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Public gallery (read-only)
    match /gallery/{artworkId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /artworks/{fileName} {
      // Allow authenticated users to upload
      allow write: if request.auth != null;
      // Allow anyone to read
      allow read: if true;
    }
  }
}
```

---

## 📊 Firebase Console Access

Manage your Firebase project:

🔗 **Firebase Console**: https://console.firebase.google.com/project/canvus-f9ada

From there you can:
- View database records
- Monitor storage usage
- Check authentication users
- Configure security rules
- View analytics

---

## 🔐 Security Best Practices

1. **✅ API Key is Public**: Firebase API keys are meant to be public in frontend apps
2. **🔒 Use Security Rules**: Protect data with Firestore/Storage rules
3. **👤 Enable Authentication**: Require users to login before saving data
4. **📝 Audit Regularly**: Check Firebase console for unusual activity
5. **💰 Set Budget Alerts**: Monitor Firebase usage to avoid unexpected costs

---

## 💰 Firebase Free Tier Limits

| Service | Free Tier |
|---------|-----------|
| Firestore | 1 GB storage, 50K reads/day |
| Storage | 5 GB, 1 GB downloads/day |
| Authentication | Unlimited |
| Hosting | 10 GB storage, 360 MB/day |

**Perfect for development and small projects!**

---

## 🔄 Migration from localStorage

Your app currently uses `localStorage` (see `src/utils/storage.ts`). To migrate:

### Option 1: Keep Both (Hybrid)
- Use localStorage for offline/demo mode
- Use Firebase when user is authenticated
- Sync data between them

### Option 2: Full Firebase Migration
- Replace localStorage calls with Firestore
- Enable offline persistence in Firebase
- Better for multi-device sync

---

## 🐛 Troubleshooting

### Error: "Firebase not found"
**Solution**: Run `npm install firebase`

### Error: "Permission denied"
**Solution**: Update Firestore security rules in Firebase Console

### Error: "Quota exceeded"
**Solution**: Check Firebase console usage, upgrade plan if needed

### Error: "Network error"
**Solution**: Check internet connection, verify Firebase config is correct

---

## 📚 Next Steps

1. **Install Firebase**: `npm install firebase`
2. **Restart dev server**: `npm run dev`
3. **Test connection**: Check browser console for Firebase initialization
4. **Configure rules**: Set up security rules in Firebase Console
5. **Enable services**: Enable Authentication, Firestore, and Storage

---

## 🎯 Quick Test

Add this to any component to test Firebase:

```typescript
import { db } from '@/utils/firebase';
import { collection, addDoc } from 'firebase/firestore';

const testFirebase = async () => {
  try {
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Firebase is working!',
      timestamp: new Date()
    });
    console.log('✅ Firebase connected! Doc ID:', docRef.id);
  } catch (error) {
    console.error('❌ Firebase error:', error);
  }
};
```

---

**🔥 Your Firebase project is ready to use!**
