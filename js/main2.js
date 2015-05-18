var quizData = {
	"info" : {
		"name" : "HTML Quiz",
		"abstract": "Test your HTML knowledge",
		"levels": {
			1 : "Back to school",
			2 : "Amature",
			3 : "Ready for the big leagues"
		}
	},
	"questions" : [
		{
			"id" : 1,
			"question" : "Who designs the Web Standards?",
			"choices" : [
				{"id": 1, "choice" : "Mozilla", "correct" : false},
				{"id": 2, "choice" : "The World Web Consortium", "correct" : true},
				{"id": 3, "choice" : "Google", "correct" : false},
				{"id": 4, "choice" : "Microsoft", "correct" : false}
			],
			"explaination" : "The World Web Consortuim handles the design of the web standards. It has many members including Google, Microsoft, Mozilla, etc..."

		},
		{
			"id" : 2,
			"question" : "What is the HTML tag for the largest heading?",
			"choices" : [
				{"id": 1, "choice" : "<h6>", "correct" : false},
				{"id": 2, "choice" : "<heading>", "correct" : false},
				{"id": 3, "choice" : "<h1>", "correct" : true},
				{"id": 4, "choice" : "<bold>", "correct" : false}
			],
			"explaination" : "<h1> is the tag that renders the largest heading. The heading tags are <h1> to <h6>, with <h1> being the biggest and <h6> being the smallest."

		},
		{
			"id" : 3,
			"question" : "What is the Unordered List tag?",
			"choices" : [
				{"id": 1, "choice" : "<h6>", "correct" : false},
				{"id": 2, "choice" : "<ul>", "correct" : true},
				{"id": 3, "choice" : "<ol>", "correct" : false},
				{"id": 4, "choice" : "<em>", "correct" : false}
			],
			"explaination" : "Unordered list is designated by <ul> tag. There are two types of lists, <ul> and <ol>. <ul> designates an unordered list, whereas <ol> designates ordered list."
		}
	]
};

var QuizContainer = React.createClass({
	getInitialState: function () {
		return {
			currentQuestion: 0,
			showIntro: true,
			showQuiz: false,
			showResults: false,
			userInput: 0,
			resultData : {}
		};
	},
	startQuiz: function () {
		this.setState ({
			showIntro: false,
			showQuiz: true
		});
	},
	showResults : function(userInput){
		var result = {};
		var questions = this.props.data.questions;
		var total = questions.length;
		var correct = 0;
		var questionOutput = [];

		questions.forEach(
			function(question, i){
				var questionID = question;
				var isUserAnswerCorrect = false;
				var correctChoice;

				var grepResult = $.grep(userInput.question, function(obj, i){
					return obj.question === questionID.id;
				});
				
				var choiceGrep = $.grep(question.choices, function(obj, i){
					return obj.correct === true;
				});
				correctChoice = choiceGrep[0].choice;

				if( (grepResult == undefined) ||  (grepResult.length !== 0) ) {
					if(grepResult[0].answer !== undefined){
						if(choiceGrep[0].id === grepResult[0].answer){
							isUserAnswerCorrect = true;
							correct++;
						}
					}
				}

				

				var questionResultOutput = {};
				questionResultOutput["question"] = question.question;
				questionResultOutput["choice"] = correctChoice;
				questionResultOutput["isUserCorrect"] = isUserAnswerCorrect;
				questionResultOutput["explaination"] = question.explaination;

				questionOutput.push(questionResultOutput);
			}, this
		);

		result["correct"] = correct;
		result["total"] = total;
		result["questionOutput"] = questionOutput;

		this.setState( { resultData : result , showQuiz : false, showResult : true } );
	},
	render: function() {
		if(this.state.showIntro) {
			return(
				<Introduction
				data={this.props.data.info} 
				onStartQuizClick={this.startQuiz}
				/>
			);
		}
		if(this.state.showQuiz){
			return(
				<Quiz questions={this.props.data.questions} 				
				onShowResultClick={this.showResults}
				/>
			);
		}
		if(this.state.showResult){
			return(
				<ShowResults resultData={this.state.resultData} />	
			);
		}
	}
});

