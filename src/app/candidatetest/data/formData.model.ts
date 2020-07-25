export class FormData {
    firstName: string = '';
    lastName : string = '';
    email: string = '';
    work: string = '';
    street: string = '';
    city: string = '';
    state: string = '';
    zip: string = '';

    isAcceptedTerms: boolean = false;
    isMCQQuestionAnswered: boolean = false;
    isCodeTestAnswered: boolean = false;
    isVideoTestAnswered: boolean = false;

    clear() {
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.work = '';
        this.street = '';
        this.city = '';
        this.state = '';
        this.zip = '';

        this.isAcceptedTerms = false;
        this.isMCQQuestionAnswered = false;
        this.isCodeTestAnswered = false;
        this.isVideoTestAnswered = false;
    }
}

export class Welcome {
    isAcceptedTerms: boolean = false;
}

export class MCQTest {
    isMCQQuestionAnswered: boolean = false;
}

export class CodeTest {
    isCodeTestAnswered: boolean = false;
}

export class VideoTest {
    isVideoTestAnswered: boolean = false;
}

export class Personal {
    firstName: string = '';
    lastName : string = '';
    email: string = '';
}

export class Address {
    street: string = '';
    city: string = '';
    state: string = '';
    zip: string = '';
}