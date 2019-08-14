<template>
  <div>
    <v-alert
      v-model="showAlert"
      class="mb-4"
    >
      Готово

    </v-alert>
    <import-peoples-card v-on:sendFile="sendFile"></import-peoples-card>
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
            sendFile (file) {
                var formData = new FormData();
                formData.append("f", file);
                axios.post(`${BACKEND_URL}people?type=xlsx`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }})
                    .then(response => (this.showAlert = true));
            }
        },
        data: () => ({
            showAlert: false
        })
    }
</script>

<style scoped>

</style>
