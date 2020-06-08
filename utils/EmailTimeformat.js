module.exports = class {
  constructor(dateBody, timeBody) {
    this.time = timeBody;
    this.date = dateBody;
  }

  createDate() {
    // request a weekday along with a long date
    const dates = new Date(this.date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    this.bookDate = dates.toLocaleDateString('de-DE', options);
    console.log(this.bookDate);
    const t1 = this.time.split(':')[0];
    const t2 = this.time.split(':')[1];
    // console.log(t1, t2);
    if (t1 > 12) {
      this.bookTime = `${t1 - 12}:${t2} PM`;
    } else {
      this.bookTime = `${t1.split('')[1]}:${t2} AM`;
    }

    return {
      bookDate: this.bookDate,
      bookTime: this.bookTime
    };
  }
};
