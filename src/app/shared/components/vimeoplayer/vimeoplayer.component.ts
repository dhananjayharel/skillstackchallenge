import { Component, Input, ViewChild, OnInit, OnDestroy} from '@angular/core';
import { AlertService } from '../../services';
import Player from '@vimeo/player';
import { setTimeout } from 'timers';

@Component({
    selector: 'app-vimeoplayer',
    templateUrl: './vimeoplayer.component.html',
    styleUrls: ['./vimeoplayer.component.scss']
})
export class VimeoPlayerComponent  implements OnInit, OnDestroy {

    @ViewChild('player_container') playerContainer;
    @Input() onLoadPlay: boolean;
    @Input() videoId: string;
    @Input() title: string;
    public loading = false;
    private closeResult: string;
    private _player: Player;


    constructor(private alertService: AlertService) {

        this.loading = true;
    }



   ngOnInit () {
    this._loadPlayer();
   }

    private _loadPlayer() {

        const options = {
            id: this.videoId.replace('/videos/', ''),
            height: 250,
            width: 250,
            loop: true
        };
        this._player = new Player(this.playerContainer.nativeElement, options);
        const that = this;
        this._player.on('play', function() {
            that.loading = false;
            this.element.style.width  = '100%';

        });
		this._player.on('loaded', function() {
            this.element.style.width  = '100%';
			this.element.style.height  = this.element.parentElement.parentElement.parentElement.parentElement.clientHeight + 100 +'px';
		})

        if (this.onLoadPlay) {
            this._player.play().then(function() {
            }).catch(function(error) {
                this.alertService.error('Error playing video: ' + error.name);
            });
        }
    }

    ngOnDestroy () {
        this._player.destroy();
    }
}
