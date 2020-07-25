import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Socket } from 'ng-socket-io';

@Injectable()
export class PushNotificationService {
    private currentUserId = localStorage.getItem('currentUser');

    constructor(private socket: Socket) {}

    initializeConnection(publicIp: string) {
        this.socket
        .emit('createRoom', { ip: publicIp });
        console.log('initiated connection....(createroom for '+publicIp+')');
    }

    initializeCandidateConnection(obj: any) {
        this.socket
        .emit('createRoom', obj);
        console.log('initiated Candiate connection....');
        console.log(obj);
    }

    getMessage() {
        return this.socket
            .fromEvent<any>('msg')
            .map(data => data.msg);
    }

    invokeGitCheckout (obj: any) {
        this.socket
            .emit('sendGitCheckout',
                { ip: obj.publicIp,
                branch: obj.branchName,
                clientSocketid: this.socket.ioSocket.json.id,
                sender:  this.currentUserId,
                'candidateName': obj.candidateName,
                'result': obj.result,
                'testId': obj.testId,
				'testName':obj.testName});
        console.log(obj + ' -> sent');
    }

    emitTestData (obj: any) {
        obj.clientSocketid = this.socket.ioSocket.json.id;
        this.socket
        .emit('emitTestData',
            obj);
        console.log(obj + ' -> sent');
    }

    triggerFinishTest(obj) {
        obj.clientSocketid = this.socket.ioSocket.json.id;
        this.socket
        .emit('triggerFinishTest',
            obj);
        console.log(obj + ' -> triggerFinishTest sent to clientsocketid='+this.socket.ioSocket.json.id);
    }

    // HANDLER
    onGitCheckoutStatusAck() {
        return Observable.create(observer => {
        this.socket.on('gitCheckoutStatus', obj => {
            observer.next(obj);
        });
        });
    }

    onCandidateMachineSetupComplete() {
        return Observable.create(observer => {
        this.socket.on('onCandidateMachineSetupComplete', obj => {
            observer.next(obj);
        });
        });
    }

    onFinishTest() {
        return Observable.create(observer => {
            this.socket.on('onFinishTest', obj => {
                observer.next(obj);
            });
        });
    }

    close() {
	     //skip this step for now
		 console.log("skipping this close connection step");
        // this.socket.disconnect();
    }
}
