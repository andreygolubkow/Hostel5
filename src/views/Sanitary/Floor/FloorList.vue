<template>
  <v-container>
    <v-container v-for="(f,i) in floor">
      <floor-card :floor="f"></floor-card>
    </v-container>
  </v-container>
</template>

<script>
    import FloorCard from "../../../components/FloorCard";
    import axios from "axios";
    import {BACKEND_URL} from "../../../backend";

    export default {
        name: 'FloorList',
        components: {FloorCard},
        data: () => ({
            floor: []
            //
        }),
        methods: {
            fetchData() {
                axios.get(`${BACKEND_URL}floor`).then((res) => {
                    this.floor = res.data;
                    this.sortFloorRooms(this.floor);
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
                        const aI = Number(a.floor);
                        const bI = Number(b.floor);
                        if (aI < bI) {
                            return -1;
                        } else if (aI > bI) {
                            return 1;
                        } else {
                            return 0;
                        }
                    })
                });
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
            // при изменениях маршрута запрашиваем данные снова
            '$route': 'fetchData',
        },
    };
</script>
