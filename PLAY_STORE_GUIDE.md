# Publishing KalpDev PG to Google Play Store

Your app is a Capacitor Android app that loads your live site (kalpdevpg.online).
Follow these steps to publish it.

## Prerequisites (one-time setup)

### 1. Install Android Studio
- Download from https://developer.android.com/studio
- During install, it bundles the JDK and Android SDK (everything needed)
- Open Android Studio once so it finishes downloading SDK components

### 2. Create a Google Play Developer Account
- Go to https://play.google.com/console
- Pay the one-time $25 registration fee
- Complete identity verification (can take 1-2 days)

## Building the Signed App Bundle (AAB)

### Step 1: Generate a signing key (one-time)
Open a terminal inside `android/app/` and run (needs JDK from Android Studio):

```
keytool -genkey -v -keystore kalpdev-release.keystore -alias kalpdev -keyalg RSA -keysize 2048 -validity 10000
```

- It asks for a password — REMEMBER IT (you need it for every future update)
- Fill in name/org details (can be basic)
- This creates `kalpdev-release.keystore` in `android/app/`

### Step 2: Create keystore.properties
Create a file `android/keystore.properties` with:

```
storeFile=app/kalpdev-release.keystore
storePassword=YOUR_KEYSTORE_PASSWORD
keyAlias=kalpdev
keyPassword=YOUR_KEY_PASSWORD
```

(This file is gitignored so your key stays private.)

### Step 3: Build the AAB
Open the `android` folder in Android Studio, then:
- Menu: **Build → Generate Signed Bundle / APK**
- Choose **Android App Bundle**
- Select your keystore file and enter passwords
- Choose **release** build variant
- The AAB is created at: `android/app/release/app-release.aab`

OR from terminal inside `android/`:
```
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Uploading to Play Store

1. Go to https://play.google.com/console
2. Click **Create app** — fill name (KalpDev PG), language, type (App), free/paid
3. Complete the required sections:
   - **App content**: privacy policy URL, data safety form
   - **Store listing**: description, screenshots (phone screenshots of your app), app icon (512x512), feature graphic (1024x500)
   - **Content rating** questionnaire
   - **Target audience**
4. Go to **Production → Create new release**
5. Upload the `app-release.aab`
6. Add release notes
7. Submit for review (takes a few hours to a few days)

## Updating the App Later
When you make website changes — they show automatically (app loads live site).
Only rebuild/re-upload the AAB if you change the app icon, name, or native settings.
For each new upload, increase `versionCode` in `android/app/build.gradle`.

## App Assets Needed for Listing
- App icon: 512 x 512 px PNG
- Feature graphic: 1024 x 500 px
- At least 2 phone screenshots
- Short description (max 80 chars)
- Full description (max 4000 chars)
- Privacy policy URL (required)
