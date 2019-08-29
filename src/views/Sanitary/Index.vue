<template>
    <v-container>
      <v-layout wrap>
        <v-col>
          <v-row class="pa-1 ma-2" align="center" xs11 md5>
              <v-card xs11 md5 v-if="badRooms.length > 0" class="mt-2 pa-1 ma-2 mx-auto">
                <v-card-title>
                  <v-row justify="space-between">
                    <v-col class="title">Обратите внимание</v-col>
                  </v-row>
                </v-card-title>
                <v-list>
                  <v-list-item v-for="(bad) in badRooms" :to="{ name: 'floor-view', params: { id: bad._id }}">
                    <v-list-item-title >
                      <v-row justify="space-between">
                        <v-col>{{bad.room}}</v-col>
                      </v-row>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>

            <v-card class="mt-2 pa-1 ma-2 mx-auto" xs11 md5>
              <v-card-title>
                <v-text-field
                  label="Поиск людей"
                  single-line
                  flat
                  v-model="searchInput"
                  @click:append-outer="search"
                  append-outer-icon="fa-search"
                ></v-text-field>
              </v-card-title>
              <v-card-text>
                <v-list-item v-for="(res,i) in searchResults" two-line dense>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{res.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      к.{{res.room.room}}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-card-text>
            </v-card>


          </v-row>


        </v-col>
      </v-layout>
    </v-container>
</template>

<script>
    import {BACKEND_URL} from "../../backend";
    import axios from "axios";
    import moment from "moment";

    export default {
        name: "Index",
        data: () => ({
            badRooms: [],
            searchInput: '',
            searchResults: []
        }),
        methods: {
            search () {
                axios
                    .get(`${BACKEND_URL}search/people?q=${this.searchInput}`)
                    .then(response => (this.searchResults = response.data));
            },
            fetchData: function () {
                axios
                    .get(`${BACKEND_URL}search/rooms/bad`)
                    .then(response => (this.badRooms = response.data));
            },
            formatTime (datetime) {
                return moment(datetime).format("DD.MM HH:mm");
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
            // при изменениях маршрута запрашиваем данные снова
            '$route': 'fetchData',
        },
        computed: {

        }
    }

</script>

<style scoped>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
</style>
