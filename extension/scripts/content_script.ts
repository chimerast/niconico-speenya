/* global chrome */
import io from 'socket.io-client';

import { CommentJson, StampJson } from '@/messages';

const APP_ID = chrome.runtime.id;
const APP_VERSION = chrome.runtime.getManifest().version;

class SpeenyaClient {
  private socket: SocketIOClient.Socket;
  private video: HTMLVideoElement | undefined;

  constructor(private readonly host: string) {
    this.socket = io(host, { autoConnect: false });

    this.socket.on('comment', (comment: CommentJson) => this.handleComment(comment));
    this.socket.on('stamp', (stamp: StampJson) => this.handleStamp(stamp));
  }

  public connect(): void {
    this.socket.connect();
    console.log(`niconico speenya v${APP_VERSION}: connect to ${this.host}`);
  }

  public disconnect(): void {
    this.socket.disconnect();
    console.log(`niconico speenya v${APP_VERSION}: disconnect from ${this.host}`);
  }

  private rootElement(): Element {
    return document.fullscreenElement !== null ? document.fullscreenElement : document.body;
  }

  private handleComment(comment: CommentJson): void {
    const body = comment.body;
    const color = comment.color ?? '#000000';
    const size = comment.size ?? 10;
    const duration = comment.duration ?? 2000;
    const easing = comment.easing ?? 'linear';

    const node = document.createElement('div');

    node.classList.add('niconico_speenya__comment');

    node.style.fontSize = size + 'vh';
    node.style.color = color;

    node.textContent = body;

    const root = this.rootElement();
    root.appendChild(node);

    node.style.top = this.rand(window.innerHeight - node.offsetHeight) + 'px';
    node.style.left = window.innerWidth + 'px';

    const keyframes: Keyframe[] = [
      // keyframes
      { left: window.innerWidth + 'px' },
      { left: -node.offsetWidth + 'px' },
    ];

    const options: KeyframeAnimationOptions = {
      duration: (duration * (window.innerWidth + node.offsetWidth)) / window.innerWidth,
      iterations: 1,
      easing,
    };

    const animation = node.animate(keyframes, options);
    animation.onfinish = () => node.remove();
  }

  private handleStamp(stamp: StampJson): void {
    const url = stamp.url ?? `chrome-extension://${APP_ID}/images/404.png`;
    const duration = stamp.duration ?? 1000;
    const easing = 'ease';

    const node = document.createElement('img');

    node.classList.add('niconico_speenya__stamp');

    const animation = () => {
      const root = this.rootElement();
      root.appendChild(node);

      node.style.left = this.rand(window.innerWidth) - node.width / 2 + 'px';
      node.style.top = this.rand(window.innerHeight) - node.height / 2 + 'px';

      const keyframes: Keyframe[] = [
        // keyframes
        { opacity: 0.0, transform: 'scale(0.2, 0.2) translate(0, 20px)' },
        { opacity: 1.0, transform: 'scale(0.5, 0.5) translate(0, 0px)' },
        { opacity: 0.0, transform: 'scale(1.0, 1.0) translate(0, -50px)' },
      ];

      const options: KeyframeAnimationOptions = {
        duration,
        iterations: 1,
        easing,
      };

      const animation = node.animate(keyframes, options);
      animation.onfinish = () => node.remove();
    };

    node.addEventListener('load', () => animation());
    node.addEventListener('error', () => {
      node.src = `chrome-extension://${APP_ID}/images/404.png`;
      animation();
    });

    node.src = url.startsWith('/') ? `${this.host}${url}` : url;
  }

  public showWebcam(): void {
    if (this.video !== undefined) return;

    const node = document.createElement('video');

    this.video = node;

    node.autoplay = true;
    node.style.position = 'fixed';
    node.style.bottom = '1vh';
    node.style.right = '1vh';
    node.style.width = '32vh';
    node.style.height = '18vh';
    node.style.zIndex = '2147483647';

    let root = this.rootElement();
    root.appendChild(node);

    document.onfullscreenchange = () => {
      node.remove();
      root = this.rootElement();
      root.appendChild(node);
    };

    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: 1280,
          height: 720,
        },
      })
      .then((stream) => {
        node.srcObject = stream;
      });
  }

  public hideWebcam(): void {
    if (this.video === undefined) return;

    this.video.remove();
    this.video = undefined;
  }

  private rand(max: number) {
    return Math.floor(max * Math.random());
  }
}

const speenya = new SpeenyaClient(process.env.SERVER_URL || 'http://localhost:2525');

chrome.storage.sync.get({ enabled: true }, (items) => {
  if (items.enabled) {
    speenya.connect();
  } else {
    speenya.disconnect();
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== 'sync') return;

  if (changes.enabled) {
    if (changes.enabled.newValue) {
      speenya.connect();
    } else {
      speenya.disconnect();
    }
  }
});