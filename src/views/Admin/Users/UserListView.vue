<template>
  <v-container>
  <v-layout
    wrap >
    <v-flex xs12>
      <v-progress-linear
        v-if="!users"
        indeterminate
        color="primary"
      ></v-progress-linear>

      <v-card v-if="users">
        <v-list three-line>
          <v-container>
            <v-list-item v-for="(u, index) in users" :to="{ name: 'user-view', params: { id: u._id }}">
              <v-list-item-content>
                <v-list-item-title>{{u.name}}</v-list-item-title>
                <v-list-item-subtitle>
                  {{`к.${u.room.room}, ${u.username}`}}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-container>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
  </v-container>
</template>

<script>
    import axios from "axios";
    import {BACKEND_URL} from "../../../backend";

    export default {
        name: "UserListView",
        data: () => ({
            users: [],
            edit: false
        }),
        methods: {
            viewPeople(people) {
                console.log(people);
            },
            trashClick (id) {
                axios
                    .delete(`${BACKEND_URL}user/${id}`)
                    .then(response => (this.fetchData()));
            },
            fetchData: function () {
                axios
                    .get(`${BACKEND_URL}user`)
                    .then(response => (this.users = response.data))
                    .then(() => {
                        this.users.sort(function compareFunction( a, b ) {
                            const r1 = Number.parseFloat(a.name);
                            const r2 = Number.parseFloat(b.name);
                            if ( r1<r2) {
                                return -1;
                            }
                            if ( r1>r2) {
                                return 1;
                            }
                            return 0;
                        });
                    });
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
            // при изменениях маршрута запрашиваем данные снова
            '$route': 'fetchData',
            '$route.query.edit': {
                handler: function(edit) {
                    this.edit = edit;
                },
                deep: true,
                immediate: true
            }
        },
    }
</script>

<style scoped>

</style>
