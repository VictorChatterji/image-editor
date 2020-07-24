import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ImageService } from './image.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  private onDestroy = new Subject<void>();
  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;
  context: CanvasRenderingContext2D;
  images: Array<any>;
  get canvasRef(): any {
    return this.myCanvas.nativeElement;
  }
  // create off screen canvas for blurring sides
  bCanvas: any;
  bContext: CanvasRenderingContext2D;
  selectedAspectRatio = 'potrait';
  message: string;
  textCtrl: FormControl = new FormControl();
  fillStrokeCtrl: FormControl = new FormControl();
  fillOrStroke = 'Fill';
  constructor(
    private imageService: ImageService
  ) {
    this.imageService.imageList()
      .pipe(
        takeUntil(this.onDestroy)
      )
      .subscribe(
        (res: Array<any>) => {
          this.images = res; // can be paginated but for rendering images fast I sliced 12
        },
        (err: string) => {
          alert(err);
        }
      );
    this.textCtrl
      .valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(
        (data: string) => {
          if (!data) {
            return;
          }
          this.message = data;
          this.drawScreen();
        }
      );
    this.fillStrokeCtrl
      .valueChanges
      .pipe(
        takeUntil(this.onDestroy)
      )
      .subscribe(
        (data: string) => {
          if (!data || !this.message) {
            return;
          }
          this.fillOrStroke = data;
          this.drawScreen();
        }
      );
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef;
    this.context = canvas.getContext('2d');
    this.bCanvas = canvas.cloneNode();
    this.bContext = this.bCanvas.getContext('2d');
    this.setAspectRatio('potrait');
  }

  drag(ev: DragEvent) {
    ev.dataTransfer.setData('text', (ev.target as HTMLImageElement).id);
  }

  allowDrop(ev: DragEvent) {
    ev.preventDefault();
  }

  drop(ev: DragEvent) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData('text');
    this.draw(data);
  }

  draw(id: string) {
    const img = new Image();
    img.onload = () => {
      const canvas = this.canvasRef;
      this.scaleToFill(img, this.bCanvas);
      this.fitImageOn(canvas, img);
    };
    img.src = (document.getElementById(id) as HTMLImageElement).src;
  }

  scaleToFill(img: any, bcanvas: HTMLCanvasElement) {
    this.bContext.filter = 'blur(4px)';
    // get the scale
    const scale = Math.max(bcanvas.width / img.width, bcanvas.height / img.height);
    // get the top left position of the image
    const x = (bcanvas.width / 2) - (img.width / 2) * scale;
    const y = (bcanvas.height / 2) - (img.height / 2) * scale;
    this.bContext.drawImage(img, x, y, img.width * scale, img.height * scale);
    // this.context.globalCompositeOperation = 'destination-atop';
    const bscale = Math.max(this.canvasRef.width / bcanvas.width, this.canvasRef.height / bcanvas.height);
    // get the top left position of the image
    const p = (this.canvasRef.width / 2) - (bcanvas.width / 2) * bscale;
    const q = (this.canvasRef.height / 2) - (bcanvas.height / 2) * bscale;
    this.context.drawImage(bcanvas, p, q, bcanvas.width * bscale, bcanvas.height * bscale);
  }

  fitImageOn(canvas: HTMLCanvasElement, img: HTMLImageElement) {
    const imageAspectRatio = img.width / img.height;
    const canvasAspectRatio = canvas.width / canvas.height;
    let renderableHeight: number;
    let renderableWidth: number;
    let xStart: number;
    let yStart: number;
    // If image's aspect ratio is less than canvas's we fit on height
    // and place the image centrally along width
    if (imageAspectRatio < canvasAspectRatio) {
      renderableHeight = canvas.height;
      renderableWidth = img.width * (renderableHeight / img.height);
      xStart = (canvas.width - renderableWidth) / 2;
      yStart = 0;
    } else if (imageAspectRatio > canvasAspectRatio) {
      // If image's aspect ratio is greater than canvas's we fit on width
      // and place the image centrally along height
      renderableWidth = canvas.width;
      renderableHeight = img.height * (renderableWidth / img.width);
      xStart = 0;
      yStart = (canvas.height - renderableHeight) / 2;
    } else { // Happy path - keep aspect ratio
      renderableHeight = canvas.height;
      renderableWidth = canvas.width;
      xStart = 0;
      yStart = 0;
    }
    this.context.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
  }


  setAspectRatio(orient: string) {
    this.selectedAspectRatio = orient;
    const canvas = this.canvasRef;
    const ballParkFigure = 250;
    if (orient === 'potrait') {
      canvas.width = ballParkFigure;
      canvas.height = canvas.width * (16 / 9);
    } else {
      canvas.height = ballParkFigure;
      canvas.width = canvas.height * (16 / 9);
    }
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, canvas.width, canvas.height);

  }


  // drawText() {
  //   this.context.font = '50px serif';
  //   this.context.fillStyle = '#ff0000';
  //   this.context.fillText('Hello World', 100, 80);
  // }

  drawScreen() {
    // Background
    this.context.fillStyle = '#ffffaa';
    this.context.fillRect(0, 0, this.canvasRef.width, this.canvasRef.height);

    // Box
    this.context.strokeStyle = '#000000';
    this.context.strokeRect(5, 5, this.canvasRef.width - 10, this.canvasRef.height - 10);

    // Text
    this.context.font = '50px serif';
    const metrics = this.context.measureText(this.message);
    const textWidth = metrics.width;
    const xPosition = (this.canvasRef.width / 2) - (textWidth / 2);
    const yPosition = (this.canvasRef.height / 2);
    debugger;
    switch (this.fillOrStroke) {
      case 'Fill':
        this.context.fillStyle = '#FF0000';
        this.context.fillText(this.message, xPosition, yPosition);
        break;
      case 'Stroke':
        this.context.strokeStyle = '#FF0000';
        this.context.strokeText(this.message, xPosition, yPosition);
        break;
      case 'Both':
        this.context.fillStyle = '#FF0000';
        this.context.fillText(this.message, xPosition, yPosition);
        this.context.strokeStyle = '#000000';
        this.context.strokeText(this.message, xPosition, yPosition);
        break;
    }
  }


}
