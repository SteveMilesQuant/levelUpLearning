


class Calendar {
  constructor(htmlBox, startDay = 0, skipDays = []) {
    this.htmlBox = htmlBox;
    this.startDay = startDay;
    this.skipDays = skipDays;
    this.startDate = null;
    this.endDate = null;
  }

  addEvent(title, startTime, endTime) {
    startTime = new Date(Date.parse(startTime));
    endTime = new Date(Date.parse(endTime));

    let startDate = new Date(startTime.getTime());
    startDate.setUTCHours(0, 0, 0);

    let dateBox = this.insertDate(startDate);
    let eventBox = null;
    if (dateBox) {
      eventBox = document.createElement('div');
      eventBox.classList.add('calendar-body-item');
      eventBox.classList.add('selectable');
      eventBox.startTime = startTime;
      let wasInserted = false;
      for (const child of dateBox.eventsBox.childNodes) {
        if (child.startTime > startTime) {
          dateBox.eventsBox.insertBefore(eventBox, child);
          wasInserted = true;
          break;
        }
      }
      if (!wasInserted) dateBox.eventsBox.appendChild(eventBox);

      let titleBox = document.createElement('p');
      titleBox.innerText = title;
      eventBox.appendChild(titleBox);

      let timeBox = document.createElement('p');
      let startTimeText = startTime.toLocaleTimeString('en-US', {timeStyle: "short"});
      let endTimeText = endTime.toLocaleTimeString('en-US', {timeStyle: "short"});
      timeBox.innerText = startTimeText + '-' + endTimeText;
      eventBox.appendChild(timeBox);
    }
    return eventBox;
  }

  insertDate(date) {
    let returnDateBox = null;
    if (this.skipDays.includes(date.getUTCDay())) return returnDateBox;

    if (!this.startDate || date < this.startDate) {
      let newStartDate = new Date(date.getTime());
      let dayShift = this.startDay - newStartDate.getUTCDay();
      if (dayShift > 0) dayShift -= 7;
      newStartDate.setUTCDate(newStartDate.getUTCDate() + dayShift);
      let endAddDate = null;
      if (this.startDate) {
        endAddDate = new Date(this.startDate.getTime());
        endAddDate.setUTCDate(endAddDate.getUTCDate()-1)
      }
      else {
        endAddDate = date;
      }
      for (let addDate = new Date(endAddDate.getTime()); addDate >= newStartDate; addDate.setUTCDate(addDate.getUTCDate()-1)) {
        if (!this.skipDays.includes(addDate.getUTCDay())) {
          let dateBox = document.createElement('li');
          dateBox.date = new Date(addDate.getTime());
          if (date.getTime() === addDate.getTime()) returnDateBox = dateBox;
          this.htmlBox.insertBefore(dateBox, this.htmlBox.firstElementChild);

          let dateNumber = document.createElement('div');
          dateNumber.classList.add('calendar-body-header');
          dateNumber.innerText = addDate.getUTCDate();
          dateBox.appendChild(dateNumber);
          
          dateBox.eventsBox = document.createElement('div');
          dateBox.appendChild(dateBox.eventsBox);
        }
      }
      this.startDate = newStartDate;
      if (!this.endDate) this.endDate = endAddDate;
    }
    else if (!this.endDate || date > this.endDate) {
      let newEndDate = new Date(date.getTime());
      let startAddDate = null;
      if (this.endDate) {
        startAddDate = new Date(this.endDate.getTime());
        startAddDate.setUTCDate(startAddDate.getUTCDate()+1)
      }
      else {
        startAddDate = date;
      }
      for (let addDate = startAddDate; addDate <= newEndDate; addDate.setUTCDate(addDate.getUTCDate()+1)) {
        if (!this.skipDays.includes(addDate.getUTCDay())) {
          let dateBox = document.createElement('li');
          dateBox.date = new Date(addDate.getTime());
          if (date.getTime() === addDate.getTime()) returnDateBox = dateBox;
          this.htmlBox.appendChild(dateBox);

          let dateNumber = document.createElement('div');
          dateNumber.classList.add('calendar-body-header');
          dateNumber.innerText = addDate.getUTCDate();
          dateBox.appendChild(dateNumber);
          
          dateBox.eventsBox = document.createElement('div');
          dateBox.appendChild(dateBox.eventsBox);
        }
      }
      this.endDate = newEndDate;
      if (!this.startDate) this.startDate = startAddDate;
    }
    else {
      for (const dateBox of this.htmlBox.children) {
        if (date.getTime() === dateBox.date.getTime()) {
          returnDateBox = dateBox;
          break;
        }
      }
    }
    return returnDateBox;
  }
}