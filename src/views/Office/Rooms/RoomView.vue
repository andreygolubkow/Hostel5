<template>
  <div>
    <room-info-card v-bind:room="room"
                    v-on:changeRate="changeRate"
                    v-on:addNote="dialog = true"
                    v-on:peopleClick="peopleClick"
                    >
    </room-info-card>


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
            @click="putNoteTemplate(`Шум`)"
          >
            Шум
          </v-chip>
          <v-chip
            small
            class="mr-2 chips-padding"
            @click="putNoteTemplate(`Нет плитки`)"
          >
            Нет плитки
          </v-chip>
          <v-chip
            small
            class="mr-2 chips-padding"
            @click="putNoteTemplate(`Грязно`)"
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
              @click="putNoteTemplate(`Нужен Плотник`)"
            >
              Плотник
            </v-chip>
            <v-chip
              small
              color="orange"
              text-color="white"
              class="mr-2 chips-padding"
              @click="putNoteTemplate(`Нужен Электрик`)"
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
            <v-icon>fa-times</v-icon>
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
                  <v-icon>
                    fa-ellipsis-v
                  </v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>+1</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>-1</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <v-list-item-title>Заметка</v-list-item-title>
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
  </div>
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
            id: -1,
            peopleDialog: false,
            currentPeople: null
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
            },
            changeRate(rate) {
                const newRate = this.room.rate + rate;
                axios
                    .post(`${BACKEND_URL}room/${this.id}/rate`, {rate: newRate})
                    .then(response => (this.room = response.data))
                    .then(() => this.fetchData(this.id));
            },
            addNote() {
                if (this.noteText.length !== 0) {
                    axios
                        .post(`${BACKEND_URL}people/${this.id}/note`, {note: this.noteText})
                        .then(response => (this.people = response.data))
                        .then(t => this.closeNoteDialog())
                        .then(() => this.fetchData(this.id));
                }
            },
            closeNoteDialog() {
                this.noteText = "";
                this.dialog = false;
            },
            putNoteTemplate(template) {
                if (this.noteText === template) {
                  this.addNote();
                } else {
                    this.noteText = template;
                }
            }
        }
    }
</script>

<style scoped>
  .chips-padding {
    padding: 5px 5px 5px 5px;
  }
</style>