var Quiz = React.createClass({
	getInitialState: function(){
		return {
			current: 0,
			userInput : {
				question : []
			},
			marked : 0,
			answered: 0,
			answeredAndNotMarked: 0,
			review : false
		};
	},
	updateStateOfAnsweredAndMarked : function() {
		var answered = 0
		var answeredAndNotMarked = 0;
		var markedForReview = 0;

		this.state.userInput.question.forEach(function(question, i){
			if(question.answer !== undefined || question.answer !== null)
				answered++;
			if((question.answer !== undefined || question.answer !== null) && (question.markedForReview !== true))
				answeredAndNotMarked++;
			if(question.markedForReview === true)
				markedForReview++;
		});

		return {'answered' : answered, 'answeredAndNotMarked' : answeredAndNotMarked, 'markedForReview' : markedForReview};
	},
	setCurrentQuestionUserAnswer : function(answer_id) {
		var currentQuestion = this.props.questions[this.state.current];
		var obj = { "question" : currentQuestion.id, "answer" : answer_id, "markedForReview" : false};
		var grepResult = $.grep(this.state.userInput.question, function(obj, i){
			return obj.question === currentQuestion.id;
		});
		if(grepResult === undefined || grepResult === null || grepResult.length === 0){  
			this.state.userInput.question.push(obj);
		} else {
			grepResult[0].answer = answer_id;
		}

		var getUpdatedState = this.updateStateOfAnsweredAndMarked();
		this.setState ({
			answered : getUpdatedState.answered,
			answeredAndNotMarked : getUpdatedState.answeredAndNotMarked
		});
	},
	setCurrentQuestionMarkForReview : function() {
		var currentQuestion = this.props.questions[this.state.current];
		var obj = { "question" : currentQuestion.id, "markedForReview" : true};
		var grepResult = $.grep(this.state.userInput.question, function(obj, i){
			return obj.question === currentQuestion.id;
		});
		if(grepResult === undefined || grepResult === null || grepResult.length === 0){  
			this.state.userInput.question.push(obj);
		} else {
			grepResult[0].markedForReview = !grepResult[0].markedForReview;
		}

		var getUpdatedState = this.updateStateOfAnsweredAndMarked();
		this.setState ({
			answered : getUpdatedState.answered,
			answeredAndNotMarked : getUpdatedState.answeredAndNotMarked,
			marked : getUpdatedState.markedForReview
		});
	},
	getNextQuestion : function () {

		var numberOfQuestionsAvailable = this.props.questions.length;
		if(numberOfQuestionsAvailable > this.state.current){ 
			var updateCurrentValue = this.state.current + 1;
			this.setState ({
				current : updateCurrentValue
			});
		} else {
			// nothing   
		}
	},
	getPreviousQuestion : function() {
		if(0 < this.state.current){ 
			var updateCurrentValue = this.state.current - 1;
			this.setState ({
				current : updateCurrentValue
			});
		} else {
			// nothing   
		}
	},
	handleSubmitForReview : function() {
		this.setState({
			review : true
		});
	},
	modifyAnswerForQuestion : function(questionNumber) {
		var index;
		this.props.questions.forEach(
			function(question, i) {
				if(question.id === questionNumber){
					index = i;
					return;
				}
			}
		);

		this.setState(
			{
				current: index,
				review: false	
			}
		)

	},
	handleGetResultsClick : function(){
		this.props.onShowResultClick(this.state.userInput);
	},
	componentWillMount : function () {
		this.props.numberOfQuestions = this.props.questions.length;
	},
	render: function(){
		if(!this.state.review){
			var currentQuestion = this.props.questions[this.state.current];
			var hasPrevious = this.state.current > 0 ? true : false;
			var hasNext = this.state.current < this.props.numberOfQuestions-1 ? true : false;

			var isMarked = false;
			var selectedAnswerID;
			var grepResult = $.grep(this.state.userInput.question, function(obj, i){
				return obj.question === currentQuestion.id;
			});
			if(!(grepResult === undefined || grepResult === null || grepResult.length === 0)){  
				isMarked = grepResult[0].markedForReview;
				selectedAnswerID = grepResult[0].answer;
			} 

			return(
				<div className="container">
				<div className="panel panel-primary">
				<div className="panel-heading">Question #{this.state.current+1}
				</div>
				<div className="panel-body">
				<p>
				{currentQuestion.question}
				</p>
				</div>
				<QuestionChoices choices={currentQuestion.choices} userSelectedAnswerID={selectedAnswerID} updateUserSelectionForCurrentQuestion={this.setCurrentQuestionUserAnswer} />
				<div className="panel-body">
				<div className="col-md-12 center">
				<ProgressBar numberOfQuestionsAnswered={this.state.answeredAndNotMarked} maxNumberOfQuestions={this.props.numberOfQuestions} numberOfQuestionsMarkedForReview={this.state.marked}/>
				</div>
				<div className="col-md-12 center">
				<NavigationBar updateQuestionMarkedForReview={this.setCurrentQuestionMarkForReview} next={hasNext} previous={hasPrevious} markForReview={isMarked} getNextQuestion={this.getNextQuestion} getPreviousQuestion={this.getPreviousQuestion}/>
				</div>
				<div className="col-md-12 submitButton">
				<SubmitForReview submitForReviewClicked={this.handleSubmitForReview} />
				<SubmitForResults handleSubmitForResultsButton={this.handleGetResultsClick} />
				</div>
				</div>
				</div>
				</div>
			);
		} else if (this.state.review){
			var data = [];
			this.props.questions.forEach(
				function(question, i){
					var output ={};
					output['id'] = question.id;
					output['question'] = question.question;

					var grepResult = $.grep(this.state.userInput.question, function(obj, i){
						return obj.question === output.id;
					});
					if(grepResult === undefined || grepResult === null || grepResult.length === 0){  
						output['chosenAnswer'] = '';
						output['markedForReview'] = false;
						output['answered'] = false;
					} else {
						var userInput = grepResult[0];
						if (userInput.markedForReview !== undefined)
							output['markedForReview'] = grepResult[0].markedForReview;
						if (userInput.answer !== undefined) {
							output['answered'] = true;
							var choiceGrep = $.grep(question.choices, function(obj, i){
								return obj.id === grepResult[0].answer;
							});
							output['chosenAnswer'] = choiceGrep[0].choice;
						}
					}

					data.push(output);
				}, this
			);
			return (
				<ReviewQuiz	totalQuesitons={this.props.numberOfQuestions} totalMarkedForReview={this.state.marked} totalAnswered={this.state.answered} data={data} reviewModifyCalled={this.modifyAnswerForQuestion} handleSubmitForResultsButton={this.handleGetResultsClick} />
			);
		}
	}
});

