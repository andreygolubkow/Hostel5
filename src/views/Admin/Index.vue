<template>
    <v-container>
      <v-layout wrap>
        <v-col>
          <v-row class="pa-1 ma-2" align="center">
            <v-card
                v-if="monthNotesByRoom.length > 0"
                class="mt-2 pa-1 ma-2 mx-auto col-sm-5 col-xs-12"
                max-width="800"
              >
                <v-sheet
                  class="v-sheet--offset mx-auto"
                  color="cyan"
                  elevation="12"
                  max-width="calc(100% - 32px)"
                >
                  <v-sparkline
                    :value="monthNotesByRoomCounter"
                    smooth="1"
                    radius="0.1"
                    line-width="1"
                    color="white"
                    auto-draw
                    padding="10"
                  ></v-sparkline>
                </v-sheet>

                <v-card-text class="pt-0">
                  <div class="title font-weight-light mb-2">Заметки по комнатам</div>
                  <div class="subheading font-weight-light grey--text">Данные за месяц</div>
                </v-card-text>
              </v-card>
              <v-card xs3 v-if="monthNotesByRoom.length > 0" class="mt-2 pa-1 ma-2 mx-auto col-sm-5 col-xs-12">
                <v-card-title>
                  <v-row justify="space-between">
                    <v-col class="title mb-2">Комната</v-col>
                    <v-col class="text-right subheading  subtitle-2 grey--text ">Кол-во</v-col>
                  </v-row>
                </v-card-title>
                <v-list>
                  <v-list-item v-for="(top,i) in top3inMonth" :to="{ name: 'room-view', params: { id: top.room._id }}">
                    <v-list-item-title >
                      <v-row justify="space-between">
                        <v-col>{{top.room.room}}</v-col>
                        <v-col class="text-right">{{top.count}}</v-col>
                      </v-row>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
          </v-row>

          <v-row>
            <v-card  class="mt-2 pa-1 ma-2 mx-auto col-sm-5 col-xs-12"
            :color="levelToColor(2)" v-if="notesByLevel(2).length !== 0">

                <v-list-item dense two-line v-for="(note,i) in notesByLevel(2)" :to="{ name: 'room-view', params: { id: note.room._id }}">
                  <v-list-item-content>
                  <v-list-item-title >
                    {{note.text}}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-row justify="space-between">
                      <v-col>{{note.room.room}}</v-col>
                      <v-col class="text-right">{{formatTime(note.createdAt)}}</v-col>
                    </v-row>
                  </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
            </v-card>

            <v-card class="mt-2 pa-1 ma-2 mx-auto col-sm-5 col-xs-12">
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
                <v-list-item v-for="(res,i) in searchResults" two-line dense :to="{ name: 'people-view', params: { id: res._id }}">
                  <v-list-item-content>
                    <v-list-item-title>
                      {{res.name}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{res.room.room}}
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
            weekNotes: [],
            monthNotes: [],
            weekNotesByRoom: [],
            monthNotesByRoom: [],
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
                    .get(`${BACKEND_URL}search/notes/lastweek`)
                    .then(response => (this.weekNotes = response.data))
                    .then(() => {
                        for (var i = 1; i <= 45; i++) {
                            this.weekNotesByRoom.push( this.weekNotes.filter((n) => (n.room.room.slice(-2) === `${i}`)));
                        }
                    });

                axios
                    .get(`${BACKEND_URL}search/notes/lastmonth`)
                    .then(response => (this.monthNotes = response.data))
                    .then(() => {
                        this.monthNotesByRoom = [];
                        for (var i = 3; i <= 45; i++) {
                            this.monthNotesByRoom.push( this.monthNotes.filter((n) => (n.room.room.slice(-2) === `${i}`)));
                        }
                    });
            },
            levelToColor (level) {
                const colors = ['grey', 'teal', 'green', 'yellow', 'red', 'red accent-4'];
                if (level < 0 ) {
                    return colors[0];
                }

                if (level > 5 ) {
                    return colors[5];
                }
                return colors[level];
            },
            formatTime (datetime) {
                return moment(datetime).format("DD.MM HH:mm");
            },
            notesByLevel (level) {
                return this.weekNotes.filter((n) => (n.level === level));
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
          rooms () {
              var labels = [];

              for (var i = 3; i <= 45; i++) {
                  labels.push(i);
              }
              return labels;
          },
            weekNotesByRoomCounter () {
              return this.weekNotesByRoom.map(o => (o.length));
            },
            monthNotesByRoomCounter () {
                return this.monthNotesByRoom.map(o => (o.length));
            },
            top3inMonth () {
                const arr = this.monthNotesByRoom.filter(o=>(o.length>0)).map(o => ({room: o[0].room, count: o.length}));
                arr.sort((a,b) => (a.count-b.count));
                return arr.slice(-3);
            }
        }
    }

</script>

<style scoped>
  .v-sheet--offset {
    top: -24px;
    position: relative;
  }
</style>
