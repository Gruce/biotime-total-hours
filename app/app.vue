<template>
  <div>
    <!-- HELLO -->
    <!-- <NuxtWelcome /> -->
    test
  </div>
</template>

<script setup>

fetch('t.xlsx')
  .then(response => response.blob())
  .then(blob => readXlsxFile(blob))
  .then((rows) => {
    // `rows` is an array of rows
    // each row being an array of cells.
    console.log(rows)
  })

</script>
