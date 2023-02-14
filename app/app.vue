<template>
  <div>
    <!-- HELLO -->
    <!-- <NuxtWelcome /> -->
    <table class="t">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Weekday</th>
          <th>First</th>
          <th>Last</th>
          <th>Hours</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="employer in employers" :key="employer.name">
          <tr v-for="(workday, index) in employer.workdays" :key="workday.date" :class="workday.total ? '' : 'bg-red-200'">
            <td font-bold>{{ workday.name }}</td>
            <td>{{ workday.date }}</td>
            <td>{{ workday.weekday }}</td>
            <td>{{ workday.first }}</td>
            <td>{{ workday.last }}</td>
            <td>{{ workday.total }}</td>
            <td v-if="index == 0" :rowspan="employer.workdays?.length" text-center text="!xl" bg="#eee">
              <div flex flex-col items-center justify-center gap-2>
                <span font-bold>{{ workday.name }}</span>
                <span>{{ employer.totalHours() }}</span>
              </div>
            </td>
          </tr>
        </template>
        <!-- <tr >
          <td>{{ employer.name }}</td>


          <td>{{ employer.totalHours() }}</td>
        </tr> -->
      </tbody>
    </table>
  </div>
</template>

<script setup>
import readXlsxFile from 'read-excel-file'

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
    return Math.round(total * 100) / 100;
  }

}

const employers = ref([])

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
      const first = row[5];
      const last = row[6];
      const total = row[7];

      if (name == 'Ajjour' || name == 'Admin') return acc;

      const workday = new WorkDay(name, date, weekday, first, last, total);

      if (!acc[name]) {
        acc[name] = new Employer(name, []);
      }

      acc[name].workdays.push(workday);

      return acc;
    }, {});

  })

</script>


<style>
table.t {
  border: 1px solid #1C6EA4;
  background-color: #EEEEEE;
  width: 100%;
  text-align: left;
  border-collapse: collapse;
}

table.t td,
table.t th {
  border: 1px solid #AAAAAA;
  padding: 3px 2px;
}

table.t tbody td {
  font-size: 13px;
}

/* table.t tr:nth-child(even) {
  background: #D0E4F5;
} */

table.t thead {
  background: #1C6EA4;
  background: -moz-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
  background: -webkit-linear-gradient(top, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
  background: linear-gradient(to bottom, #5592bb 0%, #327cad 66%, #1C6EA4 100%);
  border-bottom: 2px solid #444444;
}

table.t thead th {
  font-size: 15px;
  font-weight: bold;
  color: #FFFFFF;
  border-left: 2px solid #D0E4F5;
}

table.t thead th:first-child {
  border-left: none;
}

table.t tfoot {
  font-size: 14px;
  font-weight: bold;
  color: #FFFFFF;
  background: #D0E4F5;
  background: -moz-linear-gradient(top, #dcebf7 0%, #d4e6f6 66%, #D0E4F5 100%);
  background: -webkit-linear-gradient(top, #dcebf7 0%, #d4e6f6 66%, #D0E4F5 100%);
  background: linear-gradient(to bottom, #dcebf7 0%, #d4e6f6 66%, #D0E4F5 100%);
  border-top: 2px solid #444444;
}

table.t tfoot td {
  font-size: 14px;
}

table.t tfoot .links {
  text-align: right;
}

table.t tfoot .links a {
  display: inline-block;
  background: #1C6EA4;
  color: #FFFFFF;
  padding: 2px 8px;
  border-radius: 5px;
}
</style>