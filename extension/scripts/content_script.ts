/* global chrome */
import io from 'socket.io-client';

import { CommentJson, StampJson, Stamp } from '@/messages';

const APP_ID = chrome.runtime.id;
const APP_VERSION = chrome.runtime.getManifest().version;

const NOT_FOUND_IMAGE_URL = `chrome-extension://${APP_ID}/images/404.png`;

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
    this.prefetchStamps();
    console.log(`niconico speenya v${APP_VERSION}: connect to ${this.host}`);
  }

  public disconnect(): void {
    this.socket.disconnect();
    console.log(`niconico speenya v${APP_VERSION}: disconnect from ${this.host}`);
  }

  private prefetchStamps(): void {
    fetch(`${this.host}/api/stamps`)
      .then((res) => res.json())
      .then((json) => {
        (json as Stamp[]).forEach((stamp) => {
          new Image().src = `${this.host}/storage/stamps/${stamp.path}`;
        });
      });
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

    const displaying = Array.from(document.querySelectorAll('.niconico_speenya__comment')).flatMap((element) => {
      const node = element as HTMLElement;
      if (node.offsetLeft + node.offsetWidth <= window.innerWidth) {
        return [];
      } else {
        return [
          {
            top: node.offsetTop,
            bottom: node.offsetTop + node.offsetHeight,
          },
        ];
      }
    });

    let top = 0;
    for (let i = 0; i < 10; ++i) {
      top = this.rand(window.innerHeight - node.offsetHeight);
      if (displaying.every((d) => top >= d.bottom || top + node.offsetHeight <= d.top)) break;
    }

    node.style.top = top + 'px';
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
    const url = stamp.url ?? NOT_FOUND_IMAGE_URL;
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
      node.src = NOT_FOUND_IMAGE_URL;
      animation();
    });

    node.src = url.startsWith('/') ? `${this.host}${url}` : url;
  }

  public showWebcam(): void {
    if (this.video !== undefined) return;

    const node = document.createElement('video');

    node.classList.add('niconico_speenya__webcam');
    node.autoplay = true;

    this.video = node;

    this.rootElement().appendChild(node);

    document.addEventListener('fullscreenchange', () => {
      node.remove();
      this.rootElement().appendChild(node);
    });

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

const speenya = new SpeenyaClient(process.env.SERVER_URL!);

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

chrome.runtime.onMessage.addListener((message) => {
  if (message === 'show_webcam') {
    speenya.showWebcam();
  }
});
