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
            <v-sheet color="cyan" tile>
              <v-sparkline
                :value="[3, 4, 4, 5, 5]"
                auto-draw
                color="white"
                height="150"
                padding="24"
                stroke-linecap="round"
                smooth
              >
              </v-sparkline>
              <v-card-title class="align-end fill-height white--text"
                >Комната {{ r.room }}</v-card-title
              >
            </v-sheet>

            <v-card-text>
              <span class="text--primary">
                <v-container> <span>Иванов Олег</span><br /> </v-container>
              </span>
            </v-card-text>

            <v-card-actions>
              <v-btn text color="green" icon small>5</v-btn>

              <v-btn text color="blue" icon small>4</v-btn>

              <v-btn text color="orange" icon small>3</v-btn>

              <v-btn text small color="red" icon>2</v-btn>
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

export default {
  name: "FloorView",
  components: { FloorCard },
  data: () => ({
    floor: [],
    id: 0
  }),
  methods: {
    fetchData() {
      axios
        .get(`${BACKEND_URL}floor`)
        .then(res => {
          this.floor = res.data;
        })
        .then(() => {
          this.$vuetify.goTo(`[room="${this.id}"]`, {});
        });
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
