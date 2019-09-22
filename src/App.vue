<template>
    <v-content>
      <router-view/>
    </v-content>
</template>

<script>

import {MAIN_URL} from "./mainPage";
import {BACKEND_URL} from "./backend";
import axios from "axios";

export default {
  name: 'App',
  data: () => ({
    //
  }),
    methods: {
        fetchData () {
            // Для проверки есть ли авторизация или нет.
            axios
                .get(`${BACKEND_URL}me`)
                .then(response => {
                    if (response.status === 401) {
                        window.location.replace(MAIN_URL);
                    }
                    return;
                }).catch(err => (
                  window.location.replace(MAIN_URL)
            ));
        }
    },
    created() {
        this.fetchData();
    }
};
</script>
