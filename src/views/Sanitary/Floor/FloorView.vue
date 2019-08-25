<template>
  <div class="d-flex flex-column justify-center align-center">
    <v-container v-for="(f, i) in floor">
      <v-container v-for="r in f.rooms">
        <v-container>
          <v-card
            class="mt-2 ml-auto mr-auto align-center justify-center"
            :room="r._id"
            max-width="400"
          >
            <v-sheet color="cyan" tile v-if="r.sanitation">

              <v-sparkline
                v-if="r.sanitation.length>0"
                :value="r.sanitation"
                auto-draw
                color="white"
                height="150"
                padding="24"
                stroke-linecap="round"
                smooth
              >
              </v-sparkline>


              <v-card-title class="align-end fill-height white--text"
                >Комната {{ r.room }}</v-card-title>
            </v-sheet>

            <v-card-text>
              <span v-if="r.todayScore" class="text--primary">
                Оценка {{r.todayScore}}
              </span>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="setScore(r,5)" text color="green" icon small>5</v-btn>

              <v-btn @click="setScore(r,4)" text color="blue" icon small>4</v-btn>

              <v-btn @click="setScore(r,3)" text color="orange" icon small>3</v-btn>

              <v-btn @click="setScore(r,2)" text small color="red" icon>2</v-btn>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-container>
    </v-container>
  </div>
</template>

<script>
import FloorCard from "../../../components/FloorCard";
import axios from "axios";
import { BACKEND_URL } from "../../../backend";
import moment from "moment";

export default {
  name: "FloorView",
  components: { FloorCard },
  data: () => ({
    floor: [],
    id: 0
  }),
  methods: {
    fetchData(link) {
      axios
        .get(`${BACKEND_URL}floor`)
        .then(res => {
          this.floor = res.data.map((fl) => ({
              _id: fl._id,
              rooms: fl.rooms.map((r) => ({
                  _id: r._id,
                  room: r.room,
                  sanitation: this.getLast5(r.sanitation)
              }))
          }));
        })
        .then(() => {
            if (link) {
                this.$vuetify.goTo(`[room="${this.id}"]`, {});
            }
        });
    },
      setScore(room, score) {
          const date = moment().format('DD.MM.YYYY');
          axios.post(`${BACKEND_URL}room/${room._id}/score`, {
              date: date,
              score: score
          }).then((data) => {
              this.fetchData();
          });
      },
      getLast5(o) {
        if (!o) {
            return [];
        }
          let arr = Object.keys(o);
          arr.sort((a,b) => {
                  if (moment(a).timestamp < moment(b).timestamp) {
                      return -1
                  } else if (moment(b).timestamp < moment(a).timestamp) {
                      return 1;
                  } else {
                      return 0;
                  }
          });
          const dates = arr.slice(-5);
          return dates.map((d) => o[d]);
      }
  },
  created() {
    this.fetchData();
  },
  watch: {
    "$route.params.id": {
      handler: function(id) {
        this.id = id;
        this.fetchData(id);
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
