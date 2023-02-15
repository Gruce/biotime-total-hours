export default class {
  constructor(name, workdays) {
    this.name = name;
    this.workdays = workdays;
  }

  totalHours() {
    let total = 0;
    this.workdays.forEach((workday) => {
      if (!workday.total) return;
      const [hours, minutes] = workday.total.split(":");
      total += parseInt(hours) + parseInt(minutes) / 60;
    });
    return Math.round(total * 10) / 10;
  }
}
