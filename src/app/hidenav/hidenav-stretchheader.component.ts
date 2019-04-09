import {
    AfterViewInit,
    Component,
    ContentChild,
    ElementRef,
    OnInit,
    Input,
    EventEmitter,
    Output,
    ContentChildren,
    QueryList, HostBinding
} from '@angular/core';
import {IonContent} from '@ionic/angular';
import {HidenavShService} from './hidenav-sh-service.service';

@Component({
    selector: 'hidenav-stretchheader',
    template: `
        <style>
            .overlay {
                position: absolute;
                height: inherit;
                width: inherit;
                z-index: 101;
                pointer-events: none;
                /*opacity: var(--opacity);*/
                background: var(--color);
                filter: opacity(0);
                --opacity: 0;
                --color: black;
            }

            :host {
                z-index: 1;
            }

            :host.md {
                -webkit-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.53);
                -moz-box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.53);
                box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.53);
            }

            :host.ios {
                border-bottom: 1px solid #5a5e63;
            }
        </style>
        <div class="overlay"></div>
        <ng-content></ng-content>
    `
})
export class HidenavStretchheaderComponent implements OnInit, AfterViewInit {
    @ContentChild('shrinkexpand', {read: ElementRef}) header: ElementRef;
    @ContentChildren('static', {read: ElementRef}) static: any;
    @HostBinding('class') class: any;
    @Input('hidenav-sh-header') name: string;
    @Input('no-border') noBorder: string;
    @Input('header-height') dummy: any;
    @Input('init-expanded') dummy1: any;
    @Input('opacity-color') dummy2: any;
    @Input('opacity-factor') dummy3: any;
    @Input('preserve-header') dummy4: any;

    @Output() scroll: EventEmitter<number> = new EventEmitter<number>();

    constructor(public el: ElementRef, public globals: HidenavShService) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {

        if (typeof this.globals.data[this.name] == 'undefined' || this.globals.data[this.name] == null)
            this.globals.data[this.name] = [];
        if (this.globals.data[this.name].header != null)
            console.warn('HIDENAV: "' + this.name + '" has been initialized before as SH-HEADER, please make sure all your live directives carry unique names in order to avoid unexpected results');
        this.globals.data[this.name].header = this.header;
        this.globals.data[this.name].static = this.static;
        this.globals.initiate(this.name);
        this.globals.scroll.subscribe(res => {
            if (res.name == this.name) {
                this.scroll.emit(res.height);
            }
        });
        if (this.noBorder != 'true') {
            let mode = document.querySelector('html').getAttribute('mode');
            setTimeout(() => {
                if (typeof this.class == 'undefined') {
                    this.class = mode;
                } else {
                    this.class += ' ' + mode;
                }
            }, 0);
        }
    }

    expand(duration = 200) {
        this.globals.expand(this.name, duration);
    }

    shrink(duration = 200) {
        this.globals.shrink(this.name, duration);
    }

    toggle(duration = 200) {
        this.globals.toggle(this.name, duration);
    }


}
