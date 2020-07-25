import {
    Component,
    Input,
    OnInit,
    OnChanges,
    AfterViewInit,
    ViewChild,
    SimpleChanges,
    SimpleChange
} from '@angular/core';
import {
    OnlineTest
} from 'models';
import {
    SharedtestactionsService
} from '../../sharedtestactions.service';
import {
    OnlineTestService,
    AlertService,
    CandidateService
} from './../../../../shared';
import {
    NgbModal,
    ModalDismissReasons
} from '@ng-bootstrap/ng-bootstrap';
import {
    Router
} from '@angular/router';

@Component({
    selector: 'app-test-description',
    templateUrl: './test-description.component.html',
    styleUrls: ['./test-description.component.scss']
})
export class TestDescriptionComponent implements OnChanges, OnInit, AfterViewInit {
    @Input() public onlineTest: OnlineTest;
    @Input() public activeTab: String;
    private closeResult: string;
    private testSummaryStatus = true;
    private animationClass = 'fadeIn';
    private modalReference: any;
    private candidateAmiId: any;
    private candidateFilter = 'all';
    public loading = false;
    public videoTabTitle = 'Video Interview Questions';
    public mcqTabTitle = 'Multiple Choice Questions';
    @ViewChild('cloneTestModal') cloneModal: any;
    @ViewChild('inviteCandidateModal') inviteCandidateModal: any;
    @ViewChild('launchMachineModal') launchMachineModal: any;
    @ViewChild('previewonMobile') previewonMobile: any;
    @ViewChild('t') t;

    constructor(private _sharedService: SharedtestactionsService,
        private alertService: AlertService,
        private modalService: NgbModal,
        private onlineTestService: OnlineTestService,
        private candidateService: CandidateService,
        private router: Router) {
        this._sharedService.activeTest$.subscribe(
            data => {
                this.onlineTest = data;
                if (this.onlineTest['hideVideoTab']) {
                    this.videoTabTitle += '-- Not Active';
                }
                if (this.onlineTest['hideMcqTab']) {
                    this.mcqTabTitle += '-- Not Active';
                }
                console.log(data);
                this.triggerAnimation();
                if (!this.onlineTest['candidates']) {
                    this._prepareCandidateFetchList();
                }
            });
    }

    ngOnInit() {
        if (!this.onlineTest['candidates']) {
            this._prepareCandidateFetchList();
        }
    }

    ngAfterViewInit() {
        if (this.activeTab === 'candidates') {
            this.triggerCandidatePanelVisibility();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
        // console.log(this.onlineTest['candidates']);
    }

    triggerAnimation() {
        this.animationClass = '';
        const that = this;
        setTimeout(function () {
            that.animationClass = 'fadeIn';
        }, 10);
    }

    openInviteCandidateModal() {
        let currentUser = JSON.parse(localStorage.getItem('currentUserData'));
        console.log(currentUser)
        let currentTime = Math.floor(Date.now() / 1000);
        if (currentUser.activePlan
          && currentUser.activePlan.endTime > currentTime
          && currentUser.activePlan.inviteUserCount > 0) {
            this.openModal(this.inviteCandidateModal, {});
        } else {
          this.alertService.error('You dont have an active plan. Please upgrade your plan to start inviting the candidates.');
          this.router.navigate(['/price-plan']);
        }
    }

    openPreviewMachineModal() {
        this.openModal(this.launchMachineModal, {});
    }

    openCloneTestModal() {
        this.openModal(this.cloneModal, {});
    }

    openModal(content, _options) {
        this.modalReference = this.modalService.open(content, _options);
        this.modalReference.result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    onDelete(testId: number) {

        const r = confirm('Are you sure you want to delete this test:' + this.onlineTest.name + '?');
        if (r === true) {
            this.onlineTestService.delete(testId)
                .subscribe(
                    data => {
                        this.router.navigate(['/test']);
                        this.alertService.success('The test ' + this.onlineTest.name + ' was deleted successfully.');
                        //this._sharedService.refresh();

                    },
                    error => {
                        const err = JSON.parse(error._body);
                        this.alertService.error(err.error.message);
                    });
        }
    }

    clone(cloneName) {
        //const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const data = {
            testid: this.onlineTest.id,
            //envid: this.onlineTest.envId,
            //userid: currentUser.userId,
            onlinetestname: cloneName.value
        }

        this.onlineTestService.clone(data)
            .subscribe(response => {
                console.log(response);
                this.alertService.success('The online test is cloned successfully');
                this._sharedService.refresh();
            });
    }

    ifCandidateInvite(event) {
        console.log(event);
        if (event === 'complete') {
            this.modalReference.close();
            this._prepareCandidateFetchList();
        }
    }

    triggerCandidatePanelVisibility() {
        this.t.select('candidates');
    }

    goBack() {
        // this._sharedService.setSidebarVisibility(true);
        this.router.navigate(['/test']);
    }

    showCandidatesPanel() {
        // this._sharedService.setSidebarVisibility(true);
        // this.testSummaryStatus = false;
    }

    ifCandidatePanelOpen($event) {
        console.log('ifCandidatePanelOpen');
        this.showCandidatesPanel();
    }

    ifCandidatePanelClosed($event) {
        console.log('ifCandidatePanelClosed');
        // this.testSummaryStatus = true;
        // this._sharedService.setSidebarVisibility(false);
        // this.t.select('test-description');
    }

    ifResendInvite($event) {
        console.log('ifResendInvite');
        console.log($event);
    }

    _prepareCandidateFetchList() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser.userId) {
            const filter = {
                'where': {
                    'onlineTestId': this.onlineTest.id
                }
            };
            this.fetchCandidates(filter);
        }
    }

    fetchCandidates(filter = null) {

        this.candidateService.getAll(filter)
            .subscribe(
                data => {
                    console.log(data);
                    for (let i = 0; i < data.length; i++) {
                        data[i].isSolutionViewed = false;
                        if (data[i].AmiId) {
                            this.candidateAmiId = data[i].AmiId;
                        }
                    }
                    this.onlineTest['candidates'] = data;
                },
                error => {
                    const err = JSON.parse(error._body);
                    this.alertService.error(err.error.message);
                });
    }

    previewTest() {
      let msg = 'Launch a preview for this test?\nThis will boot up a machine for you to go through the complete candidate experience for this test.';
      if (this.onlineTest.isWebBasedTest) {
        msg = 'Launch a preview for this test?';
      }
        const r = confirm(msg);
        if (r === true) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            window.open("http://www.skillstack.com/embedchallenges/?courseid=java21ssh&examplepath=echotest&challenge=" + this.onlineTest.id + "&&loggedin=false", '_blank');

        }
    }

    previewOnMobile() {
        this.openModal(this.previewonMobile, {});
    }

    openCandidate($event) {
        this.candidateFilter = $event;
        this.triggerCandidatePanelVisibility();
    }

    resetFilter() {
        const _filter = {
            where: {
                category: '',
                name: ''
            },
            order: 'created ASC'
        }
        this._sharedService.setTestFilter(_filter);
    }
}
