/** @jsx React.DOM */

var quiz = [{
	"question": "What does CSS stand for?",
	"choices": ["Creative Style Sheets", "Computer Style Sheets", "Cascading Style Sheets"],
	"answer": "Cascading Style Sheets"
}, {
	"question": "Which CSS property controls the text size?",
	"choices": ["text-size", "font-size", "font-style"],
	"answer": "font-size"
}, {
	"question": "What does HTML stand for?",
	"choices": ["Hyperlinks and Text Markup Language", "Hyper Text Markup Language", "Home Tool Markup Language"],
	"answer": "Hyper Text Markup Language"
}];

var htmlQuiz = [{
	"info" : {
		"name" : "HTML Quiz",
		abstract: "Test your HTML knowledge",
		"levels": {
			1 : "Back to school",
			2 : "Amature",
			3 : "Ready for the big leagues"
		}
	},
	"questions" : [
		{ 
			"question" : "Who makes the Web Standards?",
			"choices" : [
				{"choice" : "Mozilla", "correct" : false},
				{"choice" : "The World Web Consortium", "correct" : true},
				{"choice" : "Google", "correct" : false},
				{"choice" : "Microsoft", "correct" : false}
			]

		},
		{ 
			"question" : "What is the HTML tag for the largest heading?",
			"choices" : [
				{"choice" : "<h6>", "correct" : false},
				{"choice" : "<heading>", "correct" : false},
				{"choice" : "<h1>", "correct" : true},
				{"choice" : "<bold>", "correct" : false}
			]

		}
	]
}]

var QuizContainer = React.createClass( {
	getInitialState: function() {
		return {
			current: 0,
			current_quiz: quiz[ 0 ],
			user_choice: "",
			score: 0,
			verifying_answer: false
		};
	},
	selectedAnswer: function( option ) {
		this.setState( { user_choice: option } );
	},
	handleSubmit: function() {
		if ( !this.state.verifying_answer ) {
			if ( this.state.current_quiz.answer === this.state.user_choice ) {
				this.setState( {
					score: this.state.score + 1,
				} );
			}
			this.setState( { verifying_answer: true } );
		} else {
			if ( this.state.current < quiz.length -1 ) {
				this.setState( {
					current_quiz: quiz[ this.state.current + 1 ],
					current: this.state.current + 1,
					verifying_answer: false,
					user_choice: ""
				} );
			}
		}
	},
	render: function() {
		var self = this;
		var choices = this.state.current_quiz.choices.map( function( choice, index ) {
			var classType  = "";
			if ( self.state.verifying_answer ) {
				if ( choice === self.state.current_quiz.answer ) {
					classType = "text-success";
				} else if ( choice === self.state.user_choice && self.state.user_choice !== self.state.current_quiz.answer ) {
					classType = "text-danger";
				}
			}
			return (
				<RadioInput key={choice} choice={choice} index={index} onChoiceSelect={self.selectedAnswer} disable={self.state.verifying_answer} classType={classType}/>
			);
		} );
		var button_name = !this.state.verifying_answer ? "Submit" : "Next Question";
		return(
			<div className="quizContainer">
			<h1>Quiz</h1>
			<p>{this.state.current_quiz.question}</p>
			{choices}
			<button id="submit" className="btn btn-default" onClick={this.handleSubmit}>{button_name}</button>
			<ScoreBox score={this.state.score} />
			</div>
		);
	}
} );

var RadioInput = React.createClass( {
	handleClick: function() {
		this.props.onChoiceSelect( this.props.choice );
	},
	render: function() {
		var disable = this.props.disable;
		var classString = !disable ?  "radio" :  "radio disabled";
		return (
			<div className={classString}>
			<label className={this.props.classType}>
			<input type="radio" name="optionsRadios" id={this.props.index} value={this.props.choice} onChange={this.handleClick} disabled={disable} />
			{this.props.choice}
			</label>
			</div>
		);
	}
} );

var ScoreBox = React.createClass( {
	render: function() {
		return (
			<div className="score">
			<p>Score: {this.props.score} right answers out of {quiz.length} possible.</p>
			</div>
		);
	}
} );

React.render(
	<QuizContainer />,
	document.body
);
