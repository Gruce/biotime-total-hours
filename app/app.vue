<template>
  <div class="controller" text-center col-span-2 text-2xl font-bold mb-2 bg-slate-700 rounded-xl py-4 px-8 flex justify-between items-center text-white>
    <span>Upload First In Last Out Excel Report</span>
    <div flex items-center gap-4>
      <input ref="excelFile" type="file" @change="excelUpload()" />
      <div @click="print" v-if="Object.keys(employers).length > 0" py-2 px-4 cursor-pointer hover:bg-slate-900 bg-slate-800 rounded-xl>
        Print
      </div>
    </div>
  </div>
  <div class="containerCustom" v-if="Object.keys(employers).length > 0">
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

const startPeriod = ref(null);
const endPeriod = ref(null);

const excelFile = ref(null);

const employers = ref({})

const excelUpload = () => {
  const excel = excelFile.value.files[0];
  readXlsxFile(excel).then((rows) => {
    const { employers: e, startPeriod: sp, endPeriod: ep } = useExcel(rows)
    employers.value = e.value;
    startPeriod.value = sp;
    endPeriod.value = ep;
  })
}

const print = () => {
  window.print();
}

</script>

<style>
@page {
  size: A4;
  /* margin: 0 auto;
  margin-bottom: 0.5cm; */
}

@media print {

  html,
  body {
    width: 210mm;
    height: 297mm;
  }

  .containerCustom {
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