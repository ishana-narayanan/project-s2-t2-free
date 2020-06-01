// converts time hh:mm AM/PM to minute of the day
export function convertTime(str) {
  var min = 0;
  var morn = 0; // 0 if morning, 1 if afternoon
  if (str.charAt(str.length - 2) == "P") {
    morn = 1;
  }
  str = str.slice(0, -3);
  var str_split = str.split(":");

  if (str_split[0] == 12) {
    str_split[0] = 0;
  }

  min = +str_split[0] * 60 + +str_split[1];

  if (morn == 1) {
    min = min + 720;
  }
  return min;
}

// converts minute of the day to time hh:mm AM/PM
export function numToTime(num) {
  let str = "";
  if (Math.floor(num / 60) % 12 == 0) {
    str += "12";
  } else if (num > 720) {
    str += Math.floor((num - 720) / 60) % 60;
  } else {
    str += Math.floor(num / 60) % 60;
  }
  str += ":";
  if (num % 60 < 10) {
    str = str + "0" + (num % 60).toString();
  } else {
    str += (num % 60).toString();
  }

  // decide AM or PM
  if (num >= 720) {
    str += " PM";
  } else {
    str += " AM";
  }
  return str;
}

// dictionary of busy times with format 'string day':'true/false'
export function makeBusy() {
  let busy = {};
  for (let i = 0; i < 1436; i = i + 5) {
    busy[numToTime(i)] = true;
  }
  return busy;
}

// populates busy with events
export function convertEvent(events) {
  var busy = makeBusy();
  var len = events.length;
  for (let i = 0; i < len; i++) {
    var start_time = convertTime(events[i][0]);
    var end_time = convertTime(events[i][1]);

    if (start_time === 0) {
      busy["12:00 AM"] = false;
    }

    if (end_time === 1435) {
      busy["11:55 PM"] = false;
    }

    for (let j = start_time + 5; j <= end_time - 5; j = j + 5) {
      busy[numToTime(j)] = false;
    }
  }
  return busy;
}

// converts busy_times to free_times as time strings
export function makeFree(busy_times) {
  var free_times = [];
  for (var key in busy_times) {
    if (busy_times[key] == true) {
      free_times.push(key);
    }
  }
  return free_times;
}

export function freeIntervals(free_times) {
  var free_intervals = [];
  var start = free_times[0];
  free_intervals.push(start);
  var i = 1;
  while (i < free_times.length) {
    while (
      i < free_times.length &&
      convertTime(free_times[i]) == convertTime(free_times[i - 1]) + 5
    ) {
      i++;
    }
    free_intervals.push(free_times[i - 1]);
    if (i < free_times.length) {
      free_intervals.push(free_times[i]);
    }
    i++;
  }
  var intervals = [];
  for (var i = 0; i < free_intervals.length - 1; i = i + 2) {
    if (free_intervals[i] != free_intervals[i + 1]) {
      intervals.push(free_intervals[i]);
      intervals.push(free_intervals[i + 1]);
    }
  }
  return intervals;
}

// converts free_times from min to string time format
export function freeTime(event_logs) {
  var busy = convertEvent(event_logs);
  var free_times = makeFree(busy);
  var free_intervals = freeIntervals(free_times);

  // make a list of lists
  var free_times_str = [];
  for (let i = 0; i < free_intervals.length; i = i + 2) {
    free_times_str.push([free_intervals[i], free_intervals[i + 1]]);
  }
  return free_times_str;
}
