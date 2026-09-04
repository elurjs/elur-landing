---
title: Ionic Overview
description: Mobile app development with @elurjs/ionic — setup, components, and platform theming.
section: Elur Ionic
order: 1
---

# Ionic Overview

`@elurjs/ionic` brings the Ionic UI toolkit to Elur. Build cross-platform
mobile apps with native-feeling components, stack-based navigation, and
platform-specific theming — all using Elur's signals and tagged templates.

## Installation

```bash
npm install @elurjs/core @elurjs/ionic
```

## Setup

Initialize Ionic components and icons with `setupElurIonic`:

```typescript
import { setupElurIonic } from "@elurjs/ionic";

const handle = setupElurIonic({
  components: ["ion-app", "ion-page", "ion-content", "ion-button", "ion-input"],
  icons: { /* icon name → svg string */ },
});

// Later, if needed:
// handle.dispose();
```

`setupElurIonic` registers the custom elements and loads ionicons. It returns
a handle with a `dispose()` method for cleanup.

## Components

Use Ionic web components directly in templates:

```typescript
import { html } from "@elurjs/core";

html`
  <ion-app>
    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Welcome</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-input placeholder="Enter your name" />
          <ion-button>Submit</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-app>
`;
```

## Theming

Elur Ionic supports platform-specific theming (iOS vs Material Design) via CSS
variables:

```css
:root {
  --ion-color-primary: #3432c8;
  --ion-color-primary-rgb: 52, 50, 200;
  --ion-color-primary-contrast: #ffffff;
}
```

## Next steps

- [Navigation](/docs/ecosystem/ionic/navigation/) — IonRouterOutlet, back button, bottom tabs
- [Page Lifecycle](/docs/ecosystem/ionic/lifecycle/) — IonPage hooks
- [Capacitor Build](/docs/ecosystem/ionic/build/) — iOS/Android builds with Capacitor
