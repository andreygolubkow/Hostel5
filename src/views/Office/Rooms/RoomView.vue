<template>
  <v-container>
  <v-container>
    <v-col>
    <v-row class="pa-2">
    <room-info-card v-bind:room="room"
                    v-on:changeRate="changeRate"
                    v-on:addNote="dialog = true"
                    v-on:peopleClick="peopleClick"
                    >
    </room-info-card>
    </v-row>
    <v-row class="pa-2">
      <v-flex xs12>
        <v-card >
          <v-card-text>
            <v-container>
              <v-timeline dense clipped>
                <v-timeline-item
                  class="mb-4"
                  color="orange"
                  icon-color="grey lighten-2"
                  fill-dot
                >
                  <v-row justify="space-between">
                    <v-col cols="7">This order was archived.</v-col>
                    <v-col class="text-right" cols="5">15:26 EDT</v-col>
                  </v-row>
                </v-timeline-item>

                <v-timeline-item
                  v-for="(n, i) in notes"
                  class="mb-2"
                  :color="levelToColor(n.level)"
                  small
                >
                  <v-row justify="space-between">
                    <v-col cols="7">{{n.text}}</v-col>
                    <v-col class="text-right" cols="5">{{n.createdAt}}</v-col>
                  </v-row>
                </v-timeline-item>

              </v-timeline>
            </v-container>

          </v-card-text>
        </v-card>
      </v-flex>
    </v-row>

    </v-col>
  </v-container>


    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Заметка</v-card-title>

        <v-card-text>
          <v-text-field
            label="Текст заметки"
            v-model="noteText"
          ></v-text-field>

        <p>
          <v-chip
            small
            class="mr-2 chips-padding"
            @click="putNoteTemplate(`Шум`, 2)"
          >
            Шум
          </v-chip>
          <v-chip
            small
            class="mr-2 chips-padding"
            @click="putNoteTemplate(`Нет плитки`, 2)"
          >
            Нет плитки
          </v-chip>
          <v-chip
            small
            class="mr-2 chips-padding"
            @click="putNoteTemplate(`Грязно`, 2)"
          >
            Грязно
          </v-chip>
        </p>
          <p>
            <v-chip
              small
              class="mr-2 chips-padding"
              color="orange"
              text-color="white"
              @click="putNoteTemplate(`Нужен Плотник`, 4)"
            >
              Плотник
            </v-chip>
            <v-chip
              small
              color="orange"
              text-color="white"
              class="mr-2 chips-padding"
              @click="putNoteTemplate(`Нужен Электрик`, 4)"
            >
              Электрик
            </v-chip>
          </p>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            text
            @click="closeNoteDialog()"
          >
            Отмена
          </v-btn>

          <v-btn
            color="green"
            text
            @click="addNote"
          >
            Добавить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="peopleDialog" fullscreen hide-overlay transition="dialog-bottom-transition" >
      <v-card v-if="currentPeople">
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="peopleDialog = false">
            <v-icon small>fa-times</v-icon>
          </v-btn>
          <v-toolbar-title>{{currentPeople.name}}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  icon
                  v-on="on"
                >
                  <v-icon small>
                    fa-ellipsis-v
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="changePersonalRate(1)">
                  <v-list-item-title>+1</v-list-item-title>
                </v-list-item>

                <v-list-item @click="changePersonalRate(-1)">
                  <v-list-item-title>-1</v-list-item-title>
                </v-list-item>

                <v-list-item :to="{ name: 'people-view', params: { id: currentPeople._id }}">
                  <v-list-item-title>Личная карточка</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar-items>
        </v-toolbar>
        <v-list two-line dense>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{currentPeople.citizen}}</v-list-item-title>
              <v-list-item-subtitle>{{currentPeople.dob}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{currentPeople.group}}</v-list-item-title>
              <v-list-item-subtitle>{{currentPeople.faculty}} {{currentPeople.eduForm}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :href="`tel:${currentPeople.phone}`">
            <v-list-item-content>
              <v-list-item-title><v-icon small>fa-phone</v-icon>{{` ${currentPeople.phone}`}}</v-list-item-title>
              <v-list-item-subtitle>rate: {{currentPeople.rate}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list two-line dense v-if="currentPeople.notes && currentPeople.notes.length>0">
          <v-list-item two-line v-for="note in currentPeople.notes">
            <v-list-item-content>
              <v-list-item-title>{{note.date}}</v-list-item-title>
              <v-list-item-subtitle>{{note.text}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
    import PeopleInfoCard from "../../../components/PeopleInfoCard";
    import axios from "axios";
    import {BACKEND_URL} from "../../../backend";
    import RoomInfoCard from "../../../components/RoomInfoCard";

    export default {
        name: "RoomView",
        components: {RoomInfoCard},
        data: () => ({
            room: null,
            dialog: false,
            noteText: "",
            noteLevel: 0,
            id: -1,
            peopleDialog: false,
            currentPeople: null,
            notes: []
        }),
        watch: {
            '$route.params.id': {
                handler: function(id) {
                    this.id = id;
                    this.fetchData(id);
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            peopleClick (people) {
                this.currentPeople = people;
                this.peopleDialog = true;
            },
            fetchData(id) {
                axios
                    .get(`${BACKEND_URL}room/${id}`)
                    .then(response => (this.room = response.data));
                axios
                    .get(`${BACKEND_URL}room/${id}/note`)
                    .then(response => (this.notes = response.data));
            },
            changeRate(rate) {
                var requests = [];
                for (var i = 0; i < this.room.peoples.length; i++) {
                    var people = this.room.peoples[i];
                    const newRate = people.rate + rate;
                    requests.push(axios
                                  .post(`${BACKEND_URL}people/${people._id}/rate`, {rate: newRate}));
                }
                axios.all(requests)
                    .then((t) => (this.fetchData(this.id)));
            },
            changePersonalRate(rate) {
                const newRate = this.currentPeople.rate + rate;
                axios
                    .post(`${BACKEND_URL}people/${this.currentPeople._id}/rate`, {rate: newRate})
                    .then(response => (this.currentPeople = response.data))
                    .then(() => this.fetchData(this.id));
            },
            addNote() {
                if (this.noteText.length !== 0) {
                    axios
                        .post(`${BACKEND_URL}room/${this.id}/note`, {text: this.noteText, room: this.id, level: this.noteLevel})
                        .then(t => this.closeNoteDialog())
                        .then(() => this.fetchData(this.id));
                }
            },
            closeNoteDialog() {
                this.noteText = "";
                this.noteLevel = 0;
                this.dialog = false;
            },
            putNoteTemplate(template, level) {
                if (this.noteText === template) {
                  this.addNote();
                } else {
                    this.noteText = template;
                    this.noteLevel = level;
                }
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

            }
        }
    }
</script>

<style scoped>
  .chips-padding {
    padding: 5px 5px 5px 5px;
  }
</style>
