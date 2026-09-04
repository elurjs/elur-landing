---
title: Page Lifecycle
description: IonPage lifecycle hooks — useIonViewWillEnter, useIonViewDidEnter, useIonViewWillLeave, useIonViewDidLeave.
section: Elur Ionic
order: 3
---

# Page Lifecycle

Ionic pages have their own lifecycle hooks on top of Elur's. These hooks fire
when a page enters or leaves the viewport in the `ion-router-outlet` — not
when the component is mounted/unmounted.

## Available hooks

| Hook | When it fires |
| --- | --- |
| `useIonViewWillEnter` | Page is about to enter the viewport |
| `useIonViewDidEnter` | Page has fully entered the viewport (animation complete) |
| `useIonViewWillLeave` | Page is about to leave the viewport |
| `useIonViewDidLeave` | Page has fully left the viewport |

## Usage

Use the helpers inside `onMount` to subscribe to Ionic page lifecycle events:

```typescript
import { ElurComponent, html } from "@elurjs/core";
import { useIonViewWillEnter, useIonViewWillLeave } from "@elurjs/ionic";

class ProfilePage extends ElurComponent {
  override onMount() {
    const offEnter = useIonViewWillEnter(() => {
      console.log("Profile page will enter");
      // Refresh data, start animations, etc.
    });
    const offLeave = useIonViewWillLeave(() => {
      console.log("Profile page will leave");
      // Pause videos, save draft, etc.
    });
    return () => { offEnter(); offLeave(); };
  }

  override render() {
    return html`<ion-page><ion-content><h1>Profile</h1></ion-content></ion-page>`;
  }
}
```

## Elur lifecycle vs Ionic lifecycle

| Elur hook | When | Ionic hook | When |
| --- | --- | --- | --- |
| `onMount` | Component mounted in DOM | `useIonViewWillEnter` | Page about to enter viewport |
| — | — | `useIonViewDidEnter` | Page fully entered viewport |
| `onUnmount` | Component removed from DOM | `useIonViewWillLeave` | Page about to leave viewport |
| — | — | `useIonViewDidLeave` | Page fully left viewport |

The key difference: Elur's `onMount`/`onUnmount` fire when the component is
added/removed from the DOM. Ionic's hooks fire when the page becomes
visible/hidden in the router outlet — the component may still be in the DOM
(cached by the outlet) when `useIonViewWillLeave` fires.

## All four hooks

```typescript
import {
  useIonViewWillEnter,
  useIonViewDidEnter,
  useIonViewWillLeave,
  useIonViewDidLeave,
} from "@elurjs/ionic";

class MyPage extends ElurComponent {
  override onMount() {
    const off1 = useIonViewWillEnter(() => console.log("will enter"));
    const off2 = useIonViewDidEnter(() => console.log("did enter"));
    const off3 = useIonViewWillLeave(() => console.log("will leave"));
    const off4 = useIonViewDidLeave(() => console.log("did leave"));
    return () => { off1(); off2(); off3(); off4(); };
  }
}
```
