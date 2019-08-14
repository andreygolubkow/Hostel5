<template>
    <peoples-list v-bind:peoples="peoples"
                  v-on:trashClick="trashClick" :editor="edit"></peoples-list>
</template>

<script>
    import PeoplesList from "../../../components/PeoplesListCard";
    import axios from "axios";
    import {BACKEND_URL} from "../../../backend";

    export default {
        name: "PeoplesListView",
        components: {PeoplesList},
        data: () => ({
            peoples: [],
            edit: false
        }),
        methods: {
            viewPeople(people) {
                console.log(people);
            },
            trashClick (id) {
                axios
                    .delete(`${BACKEND_URL}people/${id}`)
                    .then(response => (this.fetchData()));
            },
            fetchData: function () {
                axios
                    .get(`${BACKEND_URL}people`)
                    .then(response => (this.peoples = response.data))
                    .then(() => {
                        this.peoples.sort(function compareFunction( a, b ) {
                            const r1 = Number.parseFloat(a.room);
                            const r2 = Number.parseFloat(b.room);
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
            // загружаем данные, когда представление создано
            // и данные реактивно отслеживаются
            this.fetchData()
        },
        watch: {
            // при изменениях маршрута запрашиваем данные снова
            '$route': 'fetchData',
            '$route.query.edit': {
                handler: function(edit) {
                    this.edit = edit;
                },
                deep: true,
                immediate: true
            }
        },
    }
</script>

<style scoped>

</style>
