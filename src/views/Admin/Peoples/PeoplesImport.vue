<template>
  <div>
    <v-alert
      v-model="showAlert"
      class="mb-4"
    >
      Готово

    </v-alert>
    <import-peoples-card v-on:sendPeoples="sendPeoples"></import-peoples-card>
  </div>
</template>

<script>
    import ImportPeoplesCard from "../../../components/ImportPeoplesCard";
    import axios from "axios";
    import {BACKEND_URL} from "../../../backend";

    export default {
        name: "PeoplesImport",
        components: {ImportPeoplesCard},
        methods: {
            sendPeoples (peoples) {

            }
        },
        data: () => ({
            showAlert: false
        })
    }
</script>

<style scoped>

</style>
