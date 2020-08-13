export class FormData {
    id: number;    
    name: string;
    duration: number;
    testLevel: string;
    category: string;
	problemDefination = '<h2>Task</h2>'+
    '<p>When you run this test project, you will see a simple CRUD web application.'+
'However, the Delete functionality of this webapp has not been implement.'+
'Implement the Delete functionality of the CRUP app such that when the user clicks Delete, the corresponding row is deleted.'+
'<h2>Test Cases</h2> <p><p>';
testcases = [{"input":"1","output":"1","error":"1","priority":1}];
    author: string;
    created: string;
    updated: string;


	GitHubUrl: string;
    isBasic: boolean;	
    published: boolean;

    clear() {
        this.name = '';
        this.duration = 30;
        this.testLevel = '';
        this.category = '';
        this.author = '';
        this.created = '';
        this.updated = '';
  
    
    } 
}

export class BasicData {
    name: string  = '';
    testLevel: string  = '';
    category: string  = '';
    	problemDefination = '<h2>Task</h2>'+
    '<p>When you run this test project, you will see a simple CRUD web application.'+
'However, the Delete functionality of this webapp has not been implement.'+
'Implement the Delete functionality of the CRUP app such that when the user clicks Delete, the corresponding row is deleted.'+
'<h2>Test Cases</h2> <p><p>';
   
	GitHubUrl = '';

	//testcases = [{"input":"1","output":"1","error":"1","priority":1},{"input":"22","output":"22","error":"22","priority":5}];
}



export class QuestionData {
    	testcases = [];
}