var QuestionChoices = React.createClass({

	getInitialState : function(){
		return {
			selectedAnswer : null
		};
	},
	handleUserInput: function(id){        
		this.props.updateUserSelectionForCurrentQuestion(id);
	},
	render: function(){
		var choices = [];
		this.props.choices.map(function(choice, i) {
			var selected = false;
			if(!(this.props.userSelectedAnswerID === undefined) && 
			   !($.isArray(this.props.userSelectedAnswerID)) && 
			   (this.props.userSelectedAnswerID === choice.id))
				selected = true;
			choices.push(
				<RadioChoice 
				key={i}
				id={choice.id}
				onUserInput={this.handleUserInput}
				choice={choice.choice} 
				isSelected={selected}
				/> 
			);
		}, this);
		return(
			//			<div className="row">
			//			<div className="col-lg-12">
			<ul className="list-group">
			{choices}
			</ul>
			//			</div>
			//			</div>
		);

	}
});

var CheckedChoice = React.createClass({
	activateSelectedListItem : function(e){
		var listItem = e.currentTarget;
		$(listItem).toggleClass('active');
	},
	render: function(){
		return(
			<li 
			key={this.props.key} 
			className="list-group-item" 
			onClick={this.activateSelectedListItem}
			>
			{this.props.choice}
			</li>
		);
	}
});

var RadioChoice = React.createClass({
	getInitialState : function() {
		return { isSelected : false }
	},
	componentWillReceiveProps : function (nextProps) {
		this.setState({
			isSelected : nextProps.isSelected    
		});
	},
	activateSelectedListItem : function(id, e){
		this.props.onUserInput(id);
	},
	render: function(){
		var cx = React.addons.classSet;
		var classes = cx({
			'list-group-item': !this.props.isSelected,
			'list-group-item list-group-item-success': this.props.isSelected
		});
		return(
			<
			li 
			key={this.props.key} 
			data-id={this.props.id} 
			className={ classes }
			onClick={this.activateSelectedListItem.bind(this, this.props.id) }
	>
	{this.props.choice}
	</li>
	);
}
									});

