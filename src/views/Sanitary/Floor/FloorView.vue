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
              <span v-if="r.allScore && r.allScore[todayDate] !== null" class="text--primary">
                Сегодня: {{r.allScore[todayDate]}}
              </span>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="setScore(r,5)" text color="green" icon small>5</v-btn>

              <v-btn @click="setScore(r,4)" text color="blue" icon small>4</v-btn>

              <v-btn @click="setScore(r,3)" text color="orange" icon small>3</v-btn>

              <v-btn @click="setScore(r,2)" text small color="red" icon>2</v-btn>

              <v-btn @click="setScore(r,0)" text small color="black" icon>Н</v-btn>
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
          return  res.data.map((fl) => ({
              _id: fl._id,
              rooms: fl.rooms.map((r) => ({
                  _id: r._id,
                  room: r.room,
                  sanitation: this.getLast5(r.sanitation),
                  allScore: r.sanitation
              }))
          }));
        })
        .then(fl => {
            const sorted = this.sortFloorRooms(fl);
            this.floor = sorted;
            return this.floor;
        })
        .then(() => {
            if (link) {
                this.$vuetify.goTo(`[room="${this.id}"]`, {});
            }
            return;
        });
    },
      sortFloorRooms(floors) {
          floors.sort((a,b) => {
              const aI = Number(a.floor);
              const bI = Number(b.floor);
              if (aI < bI) {
                  return -1;
              } else if (aI > bI) {
                  return 1;
              } else {
                  return 0;
              }
          });
          floors.forEach((f) => {
              f.rooms.sort((a,b) => {
                  const aI = Number(a.room);
                  const bI = Number(b.room);
                  if (aI < bI) {
                      return -1;
                  } else if (aI > bI) {
                      return 1;
                  } else {
                      return 0;
                  }
              });
          });
          return floors;
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
          let arr = [];
          arr.push(...Object.keys(o));
          arr.sort(function (left, right) {
              return moment.utc(left, "DD.MM.YYYY").diff(moment.utc(right, "DD.MM.YYYY"))
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
  },
    computed: {
      todayDate () {
          return moment().format('DD.MM.YYYY').toString();
        }
    }
};
</script>
