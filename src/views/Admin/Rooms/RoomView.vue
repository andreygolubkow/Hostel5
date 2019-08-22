<template>
  <v-container>
  <v-container>
    <v-col>
    <v-row class="pa-2">
    <room-info-card v-bind:room="room"
                    v-on:changeRate="changeRate"
                    v-on:addNote="dialog = true"
                    v-on:peopleClick="peopleClick"
                    v-on:leftClick="leftClick"
                    v-on:rightClick="rightClick"
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
                  color="orange"
                >
                  <template v-slot:icon>
                    #
                  </template>
                  <v-row justify="space-between">
                    <v-col>
                      <p>
                        <v-chip-group
                          column
                          active-class="primary--text"
                        >
                          <v-chip small v-for="tag in tags" :key="tag" label :color="levelToColor(tag.level)"
                                  @click="putNoteTemplate(tag.text, tag.level)">
                            {{ tag.short }}
                          </v-chip>
                        </v-chip-group>
                      </p>
                    </v-col>
                  </v-row>
                </v-timeline-item>

                <v-timeline-item
                  v-for="(n, i) in notes"
                  class="mb-2"
                  :color="levelToColor(n.level)"
                  small
                >
                  <v-row justify="space-between">
                    <v-col>{{n.text}}</v-col>
                    <v-col class="text-right">{{formatTime(n.createdAt)}}</v-col>
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
        <v-card-title class="headline" :color="levelToColor(noteLevel)">
          <b :class="`${levelToColor(this.noteLevel)}--text`">#</b>
          Заметка
        </v-card-title>

        <v-card-text>
          <v-text-field
            label="Текст заметки"
            v-model="noteText"
          ></v-text-field>
          <p>
            <v-chip-group
              column
              active-class="primary--text"
            >
              <v-chip small color="grey" label @click="noteLevel = 0">
                Заметка
              </v-chip>
              <v-chip small color="teal" label @click="noteLevel = 1">
                Важная заметка
              </v-chip>
              <v-chip small color="green" label @click="noteLevel = 2">
                Сервис
              </v-chip>
              <v-chip small color="yellow" label @click="noteLevel = 3">
                Нарушение
              </v-chip>
              <v-chip small color="red" label @click="noteLevel = 4">
                Грубое нарушение
              </v-chip>
            </v-chip-group>
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
    import moment from "moment";

    export default {
        name: "RoomView",
        components: {RoomInfoCard},
        data: () => ({
            room: null,
            rooms:[],
            dialog: false,
            noteText: "",
            noteLevel: 0,
            id: -1,
            peopleDialog: false,
            currentPeople: null,
            notes: [],
            tags: [
                {
                    text: 'Комната ожидает визита электрика (запись в журнале есть)',
                    level: 2,
                    short: 'Электрик'
                },
                {
                    text: 'Комната ожидает визита плотника (запись в журнале есть)',
                    level: 2,
                    short: 'Плотник'
                },
                {
                    text: 'Шумели после 23:00',
                    level: 3,
                    short: 'Шум'
                },
                {
                    text: 'В комнате было грязно',
                    level: 3,
                    short: 'Грязь'
                },
                {
                    text: 'Хранили алкоголь или тару',
                    level: 3,
                    short: 'Алкоголь'
                },
                {
                    text: 'Нарушили правила пож. безопасности',
                    level: 3,
                    short: 'Пожарка'
                },
                {
                    text: 'Нет плитки под нагревательным эл. прибором',
                    level: 3,
                    short: 'Нет плитки'
                },
                {
                    text: 'Были замечены за курением в комнате',
                    level: 4,
                    short: 'Курение'
                },
                {
                    text: 'Были замечены за распитием алкоголя в комнате',
                    level: 4,
                    short: 'Распитие'
                },
                {
                    text: 'Помогли',
                    level: 1,
                    short: 'Помощь'
                },
            ]
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
                    .get(`${BACKEND_URL}room`)
                    .then(response => (this.rooms = response.data))
                    .then(() => {
                        this.rooms.sort(function compareFunction( a, b ) {
                            const r1 = Number.parseFloat(a._id);
                            const r2 = Number.parseFloat(b._id);
                            if ( r1<r2) {
                                return -1;
                            }
                            if ( r1>r2) {
                                return 1;
                            }
                            return 0;
                        });
                    });
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
            },
            formatTime (datetime) {
                return moment(datetime).format("DD.MM HH:mm");
            },
            leftClick () {
              if (this.rooms.length === 0) return;

              const index = this.rooms.findIndex(q => (q._id === this.id));
              if (index <= 0) {
                  this.id = this.rooms[this.rooms.length-1]._id;
              } else
              {
                  this.id = this.rooms[index-1]._id;
              }

              this.fetchData(this.id);
            },
            rightClick () {
                if (this.rooms.length === 0) return;

                const index = this.rooms.findIndex(q => (q._id === this.id));
                if (index >= this.rooms.length-1) {
                    this.id = this.rooms[0]._id;
                } else
                {
                    this.id = this.rooms[index+1]._id;
                }

                this.fetchData(this.id);
            }
        }
    }
</script>

<style scoped>
  .chips-padding {
    padding: 5px 5px 5px 5px;
  }

  span {
    /**
             * Для эксплорера
             */
    -ms-user-select: none;

    /**
     * Для мозилы
     */
    -moz-user-select: none;

    /**
     * Для конкверора
     */
    -khtml-user-select: none;

    /**
     * Для Сафари и Хрома
     */
    -webkit-user-select: none;
  }
</style>