var NavigationBar = React.createClass({
	getInitialState : function () {
		return {
			previous: false,
			next : false,
			markForReview : false
		}
	},
	handleClickMarkForReview : function(e){
		var button = e.currentTarget;
		//        $(button).toggleClass('active');
		this.props.updateQuestionMarkedForReview();
	},
	handleGetNextQuestion : function(){
		this.props.getNextQuestion();
	},
	handleGetPreviousQuestion : function(){
		this.props.getPreviousQuestion();
	},
	render: function(){
		var cx = React.addons.classSet;
		var previousClasses = cx({
			'btn btn-info': true,
			'btn btn-info disabled': !this.props.previous,
		});
		var nextClasses = cx({
			'btn btn-info': true,
			'btn btn-info disabled': !this.props.next
		});
		var markedForReviewClasses = cx({
			'btn btn-warning active': this.props.markForReview,
			'btn btn-info': !this.props.markForReview,
		});
		return(
			<div className="btn-group">
			<div className={previousClasses} onClick={this.handleGetPreviousQuestion}>Previous</div>
			<div className={markedForReviewClasses} onClick={this.handleClickMarkForReview}>Mark for Review</div>
			<div className={nextClasses} onClick={this.handleGetNextQuestion}>Next</div>
			</div>
		);
	}
});

var ProgressBar = React.createClass ({
	getInitialState : function () {
		return {
			current : 0,
			min : 0,
			max : undefined,
			markedForReview : 0,

		}
	},
	componentWillMount : function() {
		this.state.max = this.props.maxNumberOfQuestions;
		this.state.markedForReview= this.props.numberOfQuestionsMarkedForReview;
		this.state.current = this.props.numberOfQuestionsAnswered;	
	},
	componentWillReceiveProps : function(nextProps) {
		this.setState(
			{
				current : nextProps.numberOfQuestionsAnswered,
				markedForReview : nextProps.numberOfQuestionsMarkedForReview
			}
		);
	},
	shouldComponentUpdate : function(nextProps, nextState){
		return nextProps.numberOfQuestionsAnswered !== this.state.current || nextProps.numberOfQuestionsMarkedForReview !== this.state.markedForReview;
	},
	render : function () {
		var successProgressBarStyle = {
			width : ((this.state.current/this.state.max)*100).toFixed(2) + '%'
		}
		var markedProgressBarStyle = {
			width : ((this.state.markedForReview/this.state.max)*100).toFixed(2) + '%'
		}
		return (
			<div className="progress">
			<div className="progress-bar progress-bar-success" aria-value-now={"" + this.state.current} aria-valuemin={"" + this.state.min} aria-valuemax={"" + this.state.max} style={successProgressBarStyle}></div>
			<div className="progress-bar progress-bar-warning" aria-value-now={"" + this.state.markedForReview} aria-valuemin={"" + this.state.min} aria-valuemax={"" + this.state.max} style={markedProgressBarStyle}></div>
			</div>
		);
	}
});

var ReviewQuiz = React.createClass({
	handleModifyClick : function (questionNumber) {
		this.props.reviewModifyCalled(questionNumber);
	},
	render : function() {
		var output = [];
		this.props.data.forEach(
			function(row, i){
				output.push(<ReviewQuizRow key={i} questionNumber={row.id} question={row.question} chosenAnswer={row.chosenAnswer} marked={row.markedForReview} answered={row.answered} reviewModifyCalled={this.props.reviewModifyCalled} />
						   )
			}, this
		);
		return (
			<div className="col-md-12">
			<div className="panel panel-primary">
			<div className="panel-heading">
			<div className="panel-title">Review</div>
			</div>
			<div className="panel-body center">
			<div className="col-md-3 col-sm-3 col-xs-6">
			<div>
			<span className="fa-stack">
			<i className="fa fa-circle fa-stack-2x text-info"></i>
			<span className="fa-stack-1x padding-top-sm">{this.props.totalQuesitons}</span>
			</span>
			<h5>Questions</h5>
			</div>
			</div>
			<div className="col-md-3 col-sm-3 col-xs-6">
			<div>
			<span className="fa-stack">
			<i className="fa fa-circle fa-stack-2x text-warning"></i>
			<span className="fa-stack-1x padding-top-sm">{this.props.totalMarkedForReview}</span>
			</span>
			<h5>Marked</h5>
			</div>
			</div>
			<div className="col-md-3 col-sm-3 col-xs-6 ">
			<div>
			<span className="fa-stack">
			<i className="fa fa-circle fa-stack-2x text-success"></i>
			<span className="fa-stack-1x padding-top-sm">{this.props.totalAnswered}</span>
			</span>
			<h5>Answered</h5>
			</div>
			</div>
			<div className="col-md-3 col-sm-3 col-xs-6">
			<div>
			<span className="fa-stack">
			<i className="fa fa-circle fa-stack-2x text-danger"></i>
			<span className="fa-stack-1x padding-top-sm">{this.props.totalQuesitons-this.props.totalAnswered}</span>
			</span>
			<h5>Unanswered</h5>
			</div>
			</div>
			<div className="btn btn-primary" onClick={this.props.handleSubmitForResultsButton}>Submit</div>	 
			</div>
			<table className="table">
			<thead>
			<tr>
			<th>#</th>
			<th className="center">Question</th>
			<th className="hidden-xs">Chosen Answer</th>
			<th className="center">Marked?</th>
			<th className="center">Modify</th>
			</tr>
			</thead>
			<tbody>
			{output}
			</tbody>
			</table>
			</div>
			</div>
		);
	}
});

