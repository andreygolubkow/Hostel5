<template>
  <div>
    <people-info-card v-bind:people="people" v-on:changeRate="changeRate" v-on:addNote="dialog = true"></people-info-card>
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
  </div>
</template>

<script>
    import PeopleInfoCard from "../../../components/PeopleInfoCard";
    import axios from "axios";
    import {BACKEND_URL} from "../../../backend";

    export default {
        name: "PeopleView",
        components: {PeopleInfoCard},
        data: () => ({
            people: null,
            dialog: false,
            noteText: "",
            id: -1
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
            fetchData(id) {
                axios
                    .get(`${BACKEND_URL}people/${id}`)
                    .then(response => (this.people = response.data));
            },
            changeRate(rate) {
                const newRate = this.people.rate + rate;
                axios
                    .post(`${BACKEND_URL}people/${this.id}/rate`, {rate: newRate})
                    .then(response => (this.people = response.data))
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
