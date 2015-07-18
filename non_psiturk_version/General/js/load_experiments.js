function loadjscssfile(filename, filetype){
	if (filetype == "js") {
		document.write('<script src =' + filename + '></script>')
	}
	else if (filetype = "css") {
		document.write('<link href =' + filename + ' rel="stylesheet" type="text/css"></script>')
	}
}

var randomDraw = function(lst,n) {
	n = n || "1"
	var random_list = []
	for (i=0; i<n; i++) {
		index = Math.round(Math.random()*(lst.length-1))
		random_list.push(lst[index])
	}
    return random_list
}

/* Draws experiments randomly to fill up a certain amount of time. 
Completely avoids any knapsack type optimization and just stops 
when it can't find another experiment to add */

var experimentDraw = function(lst, time) {
	var time = time || "30"
	console.log(time)
	var return_list = []
	var total_time = 0
	while (total_time < time && lst.length > 0) {
		console.log(lst.length)
		index = Math.round(Math.random()*(lst.length-1))
		if ((total_time + lst[index].time) < 30) {
			total_time += lst[index].time
			return_list.push(lst[index].name)
		} 
		lst.splice(index,1)
	}
    return return_list
}

/* Define some function to select experiments to show. Right now I am hard coding,
but eventually they should be selected by some function (I.E. random new combinations
for a returning subject, keeping the total time under 30 minutes)
*/ 
// full list of experiment names:
var experiment_list = [{name:"simple_rt", time: 2}, {name: "simon", time: 10}, {name: "ANT", time: 20}, {name: "AX-CPT", time: 10}, 
						{name: "stop_signal", time: 20},{name: "plus-minus", time: 5},{name: "number-letter", time: 5}, {name: "local-global", time: 5},
						{name: "go-nogo", time: 7}, {name: 'stroop', time: 6}] 
						
// experiment_names = experimentDraw(experiment_list)
var experiment_names = ["stop_signal"]

/* One the experiments are selected, load the appropriate files */
for (i = 0; i < experiment_names.length; i++) {
	switch (experiment_names[i]) {
		case "simple_rt":
			loadjscssfile("../Experiments/css/simple_rt.css","css")
			loadjscssfile("../Experiments/js/simple_rt.js","js")
			break;
		case "simon":
			loadjscssfile("../Experiments/css/simon.css","css")
			loadjscssfile("../Experiments/js/simon.js","js")
			break;
		case "ANT":
			loadjscssfile("../Experiments/css/ANT.css","css")
			loadjscssfile("../Experiments/js/ANT.js","js")
			loadjscssfile("../General/jspsych/custom_plugins/jspsych-ANT-practice.js","js")
			break;
		case "AX-CPT":
			loadjscssfile("../Experiments/css/AX-CPT.css","css")
			loadjscssfile("../Experiments/js/AX-CPT.js","js")
			break;
		case "stop_signal":
			loadjscssfile("../Experiments/css/stop_signal.css","css")
			loadjscssfile("../Experiments/js/stop_signal.js","js")
			loadjscssfile("../General/jspsych/custom_plugins/jspsych-stop-signal.js","js")
			loadjscssfile("../General/jspsych/plugins/jspsych-call-function.js","js")
			break;
		case "plus-minus":
			loadjscssfile("../Experiments/js/plus-minus.js","js")
			loadjscssfile("../General/jspsych/plugins/jspsych-survey-text.js","js")
			break;
		case "number-letter":
			loadjscssfile("../Experiments/css/number-letter.css","css")
			loadjscssfile("../Experiments/js/number-letter.js","js")
			break;
		case "local-global":
			loadjscssfile("../Experiments/css/local-global.css","css")
			loadjscssfile("../Experiments/js/local-global.js","js")
			break;
		case "go-nogo":
			loadjscssfile("../Experiments/css/go-nogo.css","css")
			loadjscssfile("../Experiments/js/go-nogo.js","js")
			break;
		case "stroop":
			loadjscssfile("../Experiments/css/stroop.css","css")
			loadjscssfile("../Experiments/js/stroop.js","js")
			break;
	}
}

/* takes an experiment array and concatenates it with the array of each experiment \
identified in 'experiment_names' */
function cat_experiments(experiment_array) {
	for (i = 0; i < experiment_names.length; i++) {
		switch (experiment_names[i]) {
			case "simple_rt":
				experiments = experiments.concat(simple_rt_experiment)
				break;
			case "simon":
				experiments = experiments.concat(simon_experiment)
				break;
			case "ANT":
				experiments = experiments.concat(ANT_experiment)
				break;
			case "AX-CPT":
				experiments = experiments.concat(AX_experiment)
				break;
			case "stop_signal":
				experiments = experiments.concat(stop_signal_experiment)
				break;
			case "plus-minus":
				experiments = experiments.concat(plus_minus_experiment)
				break;
			case "number-letter":
				experiments = experiments.concat(numlet_experiment)
				break;
			case "local-global":
				experiments = experiments.concat(local_global_experiment)
				break;
			case "go-nogo":
				experiments = experiments.concat(gonogo_experiment)
				break;
			case "stroop":
				experiments = experiments.concat(stroop_experiment)
				break;
		}
	}
}