<template>
    <rooms-list-card v-bind:rooms="rooms"></rooms-list-card>
</template>

<script>
    import axios from "axios";
    import {BACKEND_URL} from "../../../backend";
    import RoomsListCard from "../../../components/RoomsListCard";

    export default {
        name: "FloorsListView",
        components: {RoomsListCard},
        data: () => ({
            rooms: [],
        }),
        methods: {
            fetchData: function () {
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
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
            // при изменениях маршрута запрашиваем данные снова
            '$route': 'fetchData',
        },
    }
</script>

<style scoped>

</style>
