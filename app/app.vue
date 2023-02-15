<template>
  <div class="controller">
    <button @click="downloadPdf">PDF</button>
  </div>
  <div ref="content" class="container">
    <div grid grid-cols-2 gap-4>
      <!-- <img src="https://blendhouse-iq.com/wp-content/themes/blendhouse/images/logo.png" /> -->
      <div text-center col-span-2 text-2xl font-bold mb-2 bg-emerald-700 rounded-xl py-4 px-8 flex justify-between text-white>
        <span>Attendance</span>
        <span>{{ startPeriod }} - {{ endPeriod }}</span>
      </div>
      <div v-for="employer in employers" :key="employer.name" flex flex-col gap-4 rounded-xl p-4 border-gray-300 border-1px border-solid>
        <span font-bold text-center text-lg>{{ employer.name }}</span>
        <table>
          <thead bg-gray-100>
            <tr text-xs text-left>
              <th>#</th>
              <th>Date</th>
              <th>Weekday</th>
              <th>In</th>
              <th>Out</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(workday, index) in employer.workdays" :key="workday.date" text-12px>
              <td>{{ index+ 1 }}</td>
              <td>{{ workday.date }}</td>
              <td>{{ workday.weekday }}</td>
              <td :bg="workday.first == 'None' ? 'red-100' : ''">{{ workday.first }}</td>
              <td :bg="workday.last == 'None' ? 'red-100' : ''">{{ workday.last }}</td>
              <td>{{ workday.total }}</td>
            </tr>
          </tbody>
        </table>
        <div flex gap-2 justify-between text-sm flex-grow items-end>
          <div flex bg-gray-100 py-2 px-4 rounded-lg gap-4 font-bold>
            <span>Total Hours</span>
            <span>{{ employer.totalHours() }}</span>
          </div>
          <div flex bg-gray-100 py-2 px-4 rounded-lg gap-4 font-bold>
            <span>Total Days</span>
            <span>{{ employer.workdays?.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import readXlsxFile from 'read-excel-file'
import moment from 'moment'
import { exportToPDF } from '#imports'


const startPeriod = ref('2023/02/01');
const endPeriod = ref('2023/02/14');

class WorkDay {
  constructor(name, date, weekday, first, last, total) {
    this.name = name;
    this.date = date;
    this.weekday = weekday;
    this.first = first;
    this.last = last;
    this.total = total;
  }


}

class Employer {
  constructor(name, workdays) {
    this.name = name;
    this.workdays = workdays;
  }

  totalHours() {
    let total = 0;
    this.workdays.forEach(workday => {
      if (!workday.total) return;
      const [hours, minutes] = workday.total.split(':');
      total += parseInt(hours) + parseInt(minutes) / 60;
    });
    return Math.round(total * 10) / 10;
  }

}

const employers = ref([])

const timeFormat = (time) => {
  if (time == 'None') return 'None';
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours) - 7;
  return moment(`${hours}:${minutes}`, 'HH:mm').format('hh:mm A');
}

fetch('tt.xlsx')
  .then(response => response.blob())
  .then(blob => readXlsxFile(blob))
  .then((rows) => {
    rows.splice(0, 2);

    // Group rows by name into Employer
    employers.value = rows.reduce((acc, row) => {
      const name = row[1];
      const date = row[3];
      const weekday = row[4];
      const first = timeFormat(row[5]);
      const last = timeFormat(row[6]);
      const total = row[7];

      if (name == 'Ajjour' || name == 'Admin') return acc;
      if (moment(endPeriod.value) < moment(date)) return acc;

      const workday = new WorkDay(name, date, weekday, first, last, total);

      if (!acc[name]) {
        acc[name] = new Employer(name, []);
      }

      acc[name].workdays.push(workday);

      return acc;
    }, {});

  })


const content = ref(null)

const downloadPdf = async () => await exportToPDF('my-pdf-file.pdf', content)

</script>

<style>
@media print {
  .container {
    display: block;
  }

  .controller {
    display: none;
  }

  /* this is key */

  div,
  p {
    page-break-inside: avoid;
  }
}
</style>