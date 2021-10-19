import { Component } from "@angular/core";
import { Observable, fromEvent } from 'rxjs'
import { buffer, debounceTime, map, filter} from 'rxjs/operators';
import { interval } from 'rxjs';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "CodeSandbox";

  timeValue:string = `00:00:00`
  time:number = 0;
  started:boolean = false;

  ngAfterViewInit() {
    const source = interval(1000);
    
    const subscription = source.subscribe((x:any) => {
      if (!this.started) return;
      this.time++;
      console.log( this.time);
      this.timeValue =
        ('0' + Math.floor((this.time / 360) % 60)).slice(-2) +
        ':' +
        ('0' + Math.floor((this.time / 60) % 60)).slice(-2) +
        ':' +
        ('0' + Math.floor(this.time % 60)).slice(-2);
    });

    fromEvent(document.querySelectorAll('#startBtn'), 'click').subscribe((e) => {
      this.started = true;
    });
    fromEvent(document.querySelectorAll('#stopBtn'), 'click').subscribe((e) => {
      this.started = false;
      this.time = 0;
      this.timeValue = `00:00:00`
    });
    fromEvent(document.querySelectorAll('#resetBtn'), 'click').subscribe((e) => {
      this.time = 0;
      this.timeValue = `00:00:00`
    });

    const mouse$ = fromEvent(document.querySelectorAll('#waitBtn'), 'click')

    const buff$ = mouse$.pipe(
      debounceTime(250),
    )

    const click$ = mouse$.pipe(
      buffer(buff$),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2),
    )

    click$.subscribe(() => {
      this.started = false;
    })
      
  }  
}
