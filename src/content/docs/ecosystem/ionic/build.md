---
title: Capacitor Build
description: Build and deploy Elur Ionic apps to iOS and Android with Capacitor.
section: Elur Ionic
order: 4
---

# Capacitor Build

Pair Elur Ionic with Capacitor for native device features and app store
deployment.

## Installation

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
```

## Build flow

1. Build your Elur app:

```bash
elur-kit build
```

1. Sync the build output to native projects:

```bash
npx cap sync
```

1. Open in native IDE:

```bash
npx cap open ios     # opens Xcode
npx cap open android # opens Android Studio
```

## Configuration

In `capacitor.config.ts`:

```typescript
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.myapp",
  appName: "My App",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
```

## Native plugins

Install Capacitor plugins for device features:

```bash
npm install @capacitor/camera @capacitor/geolocation @capacitor/haptics
```

Use them in your app:

```typescript
import { Camera, CameraResultType } from "@capacitor/camera";

const takePhoto = async () => {
  const photo = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    quality: 80,
  });
  return photo.webPath;
};
```

## Platform-specific code

Use `isSSR()` or platform detection to conditionally run native code:

```typescript
import { isSSR } from "@elurjs/kit/island";

if (!isSSR()) {
  const { Geolocation } = await import("@capacitor/geolocation");
  const pos = await Geolocation.getCurrentPosition();
}
```

## App store deployment

### iOS

1. Open Xcode: `npx cap open ios`
2. Configure signing & capabilities
3. Archive and upload to App Store Connect

### Android

1. Open Android Studio: `npx cap open android`
2. Configure signing config
3. Build > Generate Signed Bundle/APK

## Live reload during development

```bash
npx cap run ios --live-reload --external
```

This reloads the native app when you change your Elur app's source code.