var ReviewQuizRow = React.createClass ({
	handleModifyClick : function(questionNumber) {
		this.props.reviewModifyCalled(questionNumber);
	},
	render : function() {
		var cx = React.addons.classSet;
		var classes = cx({
			'success': this.props.answered,
			'danger' : !this.props.answered
		});
		return (
			<tr className={classes}><td>{this.props.questionNumber}</td>
			<td>{this.props.question}</td>
			<td className="hidden-xs">{this.props.chosenAnswer}</td>
			<td className="center"><i className={this.props.marked ? 'fa fa-check-circle-o fa-4' : ''}></i></td>
			<td className="center">
			<div className="btn btn-info btn-xs" onClick={this.handleModifyClick.bind(this, this.props.questionNumber)}>Modify</div>
	{this.handleModifyClick.bind(this, this.props.questionNumber)}
									   </td>
									   </tr>	
									  );
}
});

var SubmitForResults = React.createClass({
	render : function () {
		return (
			<div className="btn btn-primary" onClick={this.props.handleSubmitForResultsButton}>Submit</div>	
		);
	}
});

var ShowResults = React.createClass({
	render : function() {
		var output = [];
		this.props.resultData.questionOutput.forEach(
			function(obj, i){
				output.push(<ShowResultRow key={i} index={i+1} data={obj} />
						   );
			}, this
		);
		var cx = React.addons.classSet;
		var scoreRatio = this.props.resultData.correct/this.props.resultData.total;
		var classes = cx({
			'result bg-danger': ((scoreRatio < 0.34) ? true : false ),
			'result bg-warning' : ( (0.34 <= scoreRatio) && (scoreRatio < 0.67) ? true : false ),
			'result bg-success' : ( (0.67 <= scoreRatio) && (scoreRatio < 1.01) ? true : false )
		});
		return (
			<div className="container">
			<div className="row-fluid">
			<div className="panel panel-primary">
			<div className="panel-heading">
			<div className="panel-title">Result</div>
			</div>
			<div className="panel-body center">
			<div className="col-md-4"></div>
			<div className="col-md-4">
			<div className="center">
			<div className={classes}>{this.props.resultData.correct}/{this.props.resultData.total}</div>
			<h4>Score</h4>
			</div>
			<div className="col-md-4"></div>
			</div>			
			</div>
			<table className="table">
			<thead>
			<tr>
			<th>#</th>
			<th className="center">Question</th>
			<th className="center">Answer</th>
			<th className="center">Explaination</th>
			</tr>
			</thead>
			<tbody>
			{output}
			</tbody>
			</table>
			</div>
			</div>
			</div>
		);
	}
});

var ShowResultRow = React.createClass({
	render : function(){
		var cx = React.addons.classSet;
		var classes = cx({
			'success': this.props.data.isUserCorrect,
			'danger' : !this.props.data.isUserCorrect
		});
		return (
			<tr className={classes}>
			<td>{this.props.index}</td>
			<td>{this.props.data.question}</td>
			<td>{this.props.data.choice}</td>
			<td>{this.props.data.explaination}</td>
			</tr>
		);
	}
});

var SubmitForReview = React.createClass({
	handleClick : function() {
		this.props.submitForReviewClicked();
	},
	render : function() {
		return (
			<div className="btn btn-info" onClick={this.handleClick}>Review</div>
		);
	}
});

var QuestionGridPreview = React.createClass({
	render: function(){
		return (
			<div></div>
		);
	}
});

var Introduction = React.createClass({
	handleStartQuizClick : function(){
		this.props.onStartQuizClick();
	},
	render: function(){
		return(
			<div>
			<h1>{this.props.data.name}</h1>
			<p>{this.props.data.abstract}</p>
			<input
			type="submit"
			onClick={this.handleStartQuizClick}
			value="Start Quiz"
			/>
			</div>
		);
	}
});

React.render(
	<QuizContainer data={quizData} />,
	document.body
);
