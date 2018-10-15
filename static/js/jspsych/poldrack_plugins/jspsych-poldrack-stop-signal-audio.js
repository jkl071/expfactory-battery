/**
 * jspsych-single-audio
 * Jamie Li
 *
 * plugin for showing an image, playing an audio file at a delay, and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["poldrack-stop-signal-audio"] = (function() {

  var plugin = {};

  var context = new AudioContext();

  jsPsych.pluginAPI.registerPreload('poldrack-stop-signal-audio', 'image', 'audio');

  plugin.trial = function(display_element, trial) {
	
	// if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
    
    
    // default parameters
    trial.choices = trial.choices || [];
    trial.response_ends_trial = (typeof trial.response_ends_trial === 'undefined') ? true : trial.response_ends_trial;
    trial.prompt = (typeof trial.prompt === 'undefined') ? "" : trial.prompt;
    trial.is_html = (typeof trial.is_html == 'undefined') ? false : trial.is_html;

    
    // timing parameters
    trial.timing_response = trial.timing_response || -1; // if -1, then wait for response forever
    trial.audio = trial.audio || ""
    trial.SS_delay = trial.SS_delay || 0;
    trial.SS_trial_type = trial.SS_trial_type || 'undefined'
    trial.timing_stim = trial.timing_stim || -1; // if -1, then show indefinitely
    


    // this array holds handlers from setTimeout calls
    // that need to be cleared if the trial ends early
    var setTimeoutHandlers = [];
	
	console.log('audio = ' +trial.audio)   
	
    
    // play video stimulus
    var source = context.createBufferSource();
	source.buffer = jsPsych.pluginAPI.getAudioBuffer(trial.audio);
	source.connect(context.destination);
    startTime = context.currentTime + 0.1; //context.currentTime + 0.1
	//startTime += trial.SS_delay/1000
	console.log('delay = ' +startTime) 
	source.start(startTime);
    
    
     // display stimulus
    if (!trial.is_html) {
      display_element.append($('<img>', {
        src: trial.stimulus,
        id: 'jspsych-poldrack-stop-signal-audio-stimulus'
      }));
    } else {
      display_element.append($('<div>', {
        html: trial.stimulus,
        id: 'jspsych-poldrack-stop-signal-audio-stimulus'
      }));
    }

    //show prompt if there is one
    if (trial.prompt !== "") {
      display_element.append(trial.prompt);
    }
    
    // store response
	var response = {rt: -1, key: -1};
	
	// function to end trial when it is time
	 var end_trial = function() {

	  // kill any remaining setTimeout handlers
	  for (var i = 0; i < setTimeoutHandlers.length; i++) {
		clearTimeout(setTimeoutHandlers[i]);
	  }
  
  		
	  // stop the audio file if it is playing
	  source.stop();
	  
	  if (trial.SS_trial_type == 'undefined') {
		source.stop();
      }

	  // kill keyboard listeners
	  if (typeof keyboardListener !== 'undefined') {
		jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
	  }


	  //jsPsych.data.write(trial_data);
	  
	  //calculate stim and block duration
		var stim_duration = trial.timing_stim
		var block_duration = trial.timing_response
		if (trial.response_ends_trial & response.rt != -1) {
			block_duration = response.rt
		}
		if (stim_duration != -1) {
			stim_duration = Math.min(block_duration,trial.timing_stim)
		} else {
			stim_duration = block_duration
		}

		// gather the data to store for the trial
		var trial_data = {
			"stimulus": trial.stimulus,
			"rt": response.rt,
			"key_press": response.key,
			"SS_delay": trial.SSD,
			"SS_trial_type": trial.SS_trial_type,
			"possible_responses": trial.choices,
			"stim_duration": stim_duration,
			"block_duration": block_duration,
			"timing_post_trial": trial.timing_post_trial
		};

	  // clear the display
	  display_element.html('');

	  // move on to the next trial
	  jsPsych.finishTrial(trial_data);
	};
	
	// function to handle responses by the subject
	 var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      $("#jspsych-poldrack-stop-signal-audio-stimulus").addClass('responded');

      // only record the first response
      if (response.key == -1) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

	// start the response listener
	if (JSON.stringify(trial.choices) != JSON.stringify(["none"])) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false,
        audio_context: context,
        audio_context_start_time: startTime
      });
    }
    
    // hide image if timing is set
    if (trial.timing_stim > 0) {
      var t1 = setTimeout(function() {
        $('#jspsych-poldrack-stop-signal-audio-stimulus').css('visibility', 'hidden');
      }, trial.timing_stim);
      setTimeoutHandlers.push(t1);
    }
    
    // end trial if time limit is set
    if (trial.timing_response > 0) {
      var t2 = setTimeout(function() {
        end_trial();
      }, trial.timing_response);
      setTimeoutHandlers.push(t2);
    }
    
    };
    return plugin;
})();
    
